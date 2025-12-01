use tauri_plugin_sql::Migration;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_url = "sqlite:kron.db";

    let migrations = vec![Migration {
        version: 1,
        description: "initial_schema",
        sql: include_str!("../../db/migrations/0001_initial_schema.sql"),
        kind: tauri_plugin_sql::MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations(db_url, migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
