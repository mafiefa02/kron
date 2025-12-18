-- Seed Sounds
INSERT INTO sounds (name, file_name) VALUES 
('Glass', 'Glass.aiff'),
('Ping', 'Ping.aiff'),
('Submarine', 'Submarine.aiff');

-- Seed Profiles
INSERT INTO profiles (name, timezone) VALUES 
('Personal', 'Local'),
('Work', 'Local');

-- Seed Extensions
INSERT INTO extensions (name, data_url) VALUES 
('Weather', 'https://example.com/weather');

-- Seed Schedules
-- Personal: Morning Wakeup at 7:00 AM (420 mins), daily
INSERT INTO schedules (profile_id, sound_id, name, time, start_date, repeat, is_active)
SELECT p.id, s.id, 'Morning Wakeup', 420, date('now'), 'daily', 1
FROM profiles p, sounds s
WHERE p.name = 'Personal' AND s.name = 'Glass';

-- Work: Team Standup at 10:00 AM (600 mins), weekly on Mon, Tue, Wed, Thu, Fri
INSERT INTO schedules (profile_id, sound_id, name, time, start_date, repeat, is_active)
SELECT p.id, s.id, 'Team Standup', 600, date('now'), 'weekly', 1
FROM profiles p, sounds s
WHERE p.name = 'Work' AND s.name = 'Ping';

-- Work: Weekly Report at 4:00 PM (960 mins), weekly on Friday
INSERT INTO schedules (profile_id, sound_id, name, time, start_date, repeat, is_active)
SELECT p.id, s.id, 'Weekly Report', 960, date('now'), 'weekly', 1
FROM profiles p, sounds s
WHERE p.name = 'Work' AND s.name = 'Submarine';

-- Seed Schedule Days
-- Team Standup (Mon-Fri: 1-5)
INSERT INTO schedule_days (schedule_id, day_of_week)
SELECT s.id, 1 FROM schedules s JOIN profiles p ON s.profile_id = p.id WHERE s.name = 'Team Standup' AND p.name = 'Work' UNION ALL
SELECT s.id, 2 FROM schedules s JOIN profiles p ON s.profile_id = p.id WHERE s.name = 'Team Standup' AND p.name = 'Work' UNION ALL
SELECT s.id, 3 FROM schedules s JOIN profiles p ON s.profile_id = p.id WHERE s.name = 'Team Standup' AND p.name = 'Work' UNION ALL
SELECT s.id, 4 FROM schedules s JOIN profiles p ON s.profile_id = p.id WHERE s.name = 'Team Standup' AND p.name = 'Work' UNION ALL
SELECT s.id, 5 FROM schedules s JOIN profiles p ON s.profile_id = p.id WHERE s.name = 'Team Standup' AND p.name = 'Work';

-- Weekly Report (Fri: 5)
INSERT INTO schedule_days (schedule_id, day_of_week)
SELECT s.id, 5 FROM schedules s JOIN profiles p ON s.profile_id = p.id WHERE s.name = 'Weekly Report' AND p.name = 'Work';
