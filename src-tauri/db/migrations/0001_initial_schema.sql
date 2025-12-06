CREATE TABLE sounds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  duration INTEGER -- optional: duration in seconds
);

CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  CONSTRAINT uq_profile_name UNIQUE (name)
);

CREATE TABLE extensions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  data_url TEXT NOT NULL,
  CONSTRAINT uq_extension_name UNIQUE (name)
);

CREATE TABLE profilesExtensions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  extension_id INTEGER NOT NULL,
  settings TEXT, -- JSON string
  is_enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
  FOREIGN KEY (extension_id) REFERENCES extensions (id) ON DELETE CASCADE,
  CONSTRAINT uq_profile_extension UNIQUE (profile_id, extension_id), -- Prevent adding same extension to a profile twice
  CONSTRAINT chk_is_enabled CHECK (is_enabled IN (0, 1)) -- Simulate Boolean
);

CREATE TABLE schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  sound_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  time INTEGER NOT NULL, -- Minutes from midnight (0-1439)
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
  FOREIGN KEY (sound_id) REFERENCES sounds (id) ON DELETE SET NULL, -- Keep schedule even if sound is deleted
  CONSTRAINT uq_profile_schedule_name UNIQUE (profile_id, name), -- Unique schedule names per profile
  CONSTRAINT chk_schedule_active CHECK (is_active IN (0, 1))
);

CREATE TABLE scheduleDays (
  schedule_id INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL, -- 1-7 (Mon-Sun)
  PRIMARY KEY (schedule_id, day_of_week),
  FOREIGN KEY (schedule_id) REFERENCES schedules (id) ON DELETE CASCADE,
  CONSTRAINT chk_day_range CHECK (day_of_week BETWEEN 1 AND 7) -- Enforce valid days
);

CREATE TABLE scheduleOverrides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  schedule_id INTEGER NOT NULL,
  original_date TEXT NOT NULL, -- The date being overridden (YYYY-MM-DD)
  new_sound_id INTEGER, -- Nullable: if NULL, maybe keep original sound?
  new_date TEXT, -- Nullable: if NULL, date hasn't moved
  new_time INTEGER, -- Nullable: if NULL, time hasn't changed
  is_cancelled INTEGER DEFAULT 0, -- Useful to simply cancel a specific occurrence
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (schedule_id) REFERENCES schedules (id) ON DELETE CASCADE,
  FOREIGN KEY (new_sound_id) REFERENCES sounds (id) ON DELETE SET NULL,
  CONSTRAINT uq_schedule_override_date UNIQUE (schedule_id, original_date), -- Only one override per specific schedule instance
  CONSTRAINT chk_override_cancelled CHECK (is_cancelled IN (0, 1))
);

-- Assuming recursive_triggers is OFF
CREATE TRIGGER trg_profilesExtensions_updated_at AFTER
UPDATE ON profilesExtensions BEGIN
UPDATE profilesExtensions
SET
  updated_at = CURRENT_TIMESTAMP
WHERE
  id = OLD.id;

END;

CREATE TRIGGER trg_schedules_updated_at AFTER
UPDATE ON schedules BEGIN
UPDATE schedules
SET
  updated_at = CURRENT_TIMESTAMP
WHERE
  id = OLD.id;

END;

CREATE TRIGGER trg_scheduleOverrides_updated_at AFTER
UPDATE ON scheduleOverrides BEGIN
UPDATE scheduleOverrides
SET
  updated_at = CURRENT_TIMESTAMP
WHERE
  id = OLD.id;

END;
