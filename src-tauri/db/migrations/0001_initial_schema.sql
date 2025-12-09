CREATE TABLE sounds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  file_name TEXT NOT NULL
);

CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  timezone TEXT NOT NULL,
  CONSTRAINT uq_profile_name UNIQUE (name)
);

CREATE TABLE extensions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  data_url TEXT NOT NULL,
  CONSTRAINT uq_extension_name UNIQUE (name)
);

CREATE TABLE profile_extensions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  extension_id INTEGER NOT NULL,
  settings TEXT, -- JSON string
  is_enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
  FOREIGN KEY (extension_id) REFERENCES extensions (id) ON DELETE CASCADE,
  CONSTRAINT uq_profile_extension UNIQUE (profile_id, extension_id),
  CONSTRAINT chk_pe_is_enabled CHECK (is_enabled IN (0, 1)),
  CONSTRAINT chk_pe_settings_json CHECK (
    settings IS NULL
    OR json_valid(settings)
  )
);

CREATE TABLE schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  sound_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  time INTEGER NOT NULL, -- Minutes from midnight (0-1439)
  start_date TEXT NOT NULL, -- YYYY-MM-DD
  end_date TEXT, -- YYYY-MM-DD | null
  repeat TEXT DEFAULT "once" NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
  FOREIGN KEY (sound_id) REFERENCES sounds (id) ON DELETE SET NULL,
  CONSTRAINT uq_profile_schedule_name UNIQUE (profile_id, name),
  CONSTRAINT chk_schedule_active CHECK (is_active IN (0, 1)),
  CONSTRAINT chk_schedule_repeat CHECK (repeat IN ('once', 'daily', 'weekly')),
  CONSTRAINT chk_schedule_time_range CHECK (time BETWEEN 0 AND 1439)
);

CREATE TABLE schedule_days (
  schedule_id INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL,
  PRIMARY KEY (schedule_id, day_of_week),
  FOREIGN KEY (schedule_id) REFERENCES schedules (id) ON DELETE CASCADE,
  CONSTRAINT chk_day_range CHECK (day_of_week BETWEEN 1 AND 7) -- 1=Monday, 7=Sunday (ISO 8601 standard)
);

CREATE TABLE schedule_overrides (
  schedule_id INTEGER NOT NULL,
  original_date TEXT NOT NULL, -- YYYY-MM-DD
  new_sound_id INTEGER,
  new_date TEXT, -- YYYY-MM-DD
  new_time INTEGER,
  is_cancelled INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TEXT,
  PRIMARY KEY (schedule_id, original_date),
  FOREIGN KEY (schedule_id) REFERENCES schedules (id) ON DELETE CASCADE,
  FOREIGN KEY (new_sound_id) REFERENCES sounds (id) ON DELETE SET NULL,
  CONSTRAINT chk_override_cancelled CHECK (is_cancelled IN (0, 1)),
  CONSTRAINT chk_override_new_time CHECK (
    new_time IS NULL
    OR (new_time BETWEEN 0 AND 1439)
  )
);

CREATE INDEX idx_profile_extensions_profile_id ON profile_extensions (profile_id);

CREATE INDEX idx_profile_extensions_extension_id ON profile_extensions (extension_id);

CREATE INDEX idx_schedules_profile_id ON schedules (profile_id);

CREATE INDEX idx_schedules_sound_id ON schedules (sound_id);

-- Helps queries like: "Select all schedules happening at 8:00 AM"
CREATE INDEX idx_schedules_time ON schedules (time);

-- Helps queries like: "Select all overrides for this specific date"
-- Note: (schedule_id, original_date) is already indexed by the PK,
-- but this helps if we query overrides by date ignoring the schedule_id.
CREATE INDEX idx_schedule_overrides_date ON schedule_overrides (original_date);

CREATE TRIGGER trg_profile_extensions_updated_at AFTER
UPDATE ON profile_extensions BEGIN
UPDATE profile_extensions
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

CREATE TRIGGER trg_schedule_overrides_updated_at AFTER
UPDATE ON schedule_overrides BEGIN
UPDATE schedule_overrides
SET
  updated_at = CURRENT_TIMESTAMP
WHERE
  schedule_id = OLD.schedule_id
  AND original_date = OLD.original_date;

END;
