// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(DB_PATH);

// 初始化表
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = {
  getAll: (cb) => {
    db.all('SELECT * FROM items ORDER BY created_at DESC', cb);
  },
  create: (title, content, cb) => {
    db.run('INSERT INTO items (title, content) VALUES (?, ?)', [title, content], function (err) {
      if (err) return cb(err);
      db.get('SELECT * FROM items WHERE id = ?', [this.lastID], cb);
    });
  },
  deleteById: (id, cb) => {
    db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
      if (err) return cb(err);
      cb(null, { deleted: this.changes });
    });
  }
};
