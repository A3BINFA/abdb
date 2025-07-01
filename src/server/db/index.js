const dbFile = "./w3s-dynamic-storage/database.db";
const fs = require('fs');
const sqlite = require('better-sqlite3');
const path = require('path');

// Initialize the database
const dbFileExists = fs.existsSync(dbFile);
const db = new sqlite(path.resolve(dbFile), { fileMustExist: false });

const dbSetup = () => {
  const stmt = db.prepare(`
    CREATE TABLE Messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      phone TEXT,
      status TEXT DEFAULT 'new',
      createdAt INTEGER NOT NULL
    )
  `);
  stmt.run();
};

if (!dbFileExists) {
  dbSetup();
}

const saveMessage = (entry) => {
  let status = false;

  try {
    const { name, email, subject, message, phone } = entry;

    if (!name || !email || !subject || !message) {
      console.error('Missing required fields');
      return false;
    }

    const stmt = db.prepare(`
      INSERT INTO Messages (name, email, subject, message, phone, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      name,
      email,
      subject,
      message,
      phone || '',
      'new',         // initial status for every message
      Date.now()
    );

    status = true;
  } catch (e) {
    console.error(e);
  }
  return status;
};

const fetchMessages = (limit = 20) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM Messages ORDER BY createdAt DESC LIMIT ?
    `);
    return stmt.all(limit);
  } catch (dbError) {
    console.error(dbError);
    return [];
  }
};

module.exports = {
  saveMessage,
  fetchMessages,
};