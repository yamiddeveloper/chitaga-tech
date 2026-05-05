import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = new Database(join(__dirname, '..', 'chitaga.db'));
db.pragma('journal_mode = WAL');

// Contacts table
db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT,
        ip TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    )
`);

// Migrate: add ip column if missing
try { db.exec(`ALTER TABLE contacts ADD COLUMN ip TEXT`); } catch {};

// Event registrations table
db.exec(`
    CREATE TABLE IF NOT EXISTS event_registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_slug TEXT NOT NULL,
        email TEXT NOT NULL,
        data TEXT NOT NULL,
        ip TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        UNIQUE(event_slug, email)
    )
`);

// Migrate: add ip column if missing
try { db.exec(`ALTER TABLE event_registrations ADD COLUMN ip TEXT`); } catch {};

// Migrate: add is_member column if missing
try { db.exec(`ALTER TABLE event_registrations ADD COLUMN is_member INTEGER NOT NULL DEFAULT 0`); } catch {};

// Migrate: add member_locked column if missing
try { db.exec(`ALTER TABLE event_registrations ADD COLUMN member_locked INTEGER NOT NULL DEFAULT 0`); } catch {};

// Event snapshots — stores community state at time of each event
db.exec(`
    CREATE TABLE IF NOT EXISTS event_snapshots (
        event_slug TEXT PRIMARY KEY,
        community_size INTEGER NOT NULL DEFAULT 0,
        extra_internal_attendees INTEGER NOT NULL DEFAULT 0,
        extra_external_attendees INTEGER NOT NULL DEFAULT 0,
        real_finished_total INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT DEFAULT (datetime('now'))
    )
`);

// Migrate: add extra attendees columns if missing
try { db.exec(`ALTER TABLE event_snapshots ADD COLUMN extra_internal_attendees INTEGER NOT NULL DEFAULT 0`); } catch {};
try { db.exec(`ALTER TABLE event_snapshots ADD COLUMN extra_external_attendees INTEGER NOT NULL DEFAULT 0`); } catch {};
try { db.exec(`ALTER TABLE event_snapshots ADD COLUMN real_finished_total INTEGER NOT NULL DEFAULT 0`); } catch {};

// Community members contacts table
db.exec(`
    CREATE TABLE IF NOT EXISTS community_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL DEFAULT '',
        last_name TEXT NOT NULL DEFAULT '',
        whatsapp TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT (datetime('now'))
    )
`);

// Contacts
export const insertContact = db.prepare(
    'INSERT INTO contacts (name, email, message, ip) VALUES (?, ?, ?, ?)'
);

export const findContactByIp = db.prepare(
    'SELECT id FROM contacts WHERE ip = ?'
);

export const findByEmail = db.prepare(
    'SELECT id FROM contacts WHERE email = ?'
);

export const findByName = db.prepare(
    'SELECT id FROM contacts WHERE LOWER(name) = LOWER(?)'
);

export const getAllContacts = db.prepare(
    'SELECT * FROM contacts ORDER BY created_at DESC'
);

// Event registrations
export const insertRegistration = db.prepare(
    'INSERT INTO event_registrations (event_slug, email, data, ip) VALUES (?, ?, ?, ?)'
);

export const findRegistrationByIp = db.prepare(
    'SELECT id FROM event_registrations WHERE event_slug = ? AND ip = ?'
);

export const findRegistrationByEmail = db.prepare(
    'SELECT id FROM event_registrations WHERE event_slug = ? AND email = ?'
);

export const countRegistrations = db.prepare(
    'SELECT COUNT(*) as count FROM event_registrations WHERE event_slug = ?'
);

export const getRegistrationsByEvent = db.prepare(
    'SELECT * FROM event_registrations WHERE event_slug = ? ORDER BY created_at DESC'
);

// Attendance table
db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_slug TEXT NOT NULL,
        registration_id INTEGER NOT NULL,
        attended INTEGER NOT NULL DEFAULT 0,
        finished INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT DEFAULT (datetime('now')),
        UNIQUE(event_slug, registration_id)
    )
`);

// Migrate: add activated column if missing
try { db.exec(`ALTER TABLE attendance ADD COLUMN activated INTEGER NOT NULL DEFAULT 0`); } catch {};

export const upsertAttendance = db.prepare(`
    INSERT INTO attendance (event_slug, registration_id, attended, finished, activated, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(event_slug, registration_id)
    DO UPDATE SET attended = excluded.attended, finished = excluded.finished, activated = excluded.activated, updated_at = datetime('now')
`);

export const getAttendanceByEvent = db.prepare(
    'SELECT registration_id, attended, finished, activated FROM attendance WHERE event_slug = ?'
);

export const setActivated = db.prepare(
    'UPDATE attendance SET activated = ?, updated_at = datetime(\'now\') WHERE event_slug = ? AND registration_id = ?'
);

// Member toggle
export const setMemberStatus = db.prepare(
    'UPDATE event_registrations SET is_member = ?, member_locked = 1 WHERE id = ? AND event_slug = ?'
);

export const setMemberAutoStatusUnlocked = db.prepare(
    'UPDATE event_registrations SET is_member = ?, member_locked = 0 WHERE id = ? AND event_slug = ? AND member_locked = 0'
);

// Event snapshots
export const upsertSnapshot = db.prepare(`
    INSERT INTO event_snapshots (
        event_slug,
        community_size,
        extra_internal_attendees,
        extra_external_attendees,
        real_finished_total,
        updated_at
    )
    VALUES (?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(event_slug)
    DO UPDATE SET
        community_size = excluded.community_size,
        extra_internal_attendees = excluded.extra_internal_attendees,
        extra_external_attendees = excluded.extra_external_attendees,
        real_finished_total = excluded.real_finished_total,
        updated_at = datetime('now')
`);

export const getSnapshot = db.prepare(
    'SELECT community_size, extra_internal_attendees, extra_external_attendees, real_finished_total FROM event_snapshots WHERE event_slug = ?'
);

// Community members contacts
export const insertCommunityMember = db.prepare(
    'INSERT INTO community_members (first_name, last_name, whatsapp) VALUES (?, ?, ?)'
);

export const getAllCommunityMembers = db.prepare(
    'SELECT * FROM community_members ORDER BY created_at DESC'
);

export const getCommunityWhatsapps = db.prepare(
    'SELECT whatsapp FROM community_members'
);

export const findCommunityMemberByWhatsapp = db.prepare(
    'SELECT id FROM community_members WHERE whatsapp = ?'
);

// Suggestions table
db.exec(`
    CREATE TABLE IF NOT EXISTS suggestions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic TEXT NOT NULL,
        name TEXT,
        message TEXT NOT NULL,
        ip TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    )
`);

// Migrate: add ip column if missing
try { db.exec(`ALTER TABLE suggestions ADD COLUMN ip TEXT`); } catch {};

export const insertSuggestion = db.prepare(
    'INSERT INTO suggestions (topic, name, message, ip) VALUES (?, ?, ?, ?)'
);

export const findSuggestionByIp = db.prepare(
    'SELECT id FROM suggestions WHERE topic = ? AND ip = ?'
);

export const getSuggestionsByTopic = db.prepare(
    'SELECT * FROM suggestions WHERE topic = ? ORDER BY created_at DESC'
);

export const getAllSuggestions = db.prepare(
    'SELECT * FROM suggestions ORDER BY created_at DESC'
);

export default db;
