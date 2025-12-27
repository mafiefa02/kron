use chrono::{Datelike, Local, Timelike};
use rodio::{source::SineWave, Decoder, OutputStream, Sink, Source};
use sqlx::{sqlite::SqlitePool, Row};
use std::fs::File;
use std::io::BufReader;
use std::path::Path;
use std::time::Duration;
use tauri::Manager;

#[derive(serde::Deserialize)]
struct AppSettings {
    active_profile: Option<i64>,
}

pub fn start_scheduler(app: &tauri::AppHandle) {
    let app_path = app.path().app_config_dir().expect("failed to get app config dir");
    let db_path = app_path.join("kron.db");
    let config_path = app_path.join("config.json");
    let db_url = format!("sqlite:{}", db_path.to_string_lossy());

    tauri::async_runtime::spawn(async move {
        println!("Scheduler started with DB: {}", db_url);
        
        let pool = match SqlitePool::connect(&db_url).await {
            Ok(p) => p,
            Err(e) => {
                eprintln!("Failed to connect to scheduler DB at {}: {}", db_url, e);
                return;
            }
        };

        let mut interval = tokio::time::interval(Duration::from_secs(1));
        let mut last_processed_minute: Option<String> = None;

        loop {
            interval.tick().await;
            let now = Local::now();
            let current_minute_str = now.format("%Y-%m-%d %H:%M").to_string();

            // Prevent multiple triggers within the same minute
            if last_processed_minute.as_deref() == Some(&current_minute_str) {
                continue;
            }

            // Read active profile
            let active_profile_id = if config_path.exists() {
                match std::fs::read_to_string(&config_path) {
                    Ok(content) => {
                        match serde_json::from_str::<AppSettings>(&content) {
                            Ok(settings) => settings.active_profile,
                            Err(e) => {
                                eprintln!("Failed to parse config.json: {}", e);
                                None
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!("Failed to read config.json: {}", e);
                        None
                    }
                }
            } else {
                None
            };

            if let Some(profile_id) = active_profile_id {
                 match check_schedules(&pool, now, profile_id).await {
                    Ok(sounds) => {
                        for sound_file in sounds {
                            play_sound(sound_file);
                        }
                    }
                    Err(e) => eprintln!("Error checking schedules: {}", e),
                }
            } else {
                // If no active profile is set or config is missing, we probably shouldn't play anything
                // or maybe we should wait for one to be set.
            }

            last_processed_minute = Some(current_minute_str);
        }
    });
}

async fn check_schedules(pool: &SqlitePool, now: chrono::DateTime<Local>, profile_id: i64) -> Result<Vec<Option<String>>, sqlx::Error> {
    let current_minutes = (now.hour() * 60 + now.minute()) as i64;
    let today_str = now.format("%Y-%m-%d").to_string();
    let day_of_week = now.weekday().number_from_monday() as i32; // 1-7

    // Query for matching schedules
    // We consider:
    // 1. Base schedule matches current time.
    // 2. Overrides for today:
    //    - If cancelled, ignore.
    //    - If new_time is set, use it.
    //    - If new_sound_id is set, use it.
    
    // We want schedules where:
    // Effective time == current_minutes
    // AND
    // (If override exists, not cancelled)
    // AND
    // (Recurrence rules match for today)
    // AND
    // profile_id matches

    let query = "
        SELECT
            s.id,
            COALESCE(snd_override.file_name, snd.file_name) as sound_file_name,
            s.sound_id,
            so.new_sound_id
        FROM schedules s
        LEFT JOIN schedule_overrides so ON s.id = so.schedule_id AND so.original_date = ?
        LEFT JOIN sounds snd ON s.sound_id = snd.id
        LEFT JOIN sounds snd_override ON so.new_sound_id = snd_override.id
        WHERE
            s.profile_id = ?
            AND s.is_active = 1
            AND (so.is_cancelled IS NULL OR so.is_cancelled = 0)
            -- Effective time check
            AND COALESCE(so.new_time, s.time) = ?
            -- Recurrence check
            AND (
                (s.repeat = 'once' AND s.start_date = ?)
                OR
                (s.repeat = 'daily' AND s.start_date <= ? AND (s.end_date IS NULL OR s.end_date >= ?))
                OR
                (s.repeat = 'weekly' AND s.start_date <= ? AND (s.end_date IS NULL OR s.end_date >= ?) 
                 AND EXISTS (SELECT 1 FROM schedule_days sd WHERE sd.schedule_id = s.id AND sd.day_of_week = ?))
            )
    ";

    let rows = sqlx::query(query)
        .bind(&today_str)      // so.original_date
        .bind(profile_id)      // s.profile_id
        .bind(current_minutes) // effective_time
        .bind(&today_str)      // once start_date
        .bind(&today_str)      // daily start_date
        .bind(&today_str)      // daily end_date
        .bind(&today_str)      // weekly start_date
        .bind(&today_str)      // weekly end_date
        .bind(day_of_week)     // weekly day_of_week
        .fetch_all(pool)
        .await?;

    let mut sounds_to_play = Vec::new();

    for row in rows {
        let file_name: Option<String> = row.try_get("sound_file_name").ok();
        sounds_to_play.push(file_name);
    }

    Ok(sounds_to_play)
}

fn play_sound(file_path: Option<String>) {
    std::thread::spawn(move || {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();

        match file_path {
            Some(path) => {
                let p = Path::new(&path);
                if p.exists() {
                    match File::open(p) {
                        Ok(file) => {
                            let reader = BufReader::new(file);
                            match Decoder::new(reader) {
                                Ok(source) => {
                                    sink.append(source);
                                    sink.sleep_until_end();
                                }
                                Err(e) => {
                                    eprintln!("Error decoding sound file {}: {}", path, e);
                                    play_default_beep(&sink);
                                }
                            }
                        }
                        Err(e) => {
                            eprintln!("Error opening sound file {}: {}", path, e);
                            play_default_beep(&sink);
                        }
                    }
                } else {
                    eprintln!("Sound file not found: {}", path);
                    play_default_beep(&sink);
                }
            }
            None => {
                // Play default sound
                // Try to find "default_sound.mp3" or similar?
                // For now, use a beep as fallback or if specifically requested "default" (null)
                // We'll try to look for a file named "default_sound.mp3" in the current directory.
                // If not found, we beep.
                let default_path = Path::new("default_sound.mp3");
                if default_path.exists() {
                    if let Ok(file) = File::open(default_path) {
                        if let Ok(source) = Decoder::new(BufReader::new(file)) {
                            sink.append(source);
                            sink.sleep_until_end();
                            return;
                        }
                    }
                }

                play_default_beep(&sink);
            }
        }
    });
}

fn play_default_beep(sink: &Sink) {
    // Play a sine wave beep as a fallback
    let source = SineWave::new(440.0)
        .take_duration(Duration::from_secs_f32(1.0))
        .amplify(0.20);
    sink.append(source);
    sink.sleep_until_end();
}
