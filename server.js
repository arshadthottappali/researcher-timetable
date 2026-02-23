const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const STATE_FILE = path.join(ROOT, 'widget-state.json');

const FALLBACK_STATE = {
  active_name: 'Free time',
  active_icon: '⏸',
  active_focus: '',
  time_left: '—',
  time_left_min: 0,
  next_name: 'No more blocks',
  next_icon: '✅',
  next_time: '',
  progress_pct: 0,
  progress_str: '0/0',
  done_count: 0,
  total_count: 0,
  updated: new Date().toISOString()
};

function readWidgetState() {
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...FALLBACK_STATE };
    return { ...FALLBACK_STATE, ...parsed, updated: new Date().toISOString() };
  } catch {
    return { ...FALLBACK_STATE, updated: new Date().toISOString() };
  }
}

app.get('/widget-data.json', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(readWidgetState());
});

app.use(express.static(ROOT, { extensions: ['html'] }));

app.get('/', (_req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Researcher timetable server running on http://localhost:${PORT}`);
});
