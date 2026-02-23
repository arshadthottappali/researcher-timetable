const fs = require("fs");
const path = require("path");

const FALLBACK = {
  active_name: "Free time",
  active_icon: "⏸",
  active_focus: "",
  time_left: "—",
  time_left_min: 0,
  next_name: "No more blocks",
  next_icon: "✅",
  next_time: "",
  progress_pct: 0,
  progress_str: "0/0",
  done_count: 0,
  total_count: 0,
  updated: ""
};

module.exports = (req, res) => {
  try {
    const statePath = path.join(process.cwd(), "widget-state.json");
    const raw = fs.readFileSync(statePath, "utf8");
    const parsed = JSON.parse(raw);
    const payload = { ...FALLBACK, ...parsed, updated: new Date().toISOString() };
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(payload);
  } catch {
    return res.status(200).json({ ...FALLBACK, updated: new Date().toISOString() });
  }
};
