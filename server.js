const express = require('express');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const STATE_FILE = path.join(ROOT, 'widget-state.json');
const ENV_FILE = path.join(ROOT, '.env');

const FALLBACK_STATE = {
  active_name: 'Free time',
  active_icon: '-',
  active_focus: '',
  time_left: '-',
  time_left_min: 0,
  next_name: 'No more blocks',
  next_icon: 'N',
  next_time: '',
  progress_pct: 0,
  progress_str: '0/0',
  done_count: 0,
  total_count: 0,
  updated: new Date().toISOString()
};

function loadLocalEnv() {
  try {
    if (!fs.existsSync(ENV_FILE)) return;
    const raw = fs.readFileSync(ENV_FILE, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) return;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    });
  } catch {
    // Ignore local env parsing issues and fall back to process env.
  }
}

loadLocalEnv();

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

function readSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || ''
  };
}

function createServer() {
  const app = express();

  app.get('/widget-data.json', (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(readWidgetState());
  });

  app.get('/api/widget-data', (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(readWidgetState());
  });

  app.get('/api/supabase-config', (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(readSupabaseConfig());
  });

  app.use(express.static(ROOT, { extensions: ['html'] }));

  app.get('/', (_req, res) => {
    res.sendFile(path.join(ROOT, 'index.html'));
  });

  return app;
}

function startServer(port = DEFAULT_PORT) {
  const app = createServer();
  const server = app.listen(port, () => {
    console.log(`Researcher timetable server running on http://localhost:${port}`);
  });
  return server;
}

module.exports = {
  createServer,
  readSupabaseConfig,
  readWidgetState,
  startServer
};

if (require.main === module) {
  startServer();
}
