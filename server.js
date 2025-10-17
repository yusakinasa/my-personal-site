// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // 解析 JSON body
app.use(express.urlencoded({ extended: true }));

// 静态前端
app.use(express.static(path.join(__dirname, 'public')));

// API: 获取所有项
app.get('/api/items', (req, res) => {
  db.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: 创建项
app.post('/api/items', (req, res) => {
  const { title, content } = req.body;
  if (!title || title.trim() === '') return res.status(400).json({ error: 'title required' });
  db.create(title.trim(), content || '', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(row);
  });
});

// API: 删除项
app.delete('/api/items/:id', (req, res) => {
  const id = req.params.id;
  db.deleteById(id, (err, info) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(info);
  });
});

// Fallback 路由 (如果你想做 SPA 的客户端路由)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
