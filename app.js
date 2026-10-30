
import * as DATA from './plan-data.js';
import { lineChart, barChart, multiBarChart, themed } from './charts.js';


export const DAY_MS = 86400000;

export function iso(d) {
  if (typeof d === 'string') return d.slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

export function dt(s) {
  const parts = s.slice(0, 10).split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function addDays(s, n) {
  const d = dt(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}

export function daysBetween(a, b) {
  return Math.round((dt(b) - dt(a)) / DAY_MS);
}

export function weekday(s) {
  return (dt(s).getDay() + 6) % 7;
}

export function weekStartOf(s) {
  return addDays(s, -weekday(s));
}

export function today() {
  return iso(new Date());
}

const MONTHS_DE = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli',
  'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'];
export const WEEKDAYS_SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
export const WEEKDAYS_DE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag',
  'Freitag', 'Samstag', 'Sonntag'];

export function fmtDate(s) {
  const d = dt(s);
  return d.getDate() + '. ' + MONTHS_DE[d.getMonth()] + ' ' + d.getFullYear();
}

export function fmtDateShort(s) {
  const d = dt(s);
  return d.getDate() + '. ' + MONTHS_DE[d.getMonth()];
}


export const TrainingType = {
  INTERVAL: 'Intervall',
  LONG_RUN: 'Langer Lauf',
  TEMPO: 'Tempolauf',
  EASY: 'Lockerer Lauf',
  RECOVERY: 'Recovery',
  STRENGTH: 'Krafttraining',
  REST: 'Pause',
  RACE: 'Wettkampf',
  OTHER: 'Andere Aktivität',
};

export const TrainingStatus = {
  PENDING: 'ausstehend',
  DONE: 'erledigt',
  MISSED: 'keine Zeit',
};

export const Zone = { Z1: 'Z1', Z2: 'Z2', Z3: 'Z3', Z4: 'Z4', Z5: 'Z5', NONE: 'Keine Vorgabe' };

export const RUN_TYPES = new Set([
  TrainingType.INTERVAL, TrainingType.LONG_RUN, TrainingType.TEMPO,
  TrainingType.EASY, TrainingType.RECOVERY, TrainingType.RACE,
]);

export const METRIC_TYPES = new Set([...RUN_TYPES, TrainingType.OTHER]);

export function countsForWeek(type) {
  return type !== TrainingType.RACE && type !== TrainingType.OTHER;
}

let idCounter = 0;
function newId() {
  idCounter += 1;
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 8) +
    idCounter.toString(36)).slice(0, 12);
}

export function makeSession(fields) {
  return Object.assign({
    id: newId(),
    week_start: null,
    training_type: TrainingType.EASY,
    date: null,
    hr_zone: Zone.NONE,
    target_distance_km: null,
    target_duration_min: null,
    status: TrainingStatus.PENDING,
    archived: false,
    custom_added: false,
    garmin_activity_id: null,
    notes: '',
    description: '',
    custom_workout: null,
    phase: '',
    updated_at: null,
    actual_distance_km: null,
    actual_duration_s: null,
    actual_avg_hr: null,
    actual_max_hr: null,
    aerobic_benefit: null,
    anaerobic_benefit: null,
    perceived_effort: null,
    felt: null,
    elevation_gain_m: null,
    grade_adjusted_pace_s_per_km: null,
    avg_cadence_spm: null,
    avg_stride_length_cm: null,
    avg_ground_contact_ms: null,
    avg_vertical_ratio: null,
    avg_power_w: null,
    garmin_load: null,
    zone_minutes: {},
    splits: [],
    split_blocks: [],
    exercise_sets: [],
  }, fields || {});
}

export function actualPace(s) {
  if (!s.actual_distance_km || !s.actual_duration_s) return null;
  return s.actual_duration_s / s.actual_distance_km;
}

export function effectivePace(s) {
  return s.grade_adjusted_pace_s_per_km || actualPace(s);
}

export function sessionLoad(s) {
  if (s.aerobic_benefit == null && s.anaerobic_benefit == null) return 0;
  return (s.aerobic_benefit || 0) + 1.5 * (s.anaerobic_benefit || 0);
}

export function defaultZones() {
  return DATA.DEFAULT_ZONES.map((z) => Object.assign({}, z));
}

export function defaultSettings() {
  return {
    target_time_min: 225,           // 3:45 laut Plan
    vo2max_history: [],
    zones: defaultZones(),
    zones_updated: '',
    lactate_history: [],
    recent_race: null,
    week_rhythm: {},
    rhythm_auto: true,
    garmin: { shoes: [] },
    phone_tiles: null,
    sync_token: '',
    sync_gist_id: '',
    sync_auto: true,
    sync_last: '',
  };
}

export function targetPaceSPerKm(settings) {
  return Math.round((settings.target_time_min * 60) / DATA.MARATHON_DISTANCE_KM);
}

export function vo2maxOf(settings) {
  const h = settings.vo2max_history || [];
  return h.length ? h[h.length - 1].value : null;
}

export function lactateHr(settings) {
  const h = settings.lactate_history || [];
  for (let i = h.length - 1; i >= 0; i -= 1) if (h[i].hr) return h[i].hr;
  return null;
}

export function lactatePace(settings) {
  const h = settings.lactate_history || [];
  for (let i = h.length - 1; i >= 0; i -= 1) if (h[i].pace_s_per_km) return h[i].pace_s_per_km;
  return null;
}

export function touchZones(settings) {
  settings.zones_updated = nowStamp();
  return settings;
}

export function setLactateThreshold(settings, hr, pace, measured, adjustZones) {
  const day = measured || today();
  const hist = settings.lactate_history || [];
  const currentHr = lactateHr(settings);
  const currentPace = lactatePace(settings);
  const norm = (v) => (v === undefined || v === '' ? null : v);
  if (norm(hr) === norm(currentHr) && norm(pace) === norm(currentPace)) return;
  settings.lactate_history = hist.filter((e) => e.date !== day).concat([
    { date: day, hr: hr || null, pace_s_per_km: pace || null },
  ]).sort((a, b) => (a.date < b.date ? -1 : 1));
  const newest = settings.lactate_history[settings.lactate_history.length - 1];
  if (adjustZones !== false && hr && newest && newest.date === day) {
    const z4 = settings.zones.find((z) => z.zone === Zone.Z4);
    if (z4 && z4.max_bpm) {
      const factor = hr / z4.max_bpm;
      settings.zones = settings.zones.map((z) => Object.assign({}, z, {
        min_bpm: Math.round(z.min_bpm * factor),
        max_bpm: Math.round(z.max_bpm * factor),
      }));
      touchZones(settings);
    }
  }
}

export function zoneSetting(settings, zone) {
  return (settings.zones || []).find((z) => z.zone === zone) || null;
}


const FLEX_PHASE = 'PHASE 3: WINTERGRUNDLAGE';
export const MISSED_POOL_WEEKS = 2;

function weeksBetween(start, target) {
  return Math.floor(daysBetween(weekStartOf(start), weekStartOf(target)) / 7) + 1;
}

function evenSelection(items, count) {
  if (count >= items.length) return items.slice();
  if (count <= 1) return items.slice(0, 1);
  const last = items.length - 1;
  const set = new Set();
  for (let i = 0; i < count; i += 1) set.add(Math.round((i * last) / (count - 1)));
  let idx = [...set].sort((a, b) => a - b);
  for (let c = 0; c < items.length && idx.length < count; c += 1) {
    if (idx.indexOf(c) === -1) idx = idx.concat([c]).sort((a, b) => a - b);
  }
  return idx.slice(0, count).map((i) => items[i]);
}

export function selectWeekPlans(numWeeks) {
  const weeks = DATA.WEEKS;
  const flex = weeks.filter((w) => w.phase === FLEX_PHASE);
  const before = weeks.filter((w) => w.num < flex[0].num);
  const after = weeks.filter((w) => w.num > flex[flex.length - 1].num);
  const flexTarget = numWeeks - before.length - after.length;
  if (flexTarget >= 1) {
    let selected;
    if (flexTarget <= flex.length) {
      selected = evenSelection(flex, flexTarget);
    } else {
      selected = [];
      for (let i = 0; i < flexTarget; i += 1) {
        selected.push(flex[Math.round((i * (flex.length - 1)) / (flexTarget - 1))]);
      }
    }
    return before.concat(selected, after);
  }
  const remaining = Math.max(numWeeks - after.length, 0);
  return before.slice(before.length - remaining).concat(after);
}

function runSession(monday, entry, phase) {
  return makeSession({
    week_start: monday,
    training_type: entry.type,
    hr_zone: entry.zone,
    target_distance_km: entry.km,
    target_duration_min: entry.min,
    phase: phase,
    description: entry.pace ? entry.text + '\n' + entry.pace : entry.text,
  });
}

const STRENGTH_ROUTINES = {
  A: [DATA.KRAFT_A_TEXT, DATA.KRAFT_A_DURATION_MIN],
  B: [DATA.KRAFT_B_TEXT, DATA.KRAFT_B_DURATION_MIN],
  'B-reduziert': [DATA.KRAFT_B_REDUZIERT_TEXT, DATA.KRAFT_B_DURATION_MIN],
};
const STRENGTH_WITH_ACTIVATION = ['B', 'B-reduziert'];

function strengthSession(monday, phase, routine) {
  let text = STRENGTH_ROUTINES[routine][0];
  let minutes = STRENGTH_ROUTINES[routine][1];
  if (STRENGTH_WITH_ACTIVATION.indexOf(routine) !== -1) {
    text = text + '\n' + DATA.AKTIVIERUNG_TEXT;
    minutes += DATA.AKTIVIERUNG_DURATION_MIN;
  }
  return makeSession({
    week_start: monday,
    training_type: TrainingType.STRENGTH,
    hr_zone: Zone.NONE,
    target_duration_min: minutes,
    phase: phase,
    description: text,
  });
}

function placeRace(sessions, targetDate, phase) {
  let race = sessions.find((s) => s.training_type === TrainingType.RACE);
  if (!race) {
    race = makeSession({
      week_start: weekStartOf(targetDate),
      training_type: TrainingType.RACE,
      phase: phase,
      description: 'Zürich Marathon – Renntag.',
    });
    sessions.push(race);
  }
  race.date = targetDate;
  race.week_start = weekStartOf(targetDate);
  race.target_distance_km = DATA.MARATHON_DISTANCE_KM;
  race.target_duration_min = null;
  return race;
}

export function generatePlan(startDate, targetDate) {
  const target = targetDate || DATA.MARATHON_DATE;
  if (daysBetween(startDate, target) < 1) {
    throw new Error('Der Renntag muss nach dem Start liegen.');
  }
  const weekPlans = selectWeekPlans(weeksBetween(startDate, target));
  const sessions = [];
  const firstMonday = weekStartOf(startDate);
  weekPlans.forEach((week, i) => {
    const monday = addDays(firstMonday, i * 7);
    week.sessions.forEach((entry) => {
      if (entry.type === TrainingType.REST) return;   // ein leerer Tag *ist* der Ruhetag
      sessions.push(runSession(monday, entry, week.phase));
    });
    (week.strength || []).forEach((r) => sessions.push(strengthSession(monday, week.phase, r)));
  });
  placeRace(sessions, target, weekPlans.length ? weekPlans[weekPlans.length - 1].phase : '');
  return {
    version: DATA.PLAN_VERSION,
    start_date: startDate,
    target_date: target,
    sessions: sessions,
    diary: {},
    deleted: {},
  };
}


export function nowStamp() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function touch(session) {
  if (session) session.updated_at = nowStamp();
  return session;
}

export function sessionById(plan, id) {
  return plan.sessions.find((s) => s.id === id) || null;
}

export function groupByWeek(plan) {
  const map = new Map();
  plan.sessions.forEach((s) => {
    if (!map.has(s.week_start)) map.set(s.week_start, []);
    map.get(s.week_start).push(s);
  });
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
}

export function weekSessions(plan, monday) {
  return plan.sessions.filter((s) => s.week_start === monday && !s.archived);
}

export function weekPool(plan, monday) {
  return plan.sessions.filter((s) => s.week_start === monday && !s.date && !s.archived
    && s.status === TrainingStatus.PENDING);
}

export function missedPool(plan) {
  return plan.sessions.filter((s) => s.status === TrainingStatus.MISSED && !s.archived)
    .sort((a, b) => (a.week_start < b.week_start ? -1 : 1));
}

export function sessionsOn(plan, day) {
  return plan.sessions.filter((s) => s.date === day && !s.archived).sort(sortKey);
}

export function sortKey(a, b) {
  const order = [TrainingType.RACE, TrainingType.INTERVAL, TrainingType.TEMPO,
    TrainingType.LONG_RUN, TrainingType.EASY, TrainingType.RECOVERY,
    TrainingType.STRENGTH, TrainingType.OTHER];
  return order.indexOf(a.training_type) - order.indexOf(b.training_type);
}

export function countedWeekSessions(sessions) {
  return sessions.filter((s) => !s.archived
    && s.status !== TrainingStatus.MISSED
    && countsForWeek(s.training_type));
}

export function weekSessionCount(sessions) {
  const counted = countedWeekSessions(sessions);
  return [counted.filter((s) => s.status === TrainingStatus.DONE).length, counted.length];
}

export function weekProgress(plan, monday) {
  return weekSessionCount(weekSessions(plan, monday));
}

export function daysOfWeek(monday) {
  return [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(monday, i));
}

export function assignSession(plan, id, newDate) {
  const s = sessionById(plan, id);
  if (!s) return null;
  if (s.training_type === TrainingType.RACE) throw new Error('Der Wettkampf liegt fest.');
  if (newDate === plan.target_date) throw new Error('Der Renntag ist dem Wettkampf vorbehalten.');
  if (newDate < plan.start_date || newDate > plan.target_date) {
    throw new Error('Der Tag liegt ausserhalb des Plans.');
  }
  s.date = newDate;
  if (s.status === TrainingStatus.MISSED) s.status = TrainingStatus.PENDING;
  return touch(s);
}

export function unassignSession(plan, id) {
  const s = sessionById(plan, id);
  if (!s || s.training_type === TrainingType.RACE) return null;
  s.date = null;
  return touch(s);
}

export function skipSession(plan, id) {
  const s = sessionById(plan, id);
  if (!s) return null;
  s.status = TrainingStatus.MISSED;
  s.date = null;
  return touch(s);
}

export function archiveSession(plan, id) {
  const s = sessionById(plan, id);
  if (!s) return null;
  s.archived = true;
  s.date = null;
  return touch(s);
}

export function markDone(plan, id, values) {
  const s = sessionById(plan, id);
  if (!s) return null;
  s.status = TrainingStatus.DONE;
  if (!s.date) s.date = today();
  Object.keys(values || {}).forEach((k) => {
    if (values[k] !== undefined && values[k] !== null && values[k] !== '') s[k] = values[k];
  });
  return touch(s);
}

export function markUndone(plan, id) {
  const s = sessionById(plan, id);
  if (!s) return null;
  s.status = TrainingStatus.PENDING;
  return touch(s);
}

const RETYPE_ZONE = {
  [TrainingType.RECOVERY]: Zone.Z1,
  [TrainingType.EASY]: Zone.Z2,
  [TrainingType.LONG_RUN]: Zone.Z2,
  [TrainingType.TEMPO]: Zone.Z4,
  [TrainingType.INTERVAL]: Zone.Z4,
  [TrainingType.STRENGTH]: Zone.NONE,
  [TrainingType.OTHER]: Zone.NONE,
};

export const RETYPE_TYPES = [TrainingType.EASY, TrainingType.RECOVERY, TrainingType.LONG_RUN,
  TrainingType.TEMPO, TrainingType.INTERVAL, TrainingType.STRENGTH, TrainingType.OTHER];

export function retypeSession(plan, id, type) {
  const s = sessionById(plan, id);
  if (!s) return null;
  if (s.training_type === TrainingType.RACE || type === TrainingType.RACE) {
    throw new Error('Der Wettkampf lässt sich nicht umstellen.');
  }
  if (s.training_type === type) return s;
  s.training_type = type;
  if (RETYPE_ZONE[type] !== undefined) s.hr_zone = RETYPE_ZONE[type];
  s.custom_workout = null;          // gehoerte zur alten Art
  if (type === TrainingType.STRENGTH) {
    s.splits = []; s.split_blocks = []; s.target_distance_km = null;
  } else {
    s.exercise_sets = [];
  }
  return touch(s);
}

export function addCustomSession(plan, type, day) {
  if (day < plan.start_date || day > plan.target_date) {
    throw new Error('Der Tag liegt ausserhalb des Plans.');
  }
  if (day === plan.target_date) throw new Error('Der Renntag ist dem Wettkampf vorbehalten.');
  const monday = weekStartOf(day);
  const sibling = plan.sessions.find((s) => s.week_start === monday && s.phase);
  const s = makeSession({
    week_start: monday,
    date: day,
    training_type: type,
    hr_zone: RETYPE_ZONE[type] !== undefined ? RETYPE_ZONE[type] : Zone.NONE,
    phase: sibling ? sibling.phase : '',
    custom_added: true,
    description: type === TrainingType.STRENGTH ? 'Eigene Krafteinheit.' : 'Eigene Einheit.',
  });
  touch(s);
  plan.sessions.push(s);
  return s;
}

export function deleteSession(plan, id) {
  const s = sessionById(plan, id);
  if (!s) return false;
  if (!s.custom_added) throw new Error('Plan-Einheiten werden nur archiviert, nie gelöscht.');
  plan.sessions = plan.sessions.filter((x) => x.id !== id);
  plan.deleted = plan.deleted || {};
  plan.deleted[id] = nowStamp();
  return true;
}

export function sweepMissed(plan, day) {
  const now = day || today();
  const currentMonday = weekStartOf(now);
  const cutoff = addDays(currentMonday, -7 * MISSED_POOL_WEEKS);
  let changed = 0;
  plan.sessions.forEach((s) => {
    if (s.archived || s.training_type === TrainingType.RACE) return;
    if (s.status === TrainingStatus.PENDING && s.week_start < currentMonday) {
      s.status = TrainingStatus.MISSED;
      s.date = null;
      touch(s);
      changed += 1;
    }
    if (s.status === TrainingStatus.MISSED && s.week_start < cutoff) {
      s.archived = true;
      s.date = null;
      touch(s);
      changed += 1;
    }
  });
  return changed;
}

export function weekIsUnplanned(plan, monday) {
  const week = weekSessions(plan, monday).filter((s) => s.training_type !== TrainingType.RACE);
  return week.length > 0 && week.every((s) => !s.date);
}

export function applyRhythm(plan, monday, rhythm) {
  let placed = 0;
  const pool = weekPool(plan, monday);
  const used = {};
  pool.forEach((s) => {
    const wd = rhythm[s.training_type];
    if (wd === undefined || wd === null) return;
    let day = addDays(monday, ((wd % 7) + 7) % 7);
    while (used[day] && used[day] >= 2) day = addDays(day, 1);
    if (day === plan.target_date) return;
    if (day < plan.start_date || day > plan.target_date) return;
    s.date = day;
    used[day] = (used[day] || 0) + 1;
    placed += 1;
  });
  return placed;
}

const HARD_TYPES = new Set([TrainingType.INTERVAL, TrainingType.TEMPO,
  TrainingType.LONG_RUN, TrainingType.RACE]);

export function hardDays(plan) {
  const byDay = new Map();
  plan.sessions.forEach((s) => {
    if (!s.date || s.archived || !HARD_TYPES.has(s.training_type)) return;
    byDay.set(s.date, (byDay.get(s.date) || 0) + 1);
  });
  const flagged = new Set();
  [...byDay.keys()].forEach((day) => {
    if (byDay.get(day) >= 2) flagged.add(day);
    const next = addDays(day, 1);
    if (byDay.has(next)) { flagged.add(day); flagged.add(next); }
  });
  return flagged;
}


export function fmtDuration(seconds) {
  if (seconds == null) return '–';
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) return h + ':' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  return m + ':' + String(sec).padStart(2, '0');
}

export function fmtMinSec(seconds) {
  const s = Math.round(seconds);
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

export function fmtPace(sPerKm) {
  if (!sPerKm) return '–';
  return fmtMinSec(sPerKm) + ' min/km';
}

export function fmtPaceRange(fast, slow) {
  return fmtMinSec(fast) + '–' + fmtMinSec(slow) + ' min/km';
}

export function fmtKm(km) {
  if (km == null) return '–';
  return (Math.round(km * 10) / 10).toString().replace('.', ',') + ' km';
}


function danielsPercentVo2max(tMin) {
  return 0.8 + 0.1894393 * Math.exp(-0.012778 * tMin) +
    0.2989558 * Math.exp(-0.1932605 * tMin);
}

function velocityAtVo2(vo2) {
  const a = 0.000104; const b = 0.182258; const c = -(4.60 + vo2);
  return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
}

function vo2AtVelocity(v) {
  return -4.60 + 0.182258 * v + 0.000104 * v * v;
}

export function vdotFromPerformance(distanceKm, durationS) {
  if (!distanceKm || !durationS) return null;
  const tMin = durationS / 60;
  const velocity = (distanceKm * 1000) / tMin;
  const percent = danielsPercentVo2max(tMin);
  if (percent <= 0) return null;
  return vo2AtVelocity(velocity) / percent;
}

const RUN_HRR_MIN = 0.55;
const RUN_HRR_MAX = 0.92;
const FITNESS_HALFLIFE_DAYS = 21;
const FITNESS_WINDOW_DAYS = 56;

function hrMax(plan, settings) {
  const observed = plan.sessions.filter((s) => s.actual_max_hr).map((s) => s.actual_max_hr);
  const z5 = zoneSetting(settings, Zone.Z5);
  if (z5) observed.push(z5.max_bpm);
  return observed.length ? Math.max.apply(null, observed) : null;
}

function restingHr(plan) {
  const values = Object.values(plan.diary || {})
    .map((e) => e.resting_hr).filter(Boolean).sort((a, b) => a - b);
  return values.length ? values[Math.floor(values.length / 2)] : null;
}

function effortFraction(effort) {
  if (!effort) return null;
  const e = Math.max(1, Math.min(10, Math.round(effort)));
  return 0.40 + ((e - 1) / 9) * 0.60;
}

function feltWeight(felt) {
  return felt === 1 ? 0.7 : felt === 2 ? 0.85 : 1.0;
}

function gradeFactor(s) {
  const raw = actualPace(s);
  const eff = effectivePace(s);
  return raw && eff ? Math.min(1.0, eff / raw) : 1.0;
}

let MEMO = null;

function memo(name, plan, settings, day, compute) {
  if (!MEMO || MEMO.plan !== plan) return compute();
  if (settings && MEMO.settings !== settings) return compute();
  const key = name + '|' + (day || today());
  if (!MEMO.values.has(key)) MEMO.values.set(key, compute());
  return MEMO.values.get(key);
}

function withMemo(fn) {
  if (MEMO) return fn();
  MEMO = { plan: PLAN, settings: SETTINGS, values: new Map() };
  try { return fn(); } finally { MEMO = null; }
}

function doneRuns(plan, since) {
  return plan.sessions.filter((s) => s.status === TrainingStatus.DONE && s.date
    && RUN_TYPES.has(s.training_type) && !s.archived
    && (!since || s.date >= since) && actualPace(s));
}

export function vdotFromRun(session, hrMaxV, hrRest) {
  const pace = effectivePace(session);
  if (!pace) return null;
  let hrr = null;
  if (session.actual_avg_hr && hrMaxV && hrRest && hrMaxV > hrRest) {
    hrr = (session.actual_avg_hr - hrRest) / (hrMaxV - hrRest);
  }
  const eff = effortFraction(session.perceived_effort);
  let fraction;
  if (hrr != null && eff != null) fraction = 0.7 * hrr + 0.3 * eff;
  else if (hrr != null) fraction = hrr;
  else if (eff != null) fraction = eff;
  else return null;
  if (fraction < RUN_HRR_MIN || fraction > RUN_HRR_MAX) return null;
  const velocity = 60000 / pace;
  const vdot = vo2AtVelocity(velocity) / fraction;
  return vdot >= 30 && vdot <= 85 ? vdot : null;
}

const RECOVERY_SPLIT_KEYWORDS = ['aufw', 'wärm', 'warm', 'einlauf', 'auslauf', 'cool', 'trab',
  'erhol', 'gehen', 'pause', 'rest', 'recover', 'jog'];

function splitIsWork(sp) {
  const kind = (sp.kind || '').toLowerCase();
  return !RECOVERY_SPLIT_KEYWORDS.some((w) => kind.indexOf(w) !== -1);
}

function workPaceFromSplits(session) {
  const splits = (session.splits || []).filter((sp) => sp.distance_km && sp.duration_s);
  if (splits.length < 2) return null;
  const total = splits.reduce((a, sp) => a + sp.distance_km, 0);
  let work = splits.filter(splitIsWork);
  let workDist = work.reduce((a, sp) => a + sp.distance_km, 0);
  if (workDist < 1.5 || workDist >= 0.9 * total) {
    const avg = splits.reduce((a, sp) => a + sp.duration_s, 0) / total;
    work = splits.filter((sp) => sp.duration_s / sp.distance_km <= 0.92 * avg);
    workDist = work.reduce((a, sp) => a + sp.distance_km, 0);
  }
  if (workDist < 1.5) return null;
  return work.reduce((a, sp) => a + sp.duration_s, 0) / workDist;
}

export function vdotFromQualitySession(session) {
  if (!isWorkoutSession(session)) return null;
  const category = paceCategoryFor(session);
  if (!PACE_FRACTIONS[category]) return null;
  let pace = workPaceFromSplits(session);
  if (!pace) return null;
  pace *= gradeFactor(session);
  const f = PACE_FRACTIONS[category];
  const fraction = (f[0] + f[1]) / 2;
  const vdot = vo2AtVelocity(60000 / pace) / fraction;
  return vdot >= 30 && vdot <= 85 ? vdot : null;
}

export function vdotFromRuns(plan, settings, day) {
  const now = day || today();
  const hmax = hrMax(plan, settings);
  const hrest = restingHr(plan);
  let sum = 0; let weightTotal = 0; let count = 0;
  doneRuns(plan, addDays(now, -FITNESS_WINDOW_DAYS)).forEach((s) => {
    const vdot = isWorkoutSession(s) ? vdotFromQualitySession(s) : vdotFromRun(s, hmax, hrest);
    if (vdot == null) return;
    let w = Math.pow(0.5, daysBetween(s.date, now) / FITNESS_HALFLIFE_DAYS);
    w *= feltWeight(s.felt);
    sum += vdot * w; weightTotal += w; count += 1;
  });
  if (!count) return null;
  return { vdot: sum / weightTotal, count: count };
}

export function currentVdot(plan, settings, day) {
  return memo('currentVdot', plan, settings, day, () => currentVdotUncached(plan, settings, day));
}

function currentVdotUncached(plan, settings, day) {
  const now = day || today();
  const estimates = [];
  const runs = vdotFromRuns(plan, settings, now);
  if (runs) {
    estimates.push([runs.vdot, Math.min(0.5, 0.14 + 0.06 * runs.count),
      runs.count + (runs.count === 1 ? ' Lauf' : ' Läufe')]);
  }
  const race = settings.recent_race;
  if (race && race.distance_km && race.duration_s) {
    const v = vdotFromPerformance(race.distance_km, race.duration_s);
    if (v) estimates.push([v, daysBetween(race.date, now) > 120 ? 0.25 : 0.55, 'Rennen']);
  }
  const ltPace = lactatePace(settings);
  if (ltPace) {
    const v = vdotFromPerformance(3600 / ltPace, 3600);
    if (v) estimates.push([v, 0.3, 'Schwelle']);
  }
  const vo2 = vo2maxOf(settings);
  if (vo2) estimates.push([vo2, 0.15, 'VO2max']);
  if (!estimates.length) return null;
  const totalW = estimates.reduce((a, e) => a + e[1], 0);
  const vdot = estimates.reduce((a, e) => a + e[0] * e[1], 0) / totalW;
  const sources = estimates.slice().sort((a, b) => b[1] - a[1]).map((e) => e[2]).join(' · ');
  return { vdot: vdot, source: sources };
}

export function garminVdot(settings) {
  const ltPace = lactatePace(settings);
  if (ltPace) {
    const v = vdotFromPerformance(3600 / ltPace, 3600);
    if (v) return { vdot: v, source: 'Garmin-Schwelle' };
  }
  return null;
}

const PACE_FRACTIONS = {
  E: [0.62, 0.74], M: [0.75, 0.84], T: [0.83, 0.88], I: [0.95, 1.00], R: [1.03, 1.08],
};
const PACE_LABEL = { E: 'Locker', M: 'Marathon', T: 'Schwelle', I: 'Intervall', R: 'Wiederholung' };

const ZONE_TO_PACE = { Z1: 'E', Z2: 'E', Z3: 'M', Z4: 'T', Z5: 'I' };
const TYPE_TO_PACE = {
  [TrainingType.RECOVERY]: 'E', [TrainingType.EASY]: 'E', [TrainingType.LONG_RUN]: 'E',
  [TrainingType.TEMPO]: 'T', [TrainingType.INTERVAL]: 'I',
};

function paceAtFraction(vdot, fraction) {
  return Math.round(60000 / velocityAtVo2(vdot * fraction));
}

export function trainingPaces(vdot) {
  const out = {};
  Object.keys(PACE_FRACTIONS).forEach((k) => {
    const f = PACE_FRACTIONS[k];
    out[k] = [paceAtFraction(vdot, f[1]), paceAtFraction(vdot, f[0])];
  });
  return out;
}

export function paceCategoryFor(session) {
  if (!RUN_TYPES.has(session.training_type)) return null;
  if (session.training_type === TrainingType.RACE) return null;
  return ZONE_TO_PACE[session.hr_zone] || TYPE_TO_PACE[session.training_type] || null;
}

const EASY_PACE_WINDOW_DAYS = 42;
const EASY_TYPES = [TrainingType.EASY, TrainingType.RECOVERY, TrainingType.LONG_RUN];
const EASY_PACE_PERCENTILES = [0.05, 0.95];
const EASY_TYPE_OFFSET_S = {
  [TrainingType.RECOVERY]: 33, [TrainingType.EASY]: 0, [TrainingType.LONG_RUN]: 3,
};

export function easyPaceRange(plan, day) {
  return memo('easyPaceRange', plan, null, day, () => easyPaceRangeUncached(plan, day));
}

function easyPaceRangeUncached(plan, day) {
  const now = day || today();
  const since = addDays(now, -EASY_PACE_WINDOW_DAYS);
  const paces = doneRuns(plan, since)
    .filter((s) => EASY_TYPES.indexOf(s.training_type) !== -1
      && (s.hr_zone === Zone.Z1 || s.hr_zone === Zone.Z2))
    .map(actualPace).filter(Boolean).sort((a, b) => a - b);
  if (paces.length < 3) return null;
  const pct = (p) => paces[Math.min(paces.length - 1, Math.max(0, Math.round(p * (paces.length - 1))))];
  return [pct(EASY_PACE_PERCENTILES[0]), pct(EASY_PACE_PERCENTILES[1])];
}

export function easyPaceFor(session, plan, day) {
  const base = easyPaceRange(plan, day);
  if (!base) return null;
  let offset = EASY_TYPE_OFFSET_S[session.training_type] || 0;
  if (session.hr_zone === Zone.Z1 && EASY_TYPE_OFFSET_S[session.training_type] === undefined) {
    offset = EASY_TYPE_OFFSET_S[TrainingType.RECOVERY];
  }
  return [base[0] + offset, base[1] + offset];
}

const EASY_LABELS = {
  [TrainingType.RECOVERY]: 'Rekom', [TrainingType.LONG_RUN]: 'Longrun',
};
function easyLabel(session) {
  return EASY_LABELS[session.training_type] || PACE_LABEL.E;
}

export function recommendedPace(session, plan, settings, day) {
  const category = paceCategoryFor(session);
  if (!category) return null;
  if (category === 'E') {
    const easy = easyPaceFor(session, plan, day);
    if (easy) return [easyLabel(session), fmtPaceRange(easy[0], easy[1]), 'eigene Läufe'];
  }
  const resolved = currentVdot(plan, settings, day) || garminVdot(settings);
  if (!resolved) return null;
  const p = trainingPaces(resolved.vdot)[category];
  return [PACE_LABEL[category], fmtPaceRange(p[0], p[1]), resolved.source];
}


const PRESCRIPTION_RE = new RegExp(
  '^(Schwelle|Intervalle|MRT|Tempodauerlauf|Fahrtspiel|Hügel)\\s*:\\s*' +
  '(\\d+)\\s*[×x]\\s*(\\d+(?::\\d{2})?)\\s*(\'|min\\b|s\\b|sek\\b|km\\b)', 'i');
const PRESC_RECOVERY_RE = /\/\s*(\d+(?::\d{2})?)\s*('|min\b|s\b|sek\b)\s*(\w+)?/i;
const RACE_TEXT_RE = /^\s*(WETTKAMPF|HALBMARATHON|TESTLAUF|ZÜRICH MARATHON)/i;

const PRESC_KINDS = {
  schwelle: ['T', 'Schwelle', 'Z4'],
  intervalle: ['I', 'Intervalle', 'Z4–Z5'],
  mrt: ['M', 'Marathontempo', 'Z3'],
  tempodauerlauf: ['M', 'Dauertempo', 'Z3'],
  fahrtspiel: ['M', 'Fahrtspiel', 'Z3'],
  'hügel': [null, 'Hügelläufe', 'hart bergauf'],
};

function prescSeconds(value, unit) {
  const u = unit.toLowerCase().replace(/\.$/, '');
  if (value.indexOf(':') !== -1) {
    const parts = value.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  if (u === "'" || u === 'min') return parseInt(value, 10) * 60;
  if (u === 's' || u === 'sek') return parseInt(value, 10);
  return null;
}

function fmtLegDuration(seconds) {
  if (seconds % 60 === 0) return (seconds / 60) + ' Min.';
  if (seconds < 60) return seconds + ' Sek.';
  return Math.round(seconds / 60) + ' Min.';
}

function fmtLegDistance(km) {
  if (km < 1) return Math.round(km * 1000) + ' m';
  return (Math.round(km * 10) / 10).toString().replace('.', ',') + ' km';
}

export function parsePrescription(session) {
  const lines = (session.description || '').split('\n').map((l) => l.trim()).filter(Boolean);
  if (!lines.length || RACE_TEXT_RE.test(lines[0])) return null;
  const m = PRESCRIPTION_RE.exec(lines[0]);
  if (!m) return null;
  const unit = m[4].toLowerCase();
  const value = m[3];
  const workKm = unit.indexOf('km') === 0 ? parseFloat(value.replace(':', '.')) : null;
  const workS = workKm ? null : prescSeconds(value, unit);
  if (workKm == null && workS == null) return null;

  let recS; let recLabel;
  const rec = PRESC_RECOVERY_RE.exec(lines[0]);
  if (rec) {
    recS = prescSeconds(rec[1], rec[2]);
    const amount = rec[1].indexOf(':') !== -1 ? rec[1] + ' Min.' : fmtLegDuration(recS);
    recLabel = amount + ' ' + (rec[3] || 'Trab');
  } else if (lines[0].toLowerCase().indexOf('zurück') !== -1) {
    recS = (workS || 60) + 30;
    recLabel = 'Trab zurück';
  } else {
    recS = 90; recLabel = '90 Sek. Trab';
  }

  const kind = PRESC_KINDS[m[1].toLowerCase()];
  return {
    category: kind[0], label: kind[1], zone: kind[2],
    reps: parseInt(m[2], 10),
    work_s: workS, work_km: workKm,
    recovery_s: recS, recovery_label: recLabel,
    frame_km: lines.slice(1).join(' ').toUpperCase().indexOf('WU/CD') !== -1 ? 2.0 : null,
  };
}

export function isWorkoutSession(session) {
  return session.training_type === TrainingType.INTERVAL
    || session.training_type === TrainingType.TEMPO;
}

const STEADY_TYPES = [TrainingType.EASY, TrainingType.LONG_RUN, TrainingType.RECOVERY];

export function canUploadToWatch(session) {
  if (isWorkoutSession(session)) return true;
  if (STEADY_TYPES.indexOf(session.training_type) !== -1) {
    return !!(session.target_distance_km || session.target_duration_min);
  }
  return false;
}

const ACTIVATION_HINT = 'Vorher: Aktivierung · Loop Band (5 Min.)';

export function buildWorkout(session, plan, settings, day) {
  const w = buildWorkoutInner(session, plan, settings, day);
  if (w && isWorkoutSession(session)) w.lines = w.lines.concat([ACTIVATION_HINT]);
  return w;
}

function buildWorkoutInner(session, plan, settings, day) {
  if (session.training_type === TrainingType.STRENGTH) return buildStrengthWorkout(session);
  if (!canUploadToWatch(session)) return null;

  const resolved = currentVdot(plan, settings, day) || garminVdot(settings);
  const paces = resolved ? trainingPaces(resolved.vdot) : null;
  const source = resolved ? resolved.source : null;
  const ownEasy = easyPaceRange(plan, day);

  function bounds(cat) {
    if (cat === 'E' && ownEasy) return ownEasy;
    return paces ? paces[cat] : [null, null];
  }
  function prange(cat) {
    const b = bounds(cat);
    return b[0] && b[1] ? fmtPaceRange(b[0], b[1]) : null;
  }

  if (STEADY_TYPES.indexOf(session.training_type) !== -1) {
    const own = easyPaceFor(session, plan, day) || bounds('E');
    const label = easyLabel(session);
    const zone = session.hr_zone !== Zone.NONE ? session.hr_zone : 'Z1–Z2';
    let amount;
    if (session.target_distance_km) amount = fmtLegDistance(session.target_distance_km);
    else if (session.target_duration_min) amount = fmtLegDuration(session.target_duration_min * 60);
    else return null;
    const pace = own[0] && own[1] ? fmtPaceRange(own[0], own[1]) : null;
    return {
      label: label,
      lines: [amount + ' am Stück' + (pace ? ' @ ' + pace : '') + ' (' + label + ', ' + zone + ')'],
      summary: amount + ' ' + label.toLowerCase(),
      pace_text: pace, source: source, effort: null,
    };
  }

  const presc = parsePrescription(session);
  if (presc) {
    const cat = presc.category;
    const pace = cat ? prange(cat) : null;
    const at = pace ? ' @ ' + pace : '';
    const amount = presc.work_km ? fmtLegDistance(presc.work_km) : fmtLegDuration(presc.work_s);
    const frameKm = presc.frame_km;
    const warm = frameKm ? 'Einlaufen: ' + frameKm.toFixed(0) + ' km locker in Z1–Z2'
      : 'Einlaufen: 10–15 Min. locker in Z1–Z2';
    const cool = frameKm ? 'Auslaufen: ' + frameKm.toFixed(0) + ' km locker in Z1'
      : 'Auslaufen: 10 Min. locker in Z1';
    const main = 'Hauptteil: ' + presc.reps + '× ' + amount + at + ' (' + presc.label
      + ', ' + presc.zone + ') · dazwischen ' + presc.recovery_label;
    return {
      label: presc.label,
      lines: [warm, main, cool],
      summary: presc.reps + '× ' + amount + ' · ' + presc.recovery_label,
      pace_text: pace,
      effort: pace ? null : presc.zone,
      source: source,
    };
  }

  const cat = paceCategoryFor(session) || 'T';
  const pace = prange(cat);
  const km = session.target_distance_km;
  const body = km ? fmtLegDistance(Math.max(km - 4, km * 0.6)) + ' im ' + PACE_LABEL[cat] + '-Tempo'
    : '20–30 Min. im ' + PACE_LABEL[cat] + '-Tempo';
  return {
    label: PACE_LABEL[cat],
    lines: ['Einlaufen: 10–15 Min. locker in Z1–Z2',
      'Hauptteil: ' + body + (pace ? ' @ ' + pace : ''),
      'Auslaufen: 10 Min. locker in Z1'],
    summary: body, pace_text: pace, effort: null, source: source,
  };
}

const EXERCISE_LINE_RE = /^\s*\d+\.\s+\S/;

export const SPLIT_KINDS = ['Laufen', 'Traben', 'Gehen', 'Erholung', 'Aufwärmen',
  'Auslaufen', 'Pause'];

const STRENGTH_LINE_PARSE_RE =
  /^\s*\d+\.\s*(.+?)\s*[–-]\s*(\d+)\s*[×x]\s*(\d+)(?:\s*[–-]\s*\d+)?\s*(Sek\.|Min\.)?/i;

export function planExerciseRows(session) {
  const out = [];
  (session.description || '').split('\n').forEach((line) => {
    const m = STRENGTH_LINE_PARSE_RE.exec(line);
    if (!m) return;
    const unit = (m[4] || '').toLowerCase();
    const value = parseInt(m[3], 10);
    const row = {
      exercise: m[1].trim(), sets: parseInt(m[2], 10),
      reps: null, weight_kg: null, duration_s: null, rest_s: null,
    };
    if (unit.indexOf('sek') === 0) row.duration_s = value;
    else if (unit.indexOf('min') === 0) row.duration_s = value * 60;
    else row.reps = value;
    out.push(row);
  });
  return out;
}

function buildStrengthWorkout(session) {
  const lines = (session.description || '').split('\n');
  const exercises = lines.filter((l) => EXERCISE_LINE_RE.test(l));
  if (!exercises.length) return null;
  const head = condenseStrength(session.description || '').split('\n')[0];
  return {
    label: head,
    lines: exercises,
    summary: exercises.length + ' Übungen',
    pace_text: null, effort: exercises.length + ' Übungen', source: null,
  };
}

export function workoutText(session, plan, settings, day) {
  if (session.custom_workout) return session.custom_workout;
  const w = buildWorkout(session, plan, settings, day);
  if (!w) return null;
  const head = w.label + (w.pace_text ? ' · ' + w.pace_text : '');
  return [head].concat(w.lines).join('\n');
}


const STALE_PACE_RE = /,?\s*(?:\w+-)?Pace\s*~?\d{1,2}:\d{2}(?:\s*[-–]\s*\d{1,2}:\d{2})?\s*min\/\s*km/gi;
const EMPTY_PARENS_RE = /\s*\(\s*\)/g;
const ZONE_PACE_RE = /(Z[1-5])\s*·\s*\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}/g;
const BARE_PACE_LINE_RE = /^\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}$/;

function stripStalePace(text) {
  let cleaned = text.replace(STALE_PACE_RE, '').replace(EMPTY_PARENS_RE, '');
  cleaned = cleaned.replace(ZONE_PACE_RE, '$1');
  return cleaned.split('\n').map((l) => l.replace(/\s+$/, ''))
    .filter((l) => l && !BARE_PACE_LINE_RE.test(l)).join('\n');
}

function marathonPaceLine(session, text, plan, settings, day) {
  if (!/\bim MRT\b|Marathontempo/i.test(text)) return null;
  if (paceCategoryFor(session) === 'M') return null;
  const resolved = currentVdot(plan, settings, day) || garminVdot(settings);
  if (!resolved) return null;
  const p = trainingPaces(resolved.vdot).M;
  return 'Endteil MRT: ' + fmtPaceRange(p[0], p[1]) + ' (' + resolved.source + ')';
}

export function planText(session, plan, settings, day, withPace) {
  let text = session.description || '';
  if (session.status === TrainingStatus.DONE) {
    const actual = actualWorkoutText(session);
    if (actual) return actual;
  }
  if (isWorkoutSession(session)) {
    return workoutText(session, plan, settings, day) || text;
  }
  if (session.training_type === TrainingType.STRENGTH) return condenseStrength(text);
  const rec = recommendedPace(session, plan, settings, day);
  if (!rec) return text;
  text = stripStalePace(text);
  const tail = withPace === false ? [] : ['Tempo: ' + rec[1] + ' (' + rec[2] + ')'];
  const extra = marathonPaceLine(session, text, plan, settings, day);
  if (extra) tail.push(extra);
  const joined = tail.join('\n');
  if (text && joined) return text + '\n' + joined;
  return text || joined;
}

const STRENGTH_HEAD_RE = /^(.*?)\s*(?:\(|\s[–-]\s)/;

export function condenseStrength(text) {
  const lines = text.split('\n');
  if (!lines.length) return text;
  const m = STRENGTH_HEAD_RE.exec(lines[0]);
  if (m && m[1].trim()) lines[0] = m[1].trim();
  return lines.join('\n');
}

function exerciseCount(session) {
  if (session.exercise_sets && session.exercise_sets.length) return session.exercise_sets.length;
  const count = (session.description || '').split('\n')
    .filter((l) => EXERCISE_LINE_RE.test(l)).length;
  return count || null;
}

export function paceHint(session, plan, settings, day) {
  if (session.status === TrainingStatus.DONE) {
    if (session.training_type === TrainingType.STRENGTH) {
      const c = exerciseCount(session);
      return c ? c + ' Übungen' : null;
    }
    return actualPace(session) ? fmtPace(actualPace(session)) : null;
  }
  if (session.training_type === TrainingType.STRENGTH) {
    const c = exerciseCount(session);
    return c ? c + ' Übungen' : null;
  }
  if (isWorkoutSession(session)) {
    const w = buildWorkout(session, plan, settings, day);
    if (w && (w.pace_text || w.effort)) return w.pace_text || w.effort;
  }
  const rec = recommendedPace(session, plan, settings, day);
  return rec ? rec[1] : null;
}

export function actualWorkoutText(session) {
  if (session.training_type === TrainingType.STRENGTH) {
    const sets = session.exercise_sets || [];
    if (!sets.length) return null;
    return sets.map((e) => {
      const parts = [e.exercise];
      if (e.sets && e.reps) parts.push(e.sets + '× ' + e.reps);
      else if (e.duration_s) parts.push(fmtMinSec(e.duration_s) + ' Min.');
      if (e.weight_kg) parts.push(e.weight_kg + ' kg');
      return parts.join(' ');
    }).join(' · ');
  }
  const splits = (session.splits || []).filter((s) => s.distance_km && s.duration_s);
  if (!splits.length) return null;
  const work = splits.filter(splitIsWork);
  if (work.length === splits.length) {
    const paces = splits.filter((s) => s.distance_km >= 0.2)
      .map((s) => s.duration_s / s.distance_km).sort((a, b) => a - b);
    const dist = splits.reduce((a, s) => a + s.distance_km, 0);
    if (!paces.length) return null;
    return fmtKm(dist) + ' in ' + splits.length + ' Runden · '
      + fmtMinSec(paces[0]) + '–' + fmtMinSec(paces[paces.length - 1]) + ' min/km';
  }
  const paces = work.map((s) => s.duration_s / s.distance_km).sort((a, b) => a - b);
  const avgLen = work.reduce((a, s) => a + s.distance_km, 0) / work.length;
  const rest = splits.filter((s) => !splitIsWork(s));
  const restText = rest.length
    ? ' (' + Math.round(rest.reduce((a, s) => a + s.duration_s, 0) / rest.length) + ' Sek. Erholung)'
    : '';
  return work.length + '× ' + fmtLegDistance(avgLen) + ' @ '
    + fmtMinSec(paces[0]) + '–' + fmtMinSec(paces[paces.length - 1]) + restText;
}


const SHOE_GHOST = 'Ghost';
const SHOE_KAYANO = 'Kayano';
const LONG_THRESHOLD_REP_MIN = 9;

const SHOE_BY_TYPE = {
  [TrainingType.LONG_RUN]: [SHOE_GHOST, 'rennähnlichste Einheit'],
  [TrainingType.RACE]: [SHOE_GHOST, 'Wettkampfschuh'],
  [TrainingType.EASY]: [SHOE_KAYANO, 'Volumen, viel Dämpfung'],
  [TrainingType.RECOVERY]: [SHOE_KAYANO, 'nie derselbe Schuh wie am Vortag'],
};

const SHOE_BY_TEXT = [
  ['mrt', [SHOE_GHOST, 'Renntempo in den Rennschuh']],
  ['marathontempo', [SHOE_GHOST, 'Renntempo in den Rennschuh']],
  ['intervalle', [SHOE_GHOST, 'höchstes Tempo, schnelle Fussarbeit']],
  ['hügel', [SHOE_KAYANO, 'Schutz beim Runtertraben']],
  ['fahrtspiel', [SHOE_KAYANO, 'Zone 3, lange Gesamtdauer']],
  ['tempodauerlauf', [SHOE_KAYANO, 'Zone 3, lange Gesamtdauer']],
];

const THRESHOLD_REP_RE = /\d+\s*[×x]\s*(\d+)\s*'/;

export function shoeWear(shoe) {
  const limit = shoe.max_km || 0;
  return limit ? (shoe.km || 0) / limit : 0;
}

function shoeFullName(model, settings) {
  const shoes = ((settings.garmin || {}).shoes || [])
    .filter((s) => (s.name || '').toLowerCase().indexOf(model.toLowerCase()) !== -1);
  if (!shoes.length) return model;
  return shoes.slice().sort((a, b) => shoeWear(a) - shoeWear(b))[0].name || model;
}

export function shoeFor(session, settings) {
  if (!RUN_TYPES.has(session.training_type)) return null;
  const text = (session.description || '').trim();
  const low = text.toLowerCase();
  let match = SHOE_BY_TYPE[session.training_type] || null;
  if (RACE_TEXT_RE.test(text)) {
    match = [SHOE_GHOST, 'Wettkampfschuh'];
  } else if (low.indexOf('schwelle') === 0) {
    const rep = THRESHOLD_REP_RE.exec(low);
    const longBlock = rep && parseInt(rep[1], 10) >= LONG_THRESHOLD_REP_MIN;
    match = longBlock ? [SHOE_KAYANO, 'langer Block, 30 Min. an der Schwelle']
      : [SHOE_GHOST, 'kurzer Block, aggressiver Antritt'];
  } else {
    for (let i = 0; i < SHOE_BY_TEXT.length; i += 1) {
      if (low.indexOf(SHOE_BY_TEXT[i][0]) === 0) { match = SHOE_BY_TEXT[i][1]; break; }
    }
  }
  if (!match) return null;
  return [shoeFullName(match[0], settings), match[1]];
}

export function shoeHint(session, settings) {
  const pair = shoeFor(session, settings);
  return pair ? 'Schuh: ' + pair[0] + ' · ' + pair[1] : null;
}


export const MARATHON_DISTANCE_KM = DATA.MARATHON_DISTANCE_KM;

function riegel(distanceKm, durationS, targetKm) {
  return durationS * Math.pow(targetKm / distanceKm, 1.06);
}

export function predictMarathonFromRace(race) {
  if (!race || !race.distance_km || !race.duration_s) return null;
  return riegel(race.distance_km, race.duration_s, MARATHON_DISTANCE_KM) / 60;
}

export function predictMarathonFromLtPace(ltPace) {
  if (!ltPace) return null;
  return riegel(3600 / ltPace, 3600, MARATHON_DISTANCE_KM) / 60;
}

export function predictMarathonFromVo2max(vo2) {
  if (!vo2) return null;
  const distanceM = MARATHON_DISTANCE_KM * 1000;
  let t = 180;
  for (let i = 0; i < 40; i += 1) {
    t = distanceM / velocityAtVo2(vo2 * danielsPercentVo2max(t));
  }
  return t;
}

export function predictMarathon(settings, day) {
  const now = day || today();
  const parts = [];
  const race = settings.recent_race;
  const fromRace = predictMarathonFromRace(race);
  if (fromRace) {
    const age = daysBetween(race.date, now);
    const months = Math.round(age / 30);
    parts.push([fromRace, age > 120 ? 0.25 : 0.6,
      age > 120 ? 'Rennen (' + months + ' Mte alt)' : 'Rennen']);
  }
  const fromLt = predictMarathonFromLtPace(lactatePace(settings));
  if (fromLt) parts.push([fromLt, 0.35, 'Schwelle']);
  const fromVo2 = predictMarathonFromVo2max(vo2maxOf(settings));
  if (fromVo2) parts.push([fromVo2, 0.15, 'VO2max']);
  if (!parts.length) return null;
  const totalW = parts.reduce((a, p) => a + p[1], 0);
  return {
    minutes: parts.reduce((a, p) => a + p[0] * p[1], 0) / totalW,
    source: parts.slice().sort((a, b) => b[1] - a[1]).map((p) => p[2]).join(' · '),
  };
}

const READY_LONGRUN_KM = 32;
const READY_WEEKLY_KM = 55;

export function enduranceReadiness(plan, day) {
  const now = day || today();
  const runs = doneRuns(plan, addDays(now, -28));
  const longest = Math.max(0, ...plan.sessions
    .filter((s) => s.status === TrainingStatus.DONE && s.actual_distance_km)
    .map((s) => s.actual_distance_km));
  const weekly = runs.reduce((a, s) => a + (s.actual_distance_km || 0), 0) / 4;
  const longShare = Math.min(1, longest / READY_LONGRUN_KM);
  const kmShare = Math.min(1, weekly / READY_WEEKLY_KM);
  return 0.6 * longShare + 0.4 * kmShare;
}

export function predictMarathonAdjusted(plan, settings, day) {
  const base = predictMarathon(settings, day);
  if (!base) return null;
  const readiness = enduranceReadiness(plan, day);
  return {
    minutes: base.minutes * (1 + 0.13 * (1 - readiness)),
    source: base.source,
    readiness: readiness,
  };
}


function diaryBaseline(plan, field, day) {
  const now = day || today();
  const since = addDays(now, -14);
  const values = Object.keys(plan.diary || {})
    .filter((d) => d >= since && d < now)
    .map((d) => plan.diary[d][field]).filter(Boolean).sort((a, b) => a - b);
  return values.length ? values[Math.floor(values.length / 2)] : null;
}

export function readinessToday(plan, day) {
  const now = day || today();
  const entry = (plan.diary || {})[now];
  if (!entry) return null;
  if (!entry.resting_hr && !entry.hrv && !entry.soreness && !entry.sleep_h) return null;
  let score = 100;
  const notes = [];
  const rhrBase = diaryBaseline(plan, 'resting_hr', now);
  if (entry.resting_hr && rhrBase) {
    const delta = entry.resting_hr - rhrBase;
    if (delta >= 3) { score -= Math.min(30, delta * 5); notes.push('Ruhepuls +' + delta + ' bpm'); }
  }
  const hrvBase = diaryBaseline(plan, 'hrv', now);
  if (entry.hrv && hrvBase) {
    const drop = (hrvBase - entry.hrv) / hrvBase;
    if (drop > 0.1) { score -= Math.min(30, drop * 100); notes.push('HRV gedämpft'); }
  }
  if (entry.soreness) { score -= entry.soreness * 5; if (entry.soreness >= 3) notes.push('Muskelkater'); }
  if (entry.sleep_h && entry.sleep_h < 7) {
    score -= (7 - entry.sleep_h) * 6;
    notes.push('wenig Schlaf');
  }
  score = Math.max(0, Math.min(100, Math.round(score)));
  return {
    score: score,
    accent: score >= 75 ? 'done' : score >= 50 ? 'aerob_high' : 'missed',
    note: notes.length ? notes.join(' · ') : 'alles im Rahmen',
  };
}


export const FALLBACK_WEIGHT_KG = 70;
export const MIN_DURATION_MIN = 60;      // darunter sagt der Plan „nichts noetig"
export const LONGRUN_FUELING_KM = 20;
export const GEL_CARBS_G = 25;
const FALLBACK_PACE_S_PER_KM = 375;      // Longrun-Vorgabe des Plans

const DURING_BANDS = [
  [60, 90, [30, 30], [300, 500]],
  [90, 150, [40, 60], [400, 600]],
  [150, null, [60, 70], [500, 700]],
];

export function bodyWeight(plan) {
  const days = Object.keys(plan.diary || {}).filter((d) => plan.diary[d].weight_kg).sort();
  if (!days.length) return null;
  const last = days[days.length - 1];
  return [plan.diary[last].weight_kg, last];
}

export function bodyWeightKg(plan) {
  const w = bodyWeight(plan);
  return w ? w[0] : FALLBACK_WEIGHT_KG;
}

export function weightSourceText(plan, day) {
  const w = bodyWeight(plan);
  if (!w) return 'Profilwert – trag dein Gewicht ins Tagebuch ein';
  const age = daysBetween(w[1], day || today());
  const base = fmtWeight(w[0]) + ' kg · gemessen am ' + fmtDate(w[1]);
  return age > 90 ? base + ' (länger nicht gewogen)' : base;
}

function fmtWeight(kg) {
  return (Math.round(kg * 10) / 10).toString().replace('.', ',');
}

function round5(g) { return Math.round(g / 5) * 5; }

function paceForFueling(session, plan, settings, day) {
  const rec = recommendedPace(session, plan, settings, day);
  if (rec) {
    const m = /(\d+):(\d{2})/.exec(rec[1]);
    if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }
  return FALLBACK_PACE_S_PER_KM;
}

export function estimatedDurationMin(session, plan, settings, day) {
  if (session.actual_duration_s) return Math.round(session.actual_duration_s / 60);
  if (session.training_type === TrainingType.RACE) return Math.round(settings.target_time_min);
  const presc = isWorkoutSession(session) ? parsePrescription(session) : null;
  if (presc) {
    const frame = presc.frame_km ? (presc.frame_km * 2 * FALLBACK_PACE_S_PER_KM) : 22 * 60;
    const pace = paceForFueling(session, plan, settings, day);
    const workOne = presc.work_s || (presc.work_km * pace);
    const total = frame + presc.reps * workOne + (presc.reps - 1) * presc.recovery_s;
    return Math.round(total / 60);
  }
  if (session.target_duration_min) return Math.round(session.target_duration_min);
  if (session.target_distance_km) {
    return Math.round((session.target_distance_km * paceForFueling(session, plan, settings, day)) / 60);
  }
  return null;
}

function duringBand(durationMin, isRace) {
  if (isRace) return DURING_BANDS[DURING_BANDS.length - 1];
  for (let i = 0; i < DURING_BANDS.length; i += 1) {
    const b = DURING_BANDS[i];
    if (durationMin >= b[0] && (b[1] === null || durationMin < b[1])) return b;
  }
  return null;
}

function span(rate, hours, step) {
  return rate.map((r) => Math.round((r * hours) / step) * step);
}

export function fmtHours(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return m + ' Min.';
  return m ? h + ' h ' + m + ' Min.' : h + ' h';
}

export function fuelingFor(session, plan, settings, day) {
  if (!RUN_TYPES.has(session.training_type)) return null;
  const duration = estimatedDurationMin(session, plan, settings, day);
  if (duration == null || duration < MIN_DURATION_MIN) return null;

  const isRace = session.training_type === TrainingType.RACE;
  const weight = bodyWeightKg(plan);
  const fuel = { duration_min: duration, before: [], during: [], after: [], hint: null };

  if (isRace) {
    fuel.before.push(['3 h vorher', '100–150 g KH · Weissbrot mit Honig, Banane, Haferbrei mit '
      + 'Wasser – wenig Fett und Ballaststoffe']);
    fuel.before.push(['2 h vorher', '500 ml Wasser oder Sportgetränk in kleinen Schlucken']);
    fuel.before.push(['10 min vorher', 'letztes Gel optional']);
  } else {
    const low = round5(weight); const high = round5(weight * 1.5);
    fuel.before.push(['2–3 h vorher', low + '–' + high + ' g KH (' + fmtWeight(weight)
      + ' kg × 1–1,5 g) · Weissbrot mit Honig und eine Banane, oder Haferflocken mit '
      + 'Wasser und Sirup']);
    if (duration >= 90) {
      fuel.before.push(['30–60 min vorher', '20–30 g schnelle KH · Banane, Reiswaffel, Sportgetränk']);
    }
    if (session.training_type === TrainingType.LONG_RUN) {
      fuel.before.push(['früh morgens',
        'mindestens eine Kleinigkeit – nüchtern ist bei deinem Gewicht nicht sinnvoll']);
    }
  }

  const band = duringBand(duration, isRace);
  if (band) {
    const carbsRate = band[2]; const fluidRate = band[3];
    const hours = duration / 60;
    fuel.carbs_during_g = span(carbsRate, hours, 5);
    fuel.fluid_ml = span(fluidRate, hours, 100);
    fuel.gels = Math.max(1, Math.round(fuel.carbs_during_g[1] / GEL_CARBS_G));
    const rateText = carbsRate[0] === carbsRate[1] ? carbsRate[0] + ' g/h'
      : carbsRate[0] + '–' + carbsRate[1] + ' g/h';
    const carbText = fuel.carbs_during_g[0] !== fuel.carbs_during_g[1]
      ? fuel.carbs_during_g[0] + '–' + fuel.carbs_during_g[1] + ' g KH'
      : fuel.carbs_during_g[0] + ' g KH';
    fuel.during.push(['Kohlenhydrate', carbText + ' über ' + fmtHours(duration) + ' (' + rateText + ')']);
    fuel.during.push(['Praktisch', 'ca. ' + fuel.gels + ' Gel' + (fuel.gels === 1 ? '' : 's')
      + ' à ' + GEL_CARBS_G + ' g, alle 35–40 min eines mit ein paar Schlucken Wasser']);
    fuel.during.push(['Flüssigkeit', fuel.fluid_ml[0] + '–' + fuel.fluid_ml[1] + ' ml ('
      + fluidRate[0] + '–' + fluidRate[1] + ' ml/h)']);
    if (duration >= 90) fuel.during.push(['Bei Hitze', '300–600 mg Natrium pro Liter Getränk']);
  }

  const afterLow = round5(weight); const afterHigh = round5(weight * 1.2);
  fuel.after.push(['in 30–60 min', afterLow + '–' + afterHigh + ' g KH plus 20–25 g Protein · '
    + '500 ml Milch mit Banane und Honig, oder Brot mit Käse und ein Glas Saft']);
  fuel.after.push(['in 2 h', 'eine normale Mahlzeit']);
  if (isRace) fuel.after.push(['nach dem Ziel', 'weitergehen statt hinsetzen, warm anziehen']);
  else if (session.training_type === TrainingType.LONG_RUN) {
    fuel.after.push(['über den Tag', 'weiteressen – ein Longrun-Tag lässt sich nicht mit einer '
      + 'einzigen grossen Mahlzeit abdecken']);
  }

  if (isRace) {
    fuel.hint = 'Nichts Neues am Renntag: dieselben Gels und dasselbe Frühstück wie im '
      + 'Training. Erstes Gel bei km 8–10, danach alle 35–40 min.';
  } else if (session.training_type === TrainingType.LONG_RUN
      && (session.target_distance_km || 0) >= LONGRUN_FUELING_KM) {
    fuel.hint = '60–70 g pro Stunde muss der Darm lernen – bei jedem langen Lauf über '
      + LONGRUN_FUELING_KM + ' km üben, mit der Verpflegung vom Renntag.';
  }
  return fuel;
}

export function fuelingSummary(fuel) {
  if (!fuel) return null;
  if (!fuel.carbs_during_g) return 'Verpflegung: nichts nötig, nach Durst trinken';
  return 'Verpflegung: ' + fuel.gels + ' Gel' + (fuel.gels === 1 ? '' : 's') + ' · '
    + fuel.carbs_during_g[0] + '–' + fuel.carbs_during_g[1] + ' g KH · '
    + fuel.fluid_ml[0] + '–' + fuel.fluid_ml[1] + ' ml';
}

export const CARBO_DAYS_RACE = 3;
export const CARBO_DAYS_TEST = 1;
const CARBO_G_PER_KG = [9.0, 10.0];
const CARBO_SWITCH_G_PER_KG = [8.0, 8.0];
const CARBO_SWITCH_DAY = 3;

function isTestRace(session) {
  return session.training_type === TrainingType.TEMPO
    && RACE_TEXT_RE.test((session.description || '').trim());
}

export function carboLoading(plan, settings, day) {
  const now = day || today();
  const weight = bodyWeightKg(plan);
  const races = plan.sessions.filter((s) => s.date && !s.archived
    && (s.training_type === TrainingType.RACE || isTestRace(s)));
  for (let i = 0; i < races.length; i += 1) {
    const race = races[i];
    const isMain = race.training_type === TrainingType.RACE;
    const window = isMain ? CARBO_DAYS_RACE : CARBO_DAYS_TEST;
    const left = daysBetween(now, race.date);
    if (left < 0 || left > window) continue;
    if (left === 0) {
      return { title: 'Renntag', text: 'Nichts Neues ausprobieren – Frühstück und Gels '
        + 'genau wie im Training geübt.', days_left: 0 };
    }
    const rate = (isMain && left === CARBO_SWITCH_DAY) ? CARBO_SWITCH_G_PER_KG : CARBO_G_PER_KG;
    const low = round5(weight * rate[0]);
    const high = round5(weight * rate[1]);
    const amount = low === high ? low + ' g KH' : low + '–' + high + ' g KH';
    const text = (isMain && left === CARBO_SWITCH_DAY)
      ? amount + ' wie sonst, aber ab heute ballaststoffarm: Weissbrot statt Vollkorn, '
        + 'keine Hülsenfrüchte, wenig Rohkost.'
      : amount + ' über den Tag verteilt (' + rate[0] + '–' + rate[1] + ' g/kg) · '
        + 'Reis, Pasta, Weissbrot, Bananen, Säfte. Wenig Fett und Ballaststoffe.';
    return {
      title: 'Carboloading · noch ' + left + ' ' + (left === 1 ? 'Tag' : 'Tage')
        + ' bis ' + (isMain ? 'zum Marathon' : 'zum Testrennen'),
      text: text, days_left: left,
    };
  }
  return null;
}


export function fmtClock(seconds) {
  return Math.floor(seconds / 3600) + ':'
    + String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
}

export function racePlan(settings) {
  const targets = DATA.RACE_TARGETS;
  const want = (settings && settings.target_time_min) || 225;
  let target = targets[0];
  targets.forEach((t) => {
    if (Math.abs(t - want) < Math.abs(target - want)) target = t;
  });
  const column = targets.indexOf(target);
  const total = DATA.RACE_STATIONS.length;
  const stations = DATA.RACE_STATIONS.map((st) => ({
    number: st.number,
    km: st.km,
    place: st.place,
    gel: st.gel,
    time_s: st.times[column],
    what: st.number === total ? 'Ziel · Buffet'
      : st.gel ? 'Gel ' + st.gel + ' (' + DATA.RACE_GEL_CARBS_G + ' g) + 2 Becher Wasser'
        : 'Nur Iso, ein paar Schlucke',
  }));
  const carbs = DATA.RACE_CARBS[String(target)];
  return {
    target_min: target,
    stations: stations,
    gels: stations.filter((s) => s.gel).length,
    carbs_per_h: carbs,
    note: carbs[1] <= 70 ? 'Genau im Zielbereich.'
      : 'Leicht über dem Zielbereich – dann entweder Gel 1 weglassen oder am Iso sparen.',
    rules: DATA.RACE_RULES,
  };
}


const DIARY_ALIASES = {
  sleep_hours: 'sleep_h', sleep: 'sleep_h', sleep_hrs: 'sleep_h',
  body_weight: 'weight_kg', body_weight_kg: 'weight_kg', weight: 'weight_kg',
  rhr: 'resting_hr', resting_heart_rate: 'resting_hr',
  hrv_ms: 'hrv', rmssd: 'hrv',
  mood: 'feeling', muscle_soreness: 'soreness',
};

const DIARY_CONTENT_FIELDS = ['sleep_h', 'weight_kg', 'feeling', 'note', 'resting_hr',
  'hrv', 'soreness', 'niggle', 'body_battery', 'stress_avg', 'sleep_score', 'hrv_status'];

export function normalizeDiaryEntry(entry) {
  if (!entry || typeof entry !== 'object') return entry;
  Object.keys(DIARY_ALIASES).forEach((from) => {
    const to = DIARY_ALIASES[from];
    if (entry[from] === null || entry[from] === undefined) return;
    if (entry[to] === null || entry[to] === undefined || entry[to] === '') entry[to] = entry[from];
    delete entry[from];
  });
  return entry;
}

export function normalizeDiary(diary) {
  Object.keys(diary || {}).forEach((d) => normalizeDiaryEntry(diary[d]));
  return diary || {};
}

export function diaryHasContent(entry) {
  if (!entry) return false;
  return DIARY_CONTENT_FIELDS.some((f) => {
    const v = entry[f];
    return typeof v === 'string' ? v.trim() !== '' : (v !== null && v !== undefined);
  });
}

export function diarySeries(plan, field, days, day) {
  const now = day || today();
  const since = days ? addDays(now, -(days - 1)) : null;
  return Object.keys(plan.diary || {})
    .filter((d) => d <= now && (!since || d >= since))
    .filter((d) => {
      const v = plan.diary[d][field];
      return v !== null && v !== undefined && v !== '' && isFinite(Number(v));
    })
    .sort()
    .map((d) => ({ date: d, value: Number(plan.diary[d][field]) }));
}

export function sessionSeries(plan, field, days, day) {
  const now = day || today();
  const since = days ? addDays(now, -(days - 1)) : null;
  const perDay = {};
  plan.sessions.forEach((s) => {
    if (s.status !== TrainingStatus.DONE || !s.date || s.archived) return;
    if (s.date > now || (since && s.date < since)) return;
    const v = s[field];
    if (v === null || v === undefined || !isFinite(Number(v))) return;
    (perDay[s.date] = perDay[s.date] || []).push(Number(v));
  });
  return Object.keys(perDay).sort().map((d) => ({
    date: d,
    value: perDay[d].reduce((a, b) => a + b, 0) / perDay[d].length,
  }));
}

export function historySeries(settings, list, field) {
  return ((settings || {})[list] || [])
    .filter((e) => e && e[field] !== null && e[field] !== undefined && isFinite(Number(e[field])))
    .map((e) => ({ date: String(e.date).slice(0, 10), value: Number(e[field]) }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

function avgOf(values) {
  const clean = values.filter((v) => v !== null && v !== undefined && isFinite(v));
  return clean.length ? clean.reduce((a, b) => a + b, 0) / clean.length : null;
}

export function recentMondays(count, day) {
  const monday = weekStartOf(day || today());
  const out = [];
  for (let i = count - 1; i >= 0; i -= 1) out.push(addDays(monday, -7 * i));
  return out;
}

export function weeklyKmBars(plan, count, day) {
  const all = recentMondays(count, day);
  return all.map((m, i) => ({
    label: fmtDateShort(m).replace('. ', '.'),
    value: kmInRange(plan, m, addDays(m, 6)),
    sub: 'Woche ab ' + fmtDateShort(m),
    accent: i === all.length - 1,
  }));
}

export function weeklyLoadBars(plan, count, day) {
  const now = day || today();
  const all = recentMondays(count, day);
  return all.map((m, i) => {
    const end = addDays(m, 6);
    const load = plan.sessions
      .filter((s) => s.status === TrainingStatus.DONE && s.date && s.date >= m
        && s.date <= end && s.date <= now)
      .reduce((a, s) => a + sessionLoad(s), 0);
    return {
      label: fmtDateShort(m).replace('. ', '.'),
      value: Math.round(load * 10) / 10,
      sub: 'Woche ab ' + fmtDateShort(m),
      accent: i === all.length - 1,
    };
  });
}

export function plannedKmOfWeek(plan, monday) {
  return countedWeekSessions(weekSessions(plan, monday))
    .reduce((a, s) => a + (s.target_distance_km || 0), 0);
}

export function weeklyPlanActual(plan, count, day) {
  const weeks = recentMondays(count, day);
  return {
    labels: weeks.map((m) => fmtDateShort(m).replace('. ', '.')),
    subs: weeks.map((m) => 'Woche ab ' + fmtDateShort(m)),
    series: [
      { name: 'geplant', color: DATA.PALETTE.TEXT_MUTED || '#9aa5b8',
        values: weeks.map((m) => Math.round(plannedKmOfWeek(plan, m) * 10) / 10) },
      { name: 'gelaufen', color: DATA.STATUS_COLOR['erledigt'],
        values: weeks.map((m) => Math.round(kmInRange(plan, m, addDays(m, 6)) * 10) / 10) },
    ],
  };
}

export const AEROB_LIGHT_MAX = 2.9;

export function weeklyFormCurve(plan, count, day) {
  const now = day || today();
  const weeks = recentMondays(count, day);
  const light = [];
  const high = [];
  const ana = [];
  weeks.forEach((monday) => {
    const end = addDays(monday, 6);
    let l = 0;
    let h = 0;
    let a = 0;
    plan.sessions.forEach((s) => {
      if (s.status !== TrainingStatus.DONE || !s.date) return;
      if (s.date < monday || s.date > end || s.date > now) return;
      const aerobic = s.aerobic_benefit || 0;
      if (aerobic) {
        if (aerobic <= AEROB_LIGHT_MAX) l += aerobic;
        else h += aerobic;
      }
      a += 1.5 * (s.anaerobic_benefit || 0);
    });
    light.push(Math.round(l * 10) / 10);
    high.push(Math.round(h * 10) / 10);
    ana.push(Math.round(a * 10) / 10);
  });
  return {
    labels: weeks.map((m) => fmtDateShort(m).replace('. ', '.')),
    subs: weeks.map((m) => 'Woche ab ' + fmtDateShort(m)),
    series: [
      { name: 'aerob leicht', color: '#60a5fa', values: light },
      { name: 'aerob hoch', color: '#fb923c', values: high },
      { name: 'anaerob', color: '#f472b6', values: ana },
    ],
  };
}

export function zoneMinuteBars(plan, settings, weeks, day) {
  const now = day || today();
  const since = addDays(now, -7 * (weeks || 4) + 1);
  const totals = {};
  (settings.zones || []).forEach((z) => { totals[z.zone] = 0; });
  plan.sessions.forEach((s) => {
    if (s.status !== TrainingStatus.DONE || !s.date || s.date < since || s.date > now) return;
    Object.keys(s.zone_minutes || {}).forEach((z) => {
      if (totals[z] !== undefined) totals[z] += Number(s.zone_minutes[z]) || 0;
    });
  });
  return (settings.zones || []).map((z) => ({
    label: z.zone,
    value: Math.round(totals[z.zone] * 10) / 10,
    sub: z.zone + ' · ' + z.name,
    color: DATA.ZONE_COLOR[z.zone] || DATA.PALETTE.ACCENT,
    accent: true,
  }));
}

export function runPaceSeries(plan, days, day) {
  const now = day || today();
  const since = days ? addDays(now, -(days - 1)) : null;
  return plan.sessions
    .filter((s) => s.status === TrainingStatus.DONE && s.date && !s.archived
      && RUN_TYPES.has(s.training_type) && s.date <= now && (!since || s.date >= since)
      && actualPace(s))
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((s) => ({ date: s.date, value: actualPace(s) }));
}

export function runGapSeries(plan, days, day) {
  const now = day || today();
  const since = days ? addDays(now, -(days - 1)) : null;
  return plan.sessions
    .filter((s) => s.status === TrainingStatus.DONE && s.date && !s.archived
      && RUN_TYPES.has(s.training_type) && s.date <= now && (!since || s.date >= since)
      && s.grade_adjusted_pace_s_per_km)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((s) => ({ date: s.date, value: s.grade_adjusted_pace_s_per_km }));
}

export function weeklyElevationBars(plan, count, day) {
  const now = day || today();
  const weeks = recentMondays(count, day);
  return weeks.map((m, i) => {
    const end = addDays(m, 6);
    const total = plan.sessions
      .filter((s) => s.status === TrainingStatus.DONE && s.date && s.date >= m
        && s.date <= end && s.date <= now)
      .reduce((a, s) => a + (s.elevation_gain_m || 0), 0);
    return {
      label: fmtDateShort(m).replace('. ', '.'),
      value: Math.round(total),
      sub: 'Woche ab ' + fmtDateShort(m),
      accent: i === weeks.length - 1,
    };
  });
}

export const DIARY_METRICS = [
  { key: 'schlaf', group: 'erholung', label: 'Schlaf', unit: 'h', color: '#60a5fa', kind: 'line',
    format: (v) => (Math.round(v * 10) / 10).toString().replace('.', ','),
    series: (p, s, d) => diarySeries(p, 'sleep_h', 90, d) },
  { key: 'gewicht', group: 'erholung', label: 'Gewicht', unit: 'kg', color: '#d8b4fe', kind: 'line',
    format: (v) => (Math.round(v * 10) / 10).toString().replace('.', ','),
    series: (p, s, d) => diarySeries(p, 'weight_kg', 400, d) },
  { key: 'ruhepuls', group: 'erholung', label: 'Ruhepuls', unit: 'bpm', color: '#f87171', kind: 'line',
    format: (v) => String(Math.round(v)),
    series: (p, s, d) => diarySeries(p, 'resting_hr', 90, d) },
  { key: 'hrv', group: 'erholung', label: 'HRV', unit: 'ms', color: '#34d399', kind: 'line',
    format: (v) => String(Math.round(v)),
    series: (p, s, d) => diarySeries(p, 'hrv', 90, d) },
  { key: 'gefuehl', group: 'erholung', label: 'Gefühl', unit: '/5', color: '#fbbf24', kind: 'line',
    format: (v) => (Math.round(v * 10) / 10).toString().replace('.', ','),
    series: (p, s, d) => diarySeries(p, 'feeling', 90, d) },
  { key: 'rpe', group: 'training', label: 'Anstrengung', unit: '/10', color: '#fb923c', kind: 'line',
    format: (v) => (Math.round(v * 10) / 10).toString().replace('.', ','),
    series: (p, s, d) => sessionSeries(p, 'perceived_effort', 90, d) },
  { key: 'muskelkater', group: 'erholung', label: 'Muskelkater', unit: '/5', color: '#f472b6', kind: 'line',
    format: (v) => (Math.round(v * 10) / 10).toString().replace('.', ','),
    series: (p, s, d) => diarySeries(p, 'soreness', 90, d) },
  { key: 'vo2max', group: 'form', label: 'VO2max', unit: '', color: '#34d399', kind: 'line',
    format: (v) => (Math.round(v * 10) / 10).toString().replace('.', ','),
    series: (p, s) => historySeries(s, 'vo2max_history', 'value') },
  { key: 'laktat_hr', group: 'form', label: 'Schwellenpuls', unit: 'bpm', color: '#fb923c', kind: 'line',
    format: (v) => String(Math.round(v)),
    series: (p, s) => historySeries(s, 'lactate_history', 'hr') },
  { key: 'laktat_pace', group: 'form', label: 'Schwellen-Pace', unit: '/km', color: '#60a5fa',
    kind: 'line', invert: true, format: (v) => fmtMinSec(Math.round(v)),
    series: (p, s) => historySeries(s, 'lactate_history', 'pace_s_per_km') },
  { key: 'km_woche', group: 'training', label: 'km je Woche', unit: 'km', color: '#ff5a1f', kind: 'bar',
    format: (v) => String(Math.round(v)),
    bars: (p, s, d) => weeklyKmBars(p, 10, d) },
  { key: 'belastung', group: 'training', label: 'Belastung', unit: '', color: '#fb923c', kind: 'bar',
    format: (v) => (Math.round(v * 10) / 10).toString().replace('.', ','),
    bars: (p, s, d) => weeklyLoadBars(p, 10, d) },

  { key: 'km_soll_ist', group: 'training', label: 'km geplant/gelaufen', unit: 'km',
    kind: 'multi', color: '#34d399',
    format: (v) => (Math.round(v * 10) / 10).toString().replace('.', ','),
    data: (p, s, d) => weeklyPlanActual(p, 10, d),
    note: 'Was die Woche vorsah und was daraus wurde. Geplant zählt zur Planwoche, '
      + 'gelaufen zum Tag – eine nachgeholte Einheit belastet dann, wenn du sie läufst.' },
  { key: 'formkurve', group: 'training', label: 'Formkurve', unit: '', kind: 'multi',
    stacked: true, color: '#60a5fa',
    format: (v) => (Math.round(v * 10) / 10).toString().replace('.', ','),
    data: (p, s, d) => weeklyFormCurve(p, 10, d),
    note: 'Die Wochenbelastung, aufgeschlüsselt: viel Blau heisst ruhiger '
      + 'Grundlagenblock, viel Orange und Pink eine harte Woche.' },
  { key: 'zonen', group: 'training', label: 'Zeit je Zone', unit: 'Min.', kind: 'bar',
    color: '#fb923c',
    format: (v) => String(Math.round(v)),
    bars: (p, s, d) => zoneMinuteBars(p, s, 4, d),
    note: 'Vier Wochen. Zeigt, ob das Training polarisiert ist (viel Z1/Z2, wenig '
      + 'dazwischen) oder in der Mitte hängt. Erfasst wird es beim Abhaken einer Einheit.' },
  { key: 'hoehenmeter', group: 'training', label: 'Höhenmeter', unit: 'hm', kind: 'bar',
    color: '#d8b4fe',
    format: (v) => String(Math.round(v)),
    bars: (p, s, d) => weeklyElevationBars(p, 10, d) },
  { key: 'kadenz', group: 'training', label: 'Kadenz', unit: 'spm', kind: 'line',
    color: '#22d3ee',
    format: (v) => String(Math.round(v)),
    series: (p, s, d) => sessionSeries(p, 'avg_cadence_spm', 90, d),
    note: 'Um 170–180 Schritte je Minute gilt als ökonomisch; eine tiefe Kadenz '
      + 'geht meist mit langem Bodenkontakt einher.' },
  { key: 'pace', group: 'form', label: 'Pace je Lauf', unit: '/km', kind: 'line',
    invert: true, color: '#ff5a1f',
    format: (v) => fmtMinSec(Math.round(v)),
    series: (p, s, d) => runPaceSeries(p, 120, d),
    compare: (p, s, d) => ({ points: runGapSeries(p, 120, d),
      color: 'rgba(255,255,255,0.55)', name: 'steigungsangepasst' }),
    note: 'Die gestrichelte Linie ist die steigungsangepasste Pace der Uhr. '
      + 'Läuft sie deutlich unter der gemessenen, war der Lauf hügelig – die '
      + 'Form ist besser, als die rohe Zahl sagt.' },
  { key: 'body_battery', group: 'erholung', label: 'Body Battery', unit: '', kind: 'line',
    color: '#34d399', zeroBased: true,
    format: (v) => String(Math.round(v)),
    series: (p, s, d) => diarySeries(p, 'body_battery', 90, d),
    note: 'Der Ladestand beim Aufwachen. Kommt über den Garmin-Abgleich der Desktop-App.' },
  { key: 'stress', group: 'erholung', label: 'Stress', unit: '', kind: 'line',
    color: '#f87171', invert: true,
    format: (v) => String(Math.round(v)),
    series: (p, s, d) => diarySeries(p, 'stress_avg', 90, d),
    note: 'Garmins Tagesschnitt: bis 25 Ruhe, bis 50 niedrig, bis 75 mittel, '
      + 'darüber hoch. Die Achse zeigt abwärts – oben ist ruhiger.' },
  { key: 'schlafscore', group: 'erholung', label: 'Schlafscore', unit: '', kind: 'line',
    color: '#818cf8',
    format: (v) => String(Math.round(v)),
    series: (p, s, d) => diarySeries(p, 'sleep_score', 90, d) },
];

export const METRIC_GROUPS = [
  { key: 'erholung', label: 'Erholung' },
  { key: 'training', label: 'Training' },
  { key: 'form', label: 'Form' },
];

export function metricsOfGroup(group) {
  return DIARY_METRICS.filter((m) => (m.group || 'erholung') === group);
}

export function diaryMetric(key) {
  return DIARY_METRICS.find((m) => m.key === key) || DIARY_METRICS[0];
}

export function diaryOverview(plan, weeks, day) {
  const monday = weekStartOf(day || today());
  const starts = groupByWeek(plan).map((w) => w[0])
    .filter((m) => m <= monday).slice(-(weeks || 6));
  const rows = starts.map((start) => {
    const end = addDays(start, 6);
    const count = weekSessionCount(weekSessions(plan, start));
    const entries = Object.keys(plan.diary || {})
      .filter((d) => d >= start && d <= end).map((d) => plan.diary[d]);
    return {
      monday: start,
      done: count[0],
      total: count[1],
      km: kmInRange(plan, start, end),
      sleep: avgOf(entries.map((e) => e.sleep_h)),
      resting_hr: avgOf(entries.map((e) => e.resting_hr)),
      soreness: avgOf(entries.map((e) => e.soreness)),
      is_current: start === monday,
    };
  });
  return rows.reverse();
}


export function monthGrid(monthIso) {
  const first = monthIso.slice(0, 7) + '-01';
  const start = weekStartOf(first);
  const d = dt(first);
  const last = iso(new Date(d.getFullYear(), d.getMonth() + 1, 0));
  const end = addDays(weekStartOf(last), 6);
  const out = [];
  for (let cur = start; cur <= end; cur = addDays(cur, 1)) out.push(cur);
  return out;
}

export function monthOf(day) { return day.slice(0, 7); }

export function addMonths(monthIso, n) {
  const y = parseInt(monthIso.slice(0, 4), 10);
  const m = parseInt(monthIso.slice(5, 7), 10) - 1 + n;
  return iso(new Date(y, m, 1)).slice(0, 7);
}

const MONTH_NAMES = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
  'August', 'September', 'Oktober', 'November', 'Dezember'];

export function fmtMonth(monthIso) {
  return MONTH_NAMES[parseInt(monthIso.slice(5, 7), 10) - 1] + ' ' + monthIso.slice(0, 4);
}

export function dayMarks(plan, day) {
  const sess = sessionsOn(plan, day).filter((s) => !s.archived);
  return {
    types: sess.map((s) => s.training_type),
    done: sess.filter((s) => s.status === TrainingStatus.DONE).length,
    planned: sess.length,
    diary: diaryHasContent((plan.diary || {})[day]),
    km: sess.filter((s) => s.status === TrainingStatus.DONE)
      .reduce((a, s) => a + (s.actual_distance_km || 0), 0),
  };
}

export function monthSummary(plan, monthIso, day) {
  const now = day || today();
  const first = monthIso + '-01';
  const d = dt(first);
  const last = iso(new Date(d.getFullYear(), d.getMonth() + 1, 0));
  const inRange = (x) => x >= first && x <= last;
  const done = plan.sessions.filter((s) => s.status === TrainingStatus.DONE
    && s.date && inRange(s.date) && !s.archived);
  const runs = done.filter((s) => RUN_TYPES.has(s.training_type));
  const km = runs.reduce((a, s) => a + (s.actual_distance_km || 0), 0);
  const seconds = runs.reduce((a, s) => a + (s.actual_duration_s || 0), 0);
  const entries = Object.keys(plan.diary || {}).filter(inRange).map((x) => plan.diary[x]);
  const planned = plan.sessions.filter((s) => s.date && inRange(s.date) && !s.archived
    && countsForWeek(s.training_type) && s.status !== TrainingStatus.MISSED).length;
  return {
    month: monthIso,
    first: first,
    last: last,
    is_current: monthOf(now) === monthIso,
    done: done.length,
    planned: planned,
    runs: runs.length,
    km: km,
    duration_s: seconds,
    pace: km ? seconds / km : null,
    elevation: runs.reduce((a, s) => a + (s.elevation_gain_m || 0), 0),
    load: done.reduce((a, s) => a + sessionLoad(s), 0),
    strength: done.filter((s) => s.training_type === TrainingType.STRENGTH).length,
    longest: runs.reduce((a, s) => Math.max(a, s.actual_distance_km || 0), 0),
    diary_days: entries.filter(diaryHasContent).length,
    sleep: avgOf(entries.map((e) => e.sleep_h)),
    resting_hr: avgOf(entries.map((e) => e.resting_hr)),
    hrv: avgOf(entries.map((e) => e.hrv)),
    weight: avgOf(entries.map((e) => e.weight_kg)),
    feeling: avgOf(entries.map((e) => e.feeling)),
  };
}


function kmInRange(plan, from, to) {
  return plan.sessions.filter((s) => s.status === TrainingStatus.DONE && s.date
    && s.date >= from && s.date <= to && RUN_TYPES.has(s.training_type))
    .reduce((a, s) => a + (s.actual_distance_km || 0), 0);
}

export function buildTiles(plan, settings, day) {
  const now = day || today();
  const monday = weekStartOf(now);
  const tiles = [];
  const push = (title, value, sub, accent, key, progress) => tiles.push({
    title: title, value: value, sub: sub || '', accent: accent || 'text', key: key,
    progress: (progress === null || progress === undefined) ? null : progress,
  });

  const weeks = groupByWeek(plan).map((w) => w[0]);
  const index = weeks.indexOf(monday);
  const weekSess = weekSessions(plan, monday);
  const phase = (weekSess.find((s) => s.phase) || {}).phase || '';
  if (index >= 0) {
    push('Trainingswoche', 'Woche ' + (index + 1), 'von ' + weeks.length, 'accent', 'trainingswoche');
  }

  const prog = weekProgress(plan, monday);
  push('Wochenziel', prog[0] + ' / ' + prog[1], 'Einheiten erledigt',
    prog[1] && prog[0] >= prog[1] ? 'done' : 'accent', 'wochenziel');

  const kmWeek = kmInRange(plan, monday, addDays(monday, 6));
  const planned = countedWeekSessions(weekSess)
    .reduce((a, s) => a + (s.target_distance_km || 0), 0);
  push('km diese Woche', fmtKm(kmWeek),
    planned ? 'geplant ' + fmtKm(planned) : 'gelaufen', 'long_run', 'km_woche');

  if (phase) {
    const parts = phase.split(':');
    push('Aktuelle Phase', parts[0].replace('PHASE ', 'Phase '),
      (parts[1] || '').trim(), 'accent', 'phase');
  }

  const left = daysBetween(now, plan.target_date);
  push('Bis zum Marathon', left + '', left === 1 ? 'Tag' : 'Tage', 'accent', 'countdown');

  push('Zielzeit', fmtDuration(settings.target_time_min * 60),
    fmtPace(targetPaceSPerKm(settings)), 'text', 'zielzeit');

  const vdot = currentVdot(plan, settings, now);
  if (vdot) {
    push('Aktuelle Form', 'VDOT ' + vdot.vdot.toFixed(1), vdot.source, 'done', 'form_vdot');
  }

  const prog2 = predictMarathonAdjusted(plan, settings, now);
  if (prog2) {
    push('Marathon-Prognose', fmtDuration(prog2.minutes * 60),
      prog2.source + ' · Basis ' + Math.round(prog2.readiness * 100) + ' %',
      'accent', 'marathon_prognose');
  }

  const next = nextPlannedRun(plan, now);
  if (next) {
    const w = buildWorkout(next, plan, settings, now);
    const rec = recommendedPace(next, plan, settings, now);
    const when = next.date === now ? 'heute' : WEEKDAYS_SHORT[weekday(next.date)];
    const value = (w && w.pace_text) || (rec && rec[1]) || '–';
    push('Nächstes Tempo', value,
      ((w && w.summary) || next.training_type) + ' · ' + when, 'accent', 'naechstes_tempo');
  }

  push('km letzte 4 Wochen', fmtKm(kmInRange(plan, addDays(now, -27), now)),
    'gelaufen', 'long_run', 'km_4wochen');

  const longest = plan.sessions.filter((s) => s.status === TrainingStatus.DONE
    && s.actual_distance_km).sort((a, b) => b.actual_distance_km - a.actual_distance_km)[0];
  if (longest) {
    push('Längster Lauf', fmtKm(longest.actual_distance_km), fmtDateShort(longest.date),
      'long_run', 'longest_run');
  }

  const recent = doneRuns(plan, addDays(now, -27));
  if (recent.length) {
    const dist = recent.reduce((a, s) => a + (s.actual_distance_km || 0), 0);
    const dur = recent.reduce((a, s) => a + (s.actual_duration_s || 0), 0);
    if (dist) push('Ø Pace (4 Wochen)', fmtPace(dur / dist), recent.length + ' Läufe',
      'text', 'avg_pace');
  }

  const ready = readinessToday(plan, now);
  if (ready) push('Bereitschaft', ready.score + '', ready.note, ready.accent, 'readiness');

  const vo2 = vo2maxOf(settings);
  if (vo2) push('VO2max', vo2.toFixed(1), 'zuletzt gemessen', 'done', 'vo2max');

  const lt = lactateHr(settings);
  if (lt) {
    const ltp = lactatePace(settings);
    push('Laktatschwelle', lt + ' bpm', ltp ? fmtPace(ltp) : 'Puls', 'aerob_high', 'laktatschwelle');
  }

  const totalPlanned = plan.sessions.filter((s) => !s.archived)
    .reduce((a, s) => a + (s.target_distance_km || 0), 0);
  const totalDone = plan.sessions.filter((s) => s.status === TrainingStatus.DONE)
    .reduce((a, s) => a + (s.actual_distance_km || 0), 0);
  push('Gesamtumfang', fmtKm(totalDone), 'von ' + fmtKm(totalPlanned) + ' im Plan',
    'text', 'gesamtumfang', totalPlanned ? Math.min(1, totalDone / totalPlanned) : 0);

  const openWeek = countedWeekSessions(weekSess)
    .filter((s) => s.status === TrainingStatus.PENDING);
  const unplanned = openWeek.filter((s) => !s.date).length;
  if (!openWeek.length) {
    push('Noch offen', '0', 'Woche komplett – stark.', 'done', 'offen');
  } else {
    push('Noch offen', String(openWeek.length),
      unplanned ? unplanned + ' noch ohne Tag' : 'alle haben einen Tag',
      unplanned ? 'accent' : 'done', 'offen');
  }

  const longruns = plan.sessions.filter((s) => s.date && s.date >= now && !s.archived
    && s.training_type === TrainingType.LONG_RUN && s.status === TrainingStatus.PENDING)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  if (longruns.length) {
    const nx = longruns[0];
    const until = daysBetween(now, nx.date);
    const when = until === 0 ? 'heute' : until === 1 ? 'morgen' : 'in ' + until + ' Tagen';
    push('Nächster langer Lauf', fmtKm(nx.target_distance_km || 0),
      when + ' · ' + WEEKDAYS_SHORT[weekday(nx.date)] + ' ' + fmtDateShort(nx.date),
      'long_run', 'naechster_longrun');
  } else {
    const pooled = weekSess.find((s) => s.training_type === TrainingType.LONG_RUN
      && s.status === TrainingStatus.PENDING && !s.date);
    if (pooled) {
      push('Nächster langer Lauf', fmtKm(pooled.target_distance_km || 0),
        'noch kein Tag gewählt', 'accent', 'naechster_longrun');
    }
  }

  const lastMon = addDays(monday, -7);
  const prevMon = addDays(monday, -14);
  const lastKm = kmInRange(plan, lastMon, addDays(lastMon, 6));
  const doneIn = (m) => plan.sessions.filter((s) => s.status === TrainingStatus.DONE
    && s.date && s.date >= m && s.date <= addDays(m, 6)).length;
  const lastDone = doneIn(lastMon);
  if (lastKm || lastDone) {
    const dKm = lastKm - kmInRange(plan, prevMon, addDays(prevMon, 6));
    const dDone = lastDone - doneIn(prevMon);
    push('Vorwoche', fmtKm(lastKm),
      (dKm >= 0 ? '+' : '') + fmtKm(dKm) + ' · ' + (dDone >= 0 ? '+' : '') + dDone
        + ' Einheiten ggü. Vorwoche',
      dKm >= 0 ? 'done' : 'missed', 'wochenrueckblick');
  }

  let streak = 0;
  weeks.filter((w) => w < monday).sort().reverse().some((w) => {
    const sess = weekSessions(plan, w).filter((x) => x.training_type !== TrainingType.RACE);
    if (sess.length && sess.every((x) => x.status === TrainingStatus.DONE)) {
      streak += 1;
      return false;
    }
    return true;
  });
  push('Serie', String(streak), streak
    ? (streak === 1 ? 'Woche' : 'Wochen') + ' komplett in Folge'
    : 'Diese Woche startet die neue Serie', streak ? 'done' : 'accent', 'streak');

  [['Bestzeit ~5 km', 5.0, 'pr_5k'], ['Bestzeit ~10 km', 10.0, 'pr_10k'],
    ['Bestzeit ~21 km', 21.1, 'pr_21k']].forEach((r) => {
    const best = plan.sessions
      .filter((s) => s.status === TrainingStatus.DONE && !s.archived
        && RUN_TYPES.has(s.training_type) && s.actual_distance_km && s.actual_duration_s
        && s.actual_distance_km >= r[1] * 0.92 && s.actual_distance_km <= r[1] * 1.15)
      .sort((a, b) => actualPace(a) - actualPace(b))[0];
    if (best) {
      push(r[0], fmtDuration(best.actual_duration_s),
        fmtKm(best.actual_distance_km) + ' · ' + fmtPace(actualPace(best)), 'done', r[2]);
    }
  });

  const diaryAvg = (field, days) => {
    const since = addDays(now, -(days - 1));
    const vals = Object.keys(plan.diary || {})
      .filter((d) => d >= since && d <= now)
      .map((d) => plan.diary[d][field])
      .filter((v) => v !== null && v !== undefined && v !== '' && isFinite(Number(v)))
      .map(Number);
    return vals.length
      ? { avg: vals.reduce((a, b) => a + b, 0) / vals.length, n: vals.length }
      : null;
  };

  const sleep = diaryAvg('sleep_h', 7);
  if (sleep) {
    push('Schlaf (7 Tage)', (Math.round(sleep.avg * 10) / 10).toString().replace('.', ','),
      'h/Nacht · ' + sleep.n + (sleep.n === 1 ? ' Nacht' : ' Nächte'), 'accent', 'schlaf');
  }

  const bb = [now, addDays(now, -1)]
    .map((d) => ({ day: d, v: ((plan.diary || {})[d] || {}).body_battery }))
    .find((x) => x.v !== null && x.v !== undefined && x.v !== '');
  if (bb) {
    const v = Number(bb.v);
    push('Body Battery', String(Math.round(v)),
      bb.day === now ? 'heute früh' : 'gestern früh',
      v >= 70 ? 'done' : v >= 40 ? 'aerob_high' : 'missed', 'body_battery', v / 100);
  }

  const stress = diaryAvg('stress_avg', 7);
  if (stress) {
    const a = stress.avg;
    const level = a < 26 ? 'Ruhe' : a < 51 ? 'niedrig' : a < 76 ? 'mittel' : 'hoch';
    push('Stress (7 Tage)', String(Math.round(a)), level + ' · ' + stress.n + ' Tage',
      a < 51 ? 'done' : a < 76 ? 'aerob_high' : 'missed', 'stress');
  }

  const recent4 = doneRuns(plan, addDays(now, -27));
  const climbs = recent4.filter((s) => s.elevation_gain_m);
  if (climbs.length) {
    const hm = climbs.reduce((a, s) => a + s.elevation_gain_m, 0);
    const kmc = climbs.reduce((a, s) => a + (s.actual_distance_km || 0), 0);
    push('Höhenmeter (4 Wochen)', String(Math.round(hm)),
      (kmc ? Math.round(hm / kmc) + ' hm/km · ' : '') + climbs.length + ' Läufe',
      'accent', 'hoehenmeter');
  }
  const cadence = recent4.filter((s) => s.avg_cadence_spm);
  if (cadence.length) {
    const avgc = cadence.reduce((a, s) => a + s.avg_cadence_spm, 0) / cadence.length;
    const strides = cadence.filter((s) => s.avg_stride_length_cm);
    push('Ø Kadenz (4 Wochen)', String(Math.round(avgc)),
      strides.length
        ? 'Schritte/Min · ' + Math.round(strides.reduce((a, s) => a + s.avg_stride_length_cm, 0)
          / strides.length) + ' cm Schritt'
        : 'Schritte/Min · ' + cadence.length + ' Läufe',
      'accent', 'kadenz');
  }

  const g = settings.garmin || {};
  if (g.training_status) {
    push('Trainingszustand', g.training_status,
      g.training_load ? 'Belastung ' + g.training_load + ' · laut Garmin' : 'laut Garmin',
      'aerob_high', 'garmin_status');
  }
  if (g.readiness_score !== null && g.readiness_score !== undefined) {
    const sc = Number(g.readiness_score);
    push('Trainingsbereitschaft', String(sc), g.readiness_level || 'laut Garmin',
      sc >= 66 ? 'done' : sc >= 33 ? 'aerob_high' : 'missed', 'garmin_readiness', sc / 100);
  }
  if (g.race_5k_s || g.race_10k_s || g.race_half_s || g.race_marathon_s) {
    const parts = [];
    if (g.race_5k_s) parts.push('5k ' + fmtDuration(g.race_5k_s));
    if (g.race_10k_s) parts.push('10k ' + fmtDuration(g.race_10k_s));
    if (g.race_half_s) parts.push('HM ' + fmtDuration(g.race_half_s));
    push('Rennprognosen', g.race_marathon_s ? fmtDuration(g.race_marathon_s) : '–',
      parts.join(' · ') || 'laut Garmin', 'accent', 'garmin_rennprognose');
  }
  if (g.acwr !== null && g.acwr !== undefined) {
    const parts = [];
    if (g.load_acute !== null && g.load_acute !== undefined
      && g.load_chronic !== null && g.load_chronic !== undefined) {
      parts.push(g.load_acute + ' akut / ' + g.load_chronic + ' chronisch');
    }
    if (g.acwr_status) parts.push(g.acwr_status);
    const map = { Optimal: 'done', Hoch: 'aerob_high', 'Sehr hoch': 'missed', Niedrig: 'aerob_high' };
    push('Belastung akut/chronisch', Number(g.acwr).toFixed(2).replace('.', ','),
      parts.join(' · ') || 'laut Garmin', map[g.acwr_status] || 'accent', 'garmin_belastung');
  }
  const focus = [g.load_aerobic_low, g.load_aerobic_high, g.load_anaerobic];
  if (focus.some((v) => v !== null && v !== undefined)) {
    const names = ['locker', 'hoch', 'anaerob'];
    const parts = focus.map((v, i) => ((v === null || v === undefined) ? null
      : names[i] + ' ' + Math.round(v))).filter(Boolean);
    const feedback = g.load_balance_feedback || 'laut Garmin';
    push('Belastungsfokus', feedback, parts.join(' · '),
      feedback === 'Ausgeglichen' ? 'done' : 'aerob_high', 'garmin_fokus');
  }
  if (g.pr_5k_s || g.pr_10k_s || g.pr_half_s || g.pr_marathon_s) {
    const head = [[g.pr_marathon_s, 'Marathon'], [g.pr_half_s, 'Halbmarathon'],
      [g.pr_10k_s, '10 km'], [g.pr_5k_s, '5 km']].find((r) => r[0]);
    const parts = [[g.pr_5k_s, '5k'], [g.pr_10k_s, '10k'], [g.pr_half_s, 'HM'],
      [g.pr_marathon_s, 'M']].filter((r) => r[0]).map((r) => r[1] + ' ' + fmtDuration(r[0]));
    push('Bestzeiten (Garmin)', fmtDuration(head[0]),
      head[1] + (parts.length ? ' · ' + parts.join(' · ') : ''), 'accent', 'garmin_bestzeiten');
  }
  const shoes = (g.shoes || []).filter((sh) => sh && sh.name);
  if (shoes.length) {
    const worst = shoes.slice().sort((a, b) => shoeWear(b) - shoeWear(a))[0];
    const share = shoeWear(worst);
    const limit = worst.max_km || 0;
    const km = worst.km || 0;
    let sub;
    if (share >= 1) sub = worst.name + ' · Grenze erreicht';
    else if (share >= 0.8) sub = worst.name + ' · noch ' + Math.round(Math.max(0, limit - km)) + ' km';
    else sub = worst.name + ' · von ' + Math.round(limit) + ' km';
    if (shoes.length > 1) sub += ' · ' + shoes.length + ' Paare';
    push('Laufschuhe', Math.round(km) + ' km', sub,
      share >= 1 ? 'missed' : share >= 0.8 ? 'aerob_high' : 'done', 'schuhe',
      Math.min(1, share));
  }

  return tiles;
}

export const DEFAULT_PHONE_TILES = ['trainingswoche', 'wochenziel', 'km_woche', 'offen',
  'naechster_longrun', 'naechstes_tempo', 'form_vdot', 'marathon_prognose',
  'readiness', 'countdown', 'zielzeit', 'gesamtumfang'];

export function visibleTiles(plan, settings, day) {
  const all = buildTiles(plan, settings, day);
  const wanted = (settings.phone_tiles && settings.phone_tiles.length)
    ? settings.phone_tiles : DEFAULT_PHONE_TILES;
  const byKey = {};
  all.forEach((t) => { byKey[t.key] = t; });
  return wanted.map((k) => byKey[k]).filter(Boolean);
}

export function nextPlannedRun(plan, day) {
  const now = day || today();
  return plan.sessions
    .filter((s) => s.status === TrainingStatus.PENDING && s.date && s.date >= now
      && RUN_TYPES.has(s.training_type) && s.training_type !== TrainingType.RACE && !s.archived)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))[0] || null;
}


const KEY_PLAN = 'marathonplaner.plan';
const KEY_SETTINGS = 'marathonplaner.settings';

export function loadPlan() {
  try {
    const raw = localStorage.getItem(KEY_PLAN);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.sessions)) return null;
    data.sessions = data.sessions.map((s) => makeSession(s));
    data.diary = normalizeDiary(data.diary || {});
    data.deleted = data.deleted || {};
    return data;
  } catch (e) {
    return null;
  }
}

export function savePlan(plan) {
  try {
    localStorage.setItem(KEY_PLAN, JSON.stringify(plan));
    return true;
  } catch (e) {
    return false;
  }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY_SETTINGS);
    if (!raw) return defaultSettings();
    return Object.assign(defaultSettings(), JSON.parse(raw));
  } catch (e) {
    return defaultSettings();
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    return false;
  }
}

export function exportAll(plan, settings) {
  return JSON.stringify({ plan: plan, settings: settings, exported: today() }, null, 1);
}

export function importAll(text) {
  const data = JSON.parse(text);
  const plan = data.plan || (Array.isArray(data.sessions) ? data : null);
  if (!plan || !Array.isArray(plan.sessions)) throw new Error('Keine Einheiten in der Datei.');
  plan.sessions = plan.sessions.map((s) => makeSession(s));
  plan.diary = normalizeDiary(plan.diary || {});
  plan.deleted = plan.deleted || {};
  const settings = Object.assign(defaultSettings(), data.settings || {});
  return { plan: plan, settings: settings };
}


const GIST_API = 'https://api.github.com/gists';
const GIST_FILENAME = 'marathon-planer.json';
const GIST_DESCRIPTION = 'Marathon Planer – Abgleich Desktop/iPhone (privat)';
export const SYNC_FORMAT = 1;
export const TOMBSTONE_KEEP_DAYS = 120;

const SECRET_SETTING_KEYS = ['garmin_email', 'garmin_password_enc', 'gemini_api_key',
  'github_token', 'sync_token', 'sync_gist_id'];

const DEVICE_SETTING_KEYS = ['phone_tiles', 'phone_theme'];

export class SyncError extends Error {}

function syncHeaders(token) {
  return {
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

async function checkResponse(resp, what) {
  if (resp.status === 401 || resp.status === 403) {
    throw new SyncError('GitHub hat den Token abgelehnt. Braucht er das Recht '
      + '"gist"? (github.com/settings/tokens)');
  }
  if (resp.status === 404) {
    throw new SyncError('Die Ablage wurde nicht gefunden. Wurde der Gist gelöscht, '
      + 'oder gehört der Token zu einem anderen Konto?');
  }
  if (!resp.ok) throw new SyncError(what + ' fehlgeschlagen (HTTP ' + resp.status + ').');
  return resp;
}

export async function findGist(token) {
  const resp = await fetch(GIST_API + '?per_page=100', { headers: syncHeaders(token) });
  await checkResponse(resp, 'Suchen der Ablage');
  const list = await resp.json();
  const hit = (list || []).find((g) => g.files && g.files[GIST_FILENAME]);
  return hit ? hit.id : null;
}

export async function createGist(token, document) {
  const resp = await fetch(GIST_API, {
    method: 'POST',
    headers: syncHeaders(token),
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      public: false,
      files: { [GIST_FILENAME]: { content: JSON.stringify(document) } },
    }),
  });
  await checkResponse(resp, 'Anlegen der Ablage');
  const data = await resp.json();
  if (!data.id) throw new SyncError('GitHub hat keine Gist-ID zurückgegeben.');
  return data.id;
}

export async function readGist(token, gistId) {
  const resp = await fetch(GIST_API + '/' + gistId, { headers: syncHeaders(token) });
  await checkResponse(resp, 'Lesen der Ablage');
  const data = await resp.json();
  const entry = ((data || {}).files || {})[GIST_FILENAME];
  if (!entry) return null;
  let content = entry.content;
  if (entry.truncated && entry.raw_url) {
    const raw = await fetch(entry.raw_url, { headers: syncHeaders(token) });
    await checkResponse(raw, 'Lesen des Ablage-Inhalts');
    content = await raw.text();
  }
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new SyncError('Die abgelegte Datei ist beschädigt.');
  }
}

export async function writeGist(token, gistId, document) {
  const resp = await fetch(GIST_API + '/' + gistId, {
    method: 'PATCH',
    headers: syncHeaders(token),
    body: JSON.stringify({
      files: { [GIST_FILENAME]: { content: JSON.stringify(document) } },
    }),
  });
  await checkResponse(resp, 'Schreiben in die Ablage');
}

export function publicSettings(settings) {
  const out = Object.assign({}, settings);
  SECRET_SETTING_KEYS.forEach((k) => { delete out[k]; });
  DEVICE_SETTING_KEYS.forEach((k) => { delete out[k]; });
  return out;
}

export function buildDocument(plan, settings, device) {
  return {
    format: SYNC_FORMAT,
    updated: nowStamp(),
    device: device || 'iphone',
    plan: plan,
    settings: publicSettings(settings),
  };
}


function stampOf(value) { return value || ''; }

export function carriesTraining(s) {
  if (s.status === TrainingStatus.DONE || s.custom_added || s.archived) return true;
  if ((s.notes || '').trim() || s.custom_workout) return true;
  return !!(s.actual_distance_km || s.actual_duration_s || s.actual_avg_hr
    || s.actual_max_hr || s.aerobic_benefit || s.anaerobic_benefit
    || s.perceived_effort || s.felt || s.garmin_activity_id
    || (s.splits && s.splits.length) || (s.exercise_sets && s.exercise_sets.length)
    || (s.zone_minutes && Object.keys(s.zone_minutes).length));
}

export function mergeSessions(local, remote, deleted, sameLineage) {
  const merged = new Map();
  local.forEach((s) => merged.set(s.id, s));
  remote.forEach((s) => {
    const current = merged.get(s.id);
    if (!current) { if (sameLineage || carriesTraining(s)) merged.set(s.id, s); }
    else if (stampOf(s.updated_at) > stampOf(current.updated_at)) merged.set(s.id, s);
  });
  const out = [];
  merged.forEach((s) => {
    const gone = (deleted || {})[s.id];
    if (gone && gone >= stampOf(s.updated_at)) return;
    out.push(s);
  });
  return out;
}

const DIARY_SKIP_KEYS = ['date', 'updated_at'];

export function mergeDiary(local, remote) {
  const out = Object.assign({}, local || {});
  Object.keys(remote || {}).forEach((day) => {
    const entry = remote[day];
    const current = out[day];
    if (!current) { out[day] = entry; return; }
    const here = stampOf(current.updated_at);
    const there = stampOf(entry.updated_at);
    if (there > here) out[day] = entry;
    else if (there === here) {
      const merged = Object.assign({}, current);
      Object.keys(entry).forEach((k) => {
        if (DIARY_SKIP_KEYS.indexOf(k) !== -1) return;
        if (merged[k] === null || merged[k] === undefined || merged[k] === '') {
          merged[k] = entry[k];
        }
      });
      out[day] = merged;
    }
  });
  return out;
}

export function pruneTombstones(deleted, day) {
  const cutoff = addDays(day || today(), -TOMBSTONE_KEEP_DAYS);
  const out = {};
  Object.keys(deleted || {}).forEach((k) => {
    if (deleted[k] >= cutoff) out[k] = deleted[k];
  });
  return out;
}

export function sharesLineage(local, remote) {
  const ids = new Set((local.sessions || []).map((s) => s.id));
  return (remote.sessions || []).some((s) => ids.has(s.id));
}

export function historyWeight(plan) {
  const recorded = (plan.sessions || []).filter((s) => s.status === TrainingStatus.DONE
    || s.archived || s.custom_added).length;
  return recorded + Object.keys(plan.diary || {}).length;
}

export function mergePlans(local, remote) {
  const deleted = pruneTombstones(Object.assign({}, remote.deleted || {}, local.deleted || {}));
  const lineage = sharesLineage(local, remote);
  local.sessions = mergeSessions(local.sessions, remote.sessions || [], deleted, lineage);
  local.diary = mergeDiary(normalizeDiary(local.diary), normalizeDiary(remote.diary || {}));
  local.deleted = deleted;
  return local;
}

export function mergeSettings(local, remoteData) {
  const byDate = (entries) => {
    const seen = {};
    (entries || []).forEach((e) => { if (e && e.date) seen[e.date] = e; });
    return seen;
  };
  const vo2 = Object.assign(byDate(remoteData.vo2max_history), byDate(local.vo2max_history));
  local.vo2max_history = Object.keys(vo2).sort().map((k) => vo2[k]);
  const lt = Object.assign(byDate(remoteData.lactate_history), byDate(local.lactate_history));
  local.lactate_history = Object.keys(lt).sort().map((k) => lt[k]);

  const remoteStamp = String(remoteData.zones_updated || '');
  const remoteZones = remoteData.zones || [];
  if (remoteStamp > String(local.zones_updated || '') && remoteZones.length === 5) {
    local.zones = remoteZones.map((z) => Object.assign({}, z));
    local.zones_updated = remoteStamp;
  }
  return local;
}


export function hasSyncCredentials(settings) {
  return !!(settings && settings.sync_token);
}

export async function pushOnly(plan, settings, device) {
  const token = (settings.sync_token || '').trim();
  if (!token) throw new SyncError('Kein Token hinterlegt.');
  if (!settings.sync_gist_id) {
    const found = await findGist(token);
    settings.sync_gist_id = found
      || await createGist(token, buildDocument(plan, settings, device));
    if (!found) {
      settings.sync_last = nowStamp();
      return 'Ablage angelegt · ' + plan.sessions.length + ' Einheiten';
    }
  }
  await writeGist(token, settings.sync_gist_id, buildDocument(plan, settings, device));
  settings.sync_last = nowStamp();
  return 'Ablage überschrieben · ' + plan.sessions.length + ' Einheiten hochgeladen';
}

export async function runSync(plan, settings, device) {
  const token = (settings.sync_token || '').trim();
  if (!token) throw new SyncError('Kein Token hinterlegt.');

  if (!settings.sync_gist_id) {
    const found = await findGist(token);
    if (found) settings.sync_gist_id = found;
    else {
      settings.sync_gist_id = await createGist(token, buildDocument(plan, settings, device));
      settings.sync_last = nowStamp();
      return 'Ablage angelegt · ' + plan.sessions.length + ' Einheiten hochgeladen';
    }
  }

  const doc = await readGist(token, settings.sync_gist_id);
  if (!doc) {
    await writeGist(token, settings.sync_gist_id, buildDocument(plan, settings, device));
    settings.sync_last = nowStamp();
    return 'Ablage war leer · ' + plan.sessions.length + ' Einheiten hochgeladen';
  }

  const remotePlan = doc.plan || {};
  if (remotePlan.version !== DATA.PLAN_VERSION) {
    throw new SyncError('Die Ablage enthält Plan-Version ' + remotePlan.version
      + ', diese App spricht ' + DATA.PLAN_VERSION + '. Bitte zuerst beide Geräte '
      + 'auf denselben Stand bringen.');
  }
  if (!Array.isArray(remotePlan.sessions)) {
    throw new SyncError('Die Ablage enthält keinen lesbaren Plan.');
  }
  remotePlan.sessions = remotePlan.sessions.map((s) => makeSession(s));
  remotePlan.diary = remotePlan.diary || {};
  remotePlan.deleted = remotePlan.deleted || {};

  if (remotePlan.sessions.length && !sharesLineage(plan, remotePlan)) {
    const here = historyWeight(plan);
    const there = historyWeight(remotePlan);
    if (here && there) {
      throw new SyncError('Auf beiden Geräten steht ein eigener Plan, und auf beiden '
        + 'hängt erfasstes Training daran. Zusammenführen würde jede Einheit '
        + 'verdoppeln. Bitte auf einem Gerät den Plan verwerfen und dort neu '
        + 'abgleichen – oder ihn vorher exportieren.');
    }
    if (there > here) {
      plan.start_date = remotePlan.start_date;
      plan.target_date = remotePlan.target_date;
      plan.version = remotePlan.version;
      plan.sessions = remotePlan.sessions;
      plan.diary = remotePlan.diary;
      plan.deleted = pruneTombstones(remotePlan.deleted);
      mergeSettings(settings, doc.settings || {});
      await writeGist(token, settings.sync_gist_id, buildDocument(plan, settings, device));
      settings.sync_last = nowStamp();
      return 'Plan vom ' + (doc.device || 'anderen Gerät') + ' übernommen · '
        + plan.sessions.length + ' Einheiten';
    }
    mergeSettings(settings, doc.settings || {});
    await writeGist(token, settings.sync_gist_id, buildDocument(plan, settings, device));
    settings.sync_last = nowStamp();
    return 'Fremder Plan in der Ablage ersetzt · ' + plan.sessions.length
      + ' Einheiten hochgeladen';
  }

  const before = plan.sessions.length;
  mergePlans(plan, remotePlan);
  mergeSettings(settings, doc.settings || {});

  await writeGist(token, settings.sync_gist_id, buildDocument(plan, settings, device));
  settings.sync_last = nowStamp();

  const added = plan.sessions.length - before;
  const other = doc.device || '?';
  if (added > 0) return 'Abgeglichen · ' + added + ' Einheiten vom ' + other + ' übernommen';
  return 'Abgeglichen · ' + plan.sessions.length + ' Einheiten, nichts Neues vom ' + other;
}


let PLAN = null;
let SETTINGS = null;
let VIEW = 'heute';
let BOARD_MONDAY = null;
let EXPANDED = {};

function el(tag, attrs, children) {
  const node = document.createElement(tag);
  Object.keys(attrs || {}).forEach((k) => {
    if (k === 'style' && attrs[k]) node.setAttribute('style', themed(attrs[k]));
    else if (k === 'class') node.className = attrs[k];
    else if (k === 'text') node.textContent = attrs[k];
    else if (k === 'html') node.innerHTML = attrs[k];
    else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
  });
  (children || []).forEach((c) => {
    if (c === null || c === undefined || c === false) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

function $(sel) { return document.querySelector(sel); }

function typeColor(type) { return DATA.TYPE_COLOR[type] || '#94a3b8'; }
function typeIcon(type) { return DATA.TYPE_ICON[type] || '•'; }

function persist() { savePlan(PLAN); saveSettings(SETTINGS); }

function haptic() {
  if (navigator.vibrate) navigator.vibrate(8);
}


function card(children, cls) {
  return el('div', { class: 'glass card ' + (cls || '') }, children);
}

function sectionTitle(text, action) {
  return el('div', { class: 'section-head' }, [
    el('h2', { text: text }),
    action || null,
  ]);
}

function tileEl(t) {
  const accent = DATA.PALETTE.ACCENT;
  const colors = {
    accent: accent, done: DATA.STATUS_COLOR['erledigt'],
    missed: DATA.STATUS_COLOR['keine Zeit'], long_run: DATA.TYPE_COLOR['Langer Lauf'],
    aerob_high: '#fb923c', text: DATA.PALETTE.TEXT,
  };
  const color = colors[t.accent] || colors.text;
  return el('div', { class: 'glass tile' }, [
    el('div', { class: 'tile-title', text: t.title }),
    el('div', { class: 'tile-value', text: t.value, style: 'color:' + color }),
    el('div', { class: 'tile-sub', text: t.sub }),
    (t.progress === null || t.progress === undefined) ? null
      : el('div', { class: 'tile-bar' }, [
        el('span', { style: 'width:' + Math.round(Math.max(0, Math.min(1, t.progress)) * 100)
          + '%;background:' + color }),
      ]),
  ]);
}

function sessionCard(s, opts) {
  const options = opts || {};
  const body = (planText(s, PLAN, SETTINGS, null, false) || '').split('\n')
    .filter((line) => !/^Z[1-5]$/.test(line.trim())).join('\n');
  const hint = paceHint(s, PLAN, SETTINGS, null);
  const done = s.status === TrainingStatus.DONE;
  const missed = s.status === TrainingStatus.MISSED;
  const meta = [];
  if (s.target_distance_km) meta.push(fmtKm(s.target_distance_km));
  if (s.target_duration_min) meta.push(s.target_duration_min + ' Min.');
  if (s.hr_zone && s.hr_zone !== Zone.NONE) meta.push(s.hr_zone);
  if (done) {
    if (s.actual_distance_km) meta.push('→ ' + fmtKm(s.actual_distance_km));
    else if (s.actual_duration_s) meta.push('→ ' + fmtDuration(s.actual_duration_s));
    else if (s.exercise_sets && s.exercise_sets.length) {
      meta.push('→ ' + s.exercise_sets.length + ' Übungen');
    }
  }

  return el('div', {
    class: 'glass session tap' + (done ? ' is-done' : '') + (missed ? ' is-missed' : ''),
    style: '--type:' + typeColor(s.training_type),
    onclick: () => openSessionSheet(s.id),
  }, [
    el('div', { class: 'session-bar' }),
    el('div', { class: 'session-main' }, [
      el('div', { class: 'session-head' }, [
        null,
        el('span', { class: 'session-type', text: s.training_type }),
        options.day && s.date ? el('span', { class: 'session-day', text: WEEKDAYS_SHORT[weekday(s.date)] }) : null,
        el('span', { class: 'session-flag', text: done ? '✓' : missed ? '!' : '' }),
      ]),
      meta.length ? el('div', { class: 'session-meta', text: meta.join(' · ') }) : null,
      body ? el('div', { class: 'session-body', text: body }) : null,
      hint ? el('div', { class: 'session-hint', text: hint }) : null,
    ]),
  ]);
}


function segmented(items, active, onPick) {
  const index = Math.max(0, items.findIndex((it) => it.key === active));
  const bar = el('div', {
    class: 'segmented', role: 'tablist',
    style: '--n:' + items.length + ';--i:' + index,
  }, [el('span', { class: 'segmented-thumb' })].concat(items.map((it, i) => el('button', {
    class: 'segment' + (i === index ? ' active' : ''),
    type: 'button', role: 'tab', 'aria-selected': i === index ? 'true' : 'false',
    onclick: () => {
      if (i === index) return;
      haptic();
      bar.style.setProperty('--i', String(i));
      onPick(it.key);
    },
  }, [document.createTextNode(it.label)]))));
  return bar;
}

function stepper(value, min, max, label, captions) {
  let current = (value === null || value === undefined || value === '') ? null : Number(value);
  const caption = el('span', { class: 'stepper-caption' });
  const buttons = [];

  function paint() {
    buttons.forEach((b) => b.classList.toggle('active', b._v === current));
    const i = current === null ? -1 : current - min;
    caption.textContent = (current === null) ? 'nicht erfasst'
      : (captions && captions[i]) ? current + ' · ' + captions[i] : String(current);
  }

  const none = el('button', {
    class: 'step-btn step-none tap', type: 'button', text: '–',
    'aria-label': label + ': nicht erfasst',
    onclick: () => { current = null; haptic(); paint(); },
  });
  none._v = null;
  buttons.push(none);

  for (let v = min; v <= max; v += 1) {
    const b = el('button', {
      class: 'step-btn tap', type: 'button', text: String(v),
      'aria-label': label + ' ' + v,
      onclick: () => { current = b._v; haptic(); paint(); },
    });
    b._v = v;
    buttons.push(b);
  }
  paint();

  return {
    node: el('div', { class: 'stepper' }, [
      el('div', { class: 'stepper-head' }, [
        el('span', { class: 'field-label', text: label }),
        caption,
      ]),
      el('div', { class: 'stepper-row' }, buttons),
    ]),
    value: () => current,
  };
}

const SWIPE_MIN = 56;
const SWIPE_EXCLUDE = 'input,textarea,select,.chart-plot,.no-swipe';

function onSwipe(node, handler) {
  if (!node) return;
  let x0 = 0;
  let y0 = 0;
  let t0 = 0;
  let armed = false;
  node.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) { armed = false; return; }
    if (e.target.closest && e.target.closest(SWIPE_EXCLUDE)) { armed = false; return; }
    armed = true;
    x0 = e.touches[0].clientX;
    y0 = e.touches[0].clientY;
    t0 = Date.now();
  }, { passive: true });
  node.addEventListener('touchend', (e) => {
    if (!armed) return;
    armed = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - x0;
    const dy = t.clientY - y0;
    if (Date.now() - t0 > 700) return;
    if (Math.abs(dx) < SWIPE_MIN) return;
    if (Math.abs(dx) < Math.abs(dy) * 1.6) return;
    haptic();
    handler(dx > 0 ? 1 : -1);
  }, { passive: true });
}

function formError() {
  return el('div', { class: 'form-error', role: 'alert' });
}

let sheetEl = null;
let sheetFill = null;

function openSheet(title, buildBody) {
  closeSheet();
  const body = el('div', { class: 'sheet-body' }, []);
  const sheet = el('div', { class: 'sheet glass-strong' }, [
    el('div', { class: 'sheet-grip' }),
    el('div', { class: 'sheet-head' }, [
      el('h2', { text: title }),
      el('button', { class: 'icon-btn tap', text: '✕', onclick: closeSheet, 'aria-label': 'Schliessen' }),
    ]),
    body,
  ]);
  const back = el('div', { class: 'backdrop', onclick: closeSheet });
  sheetEl = el('div', { class: 'sheet-wrap' }, [back, sheet]);
  sheetFill = buildBody;
  document.body.appendChild(sheetEl);
  withMemo(() => buildBody(body));
  requestAnimationFrame(() => sheetEl.classList.add('open'));
  return body;
}

function refreshSheet(title) {
  if (!sheetEl || !sheetFill) return false;
  const sheet = sheetEl.querySelector('.sheet');
  const body = sheetEl.querySelector('.sheet-body');
  if (!sheet || !body) return false;
  const top = body.scrollTop;
  const before = sheet.getBoundingClientRect().height;

  if (title !== undefined && title !== null) {
    const head = sheetEl.querySelector('.sheet-head h2');
    if (head) head.textContent = title;
  }

  sheet.style.height = before + 'px';
  body.classList.add('swapping');
  body.textContent = '';
  withMemo(() => sheetFill(body));
  body.scrollTop = top;

  requestAnimationFrame(() => {
    if (!sheetEl) return;
    const after = sheet.scrollHeight;
    sheet.style.height = Math.min(after, window.innerHeight * 0.92) + 'px';
    body.classList.remove('swapping');
    setTimeout(() => {
      if (sheet.isConnected) sheet.style.height = '';
    }, 260);
  });
  return true;
}

function closeSheet() {
  if (!sheetEl) return;
  const node = sheetEl;
  sheetEl = null;
  sheetFill = null;
  node.classList.remove('open');
  setTimeout(() => node.remove(), 260);
}

function row(label, control) {
  return el('label', { class: 'field' }, [
    el('span', { class: 'field-label', text: label }),
    control,
  ]);
}

function input(type, value, attrs) {
  return el('input', Object.assign({
    type: type, value: value === null || value === undefined ? '' : String(value),
  }, attrs || {}));
}

function select(options, value, onChange) {
  const s = el('select', { onchange: (e) => onChange(e.target.value) },
    options.map((o) => el('option', { value: o, text: o, selected: o === value ? 'selected' : null })));
  return s;
}

function actionButton(text, onClick, kind) {
  return el('button', {
    class: 'btn tap ' + (kind || ''), text: text,
    onclick: () => { haptic(); onClick(); },
  });
}

function num(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? null : n;
}

function parseSeconds(text) {
  const t = String(text || '').trim();
  if (!t) return null;
  const parts = t.split(':').map((x) => parseInt(x, 10));
  if (parts.some(isNaN)) return null;
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function fmtSeconds(seconds) {
  if (seconds === null || seconds === undefined || seconds === '') return '';
  const v = Math.round(Number(seconds));
  if (v < 60) return String(v);
  return Math.floor(v / 60) + ':' + String(v % 60).padStart(2, '0');
}

function parseDuration(text) {
  const t = String(text || '').trim();
  if (!t) return null;
  const parts = t.split(':').map((p) => parseInt(p, 10));
  if (parts.some(isNaN)) return null;
  if (parts.length === 1) return parts[0] * 60;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}


function openSessionSheet(id, again) {
  const initial = sessionById(PLAN, id);
  if (!initial) { closeSheet(); return; }
  if (!again) haptic();
  const headingOf = (x) => (x.date
    ? WEEKDAYS_DE[weekday(x.date)] + ', ' + fmtDateShort(x.date)
    : 'Noch ohne Tag');

  const fill = (body) => {
    const s = sessionById(PLAN, id);
    if (!s) { closeSheet(); return; }
    const isRace = s.training_type === TrainingType.RACE;

    body.appendChild(el('div', { class: 'sheet-chip-row' }, [
      isRace
        ? el('span', { class: 'chip', style: 'background:' + typeColor(s.training_type), text: s.training_type })
        : (() => {
          const sel = select(RETYPE_TYPES, s.training_type, (v) => {
            try {
              retypeSession(PLAN, s.id, v);
              persist(); render(); openSessionSheet(s.id, true);
            } catch (e) { alert(e.message); }
          });
          sel.className = 'chip-select';
          sel.style.backgroundColor = typeColor(s.training_type);
          return sel;
        })(),
      el('span', { class: 'chip ghost', text: s.date ? fmtDate(s.date) : 'im Pool' }),
      el('span', { class: 'chip ghost', text: s.status }),
    ]));

    const doneText = s.status === TrainingStatus.DONE ? actualWorkoutText(s) : null;
    if (doneText) {
      body.appendChild(card([
        el('div', { class: 'card-title', text: 'So gemacht' }),
        el('pre', { class: 'plan-text', text: doneText }),
      ], 'accent-done'));
    }

    if (isWorkoutSession(s)) {
      const generated = (() => {
        const w = buildWorkout(s, PLAN, SETTINGS, null);
        if (!w) return null;
        return [w.label + (w.pace_text ? ' · ' + w.pace_text : '')].concat(w.lines).join('\n');
      })();
      const box = el('textarea', { rows: '7', class: 'plan-edit', spellcheck: 'false' });
      box.value = workoutText(s, PLAN, SETTINGS, null) || s.description || '';
      const state = el('div', { class: 'muted small', text: s.custom_workout
        ? 'Eigene Fassung – das Tempo bleibt so stehen, wie es hier steht.'
        : 'Erzeugt aus der Vorgabe des Plans. Das Tempo folgt deiner Form.' });
      body.appendChild(card([
        el('div', { class: 'card-title', text: 'Geplant' }),
        box,
        state,
        el('div', { class: 'btn-row wide' }, [
          s.custom_workout ? actionButton('Zurück zur Vorgabe', () => {
            s.custom_workout = null;
            touch(s); persist(); render(); openSessionSheet(s.id, true);
          }, 'ghost') : null,
          actionButton('Workout speichern', () => {
            const v = box.value.trim();
            const same = !v || v === (generated || '').trim()
              || v === (s.description || '').trim();
            s.custom_workout = same ? null : v;
            touch(s); persist(); haptic(); render(); openSessionSheet(s.id, true);
          }, 'ghost'),
        ]),
      ]));
    } else {
      const text = planText(s, PLAN, SETTINGS, null, true);
      if (text && text !== doneText) {
        body.appendChild(card([
          el('div', { class: 'card-title', text: 'Geplant' }),
          el('pre', { class: 'plan-text', text: text }),
        ]));
      }
    }

    const rec = recommendedPace(s, PLAN, SETTINGS);
    const shoe = shoeFor(s, SETTINGS);
    if (rec || shoe) {
      body.appendChild(card([
        el('div', { class: 'card-title', text: rec && shoe ? 'Tempo & Schuh' : rec ? 'Tempo' : 'Schuh' }),
        rec ? el('div', { class: 'kv' }, [
          el('span', { text: rec[0] }), el('strong', { text: rec[1] }),
          el('span', { class: 'muted', text: rec[2] }),
        ]) : null,
        shoe ? el('div', { class: 'kv' }, [
          el('span', { text: 'Schuh' }), el('strong', { text: shoe[0] }),
          el('span', { class: 'muted', text: shoe[1] }),
        ]) : null,
      ]));
    }

    const fuel = fuelingFor(s, PLAN, SETTINGS);
    if (fuel) {
      const lines = [];
      [['Vorher', fuel.before], ['Während', fuel.during], ['Nachher', fuel.after]].forEach((g) => {
        if (!g[1].length) return;
        lines.push(el('div', { class: 'fuel-group', text: g[0] }));
        g[1].forEach((r) => lines.push(el('div', { class: 'kv' }, [
          el('span', { text: r[0] }), el('span', { class: 'fuel-val', text: r[1] }),
        ])));
      });
      if (fuel.hint) lines.push(el('div', { class: 'note', text: fuel.hint }));
      lines.push(el('div', { class: 'muted small', text: weightSourceText(PLAN) }));
      body.appendChild(card([el('div', { class: 'card-title', text: 'Verpflegung' })].concat(lines)));
    }

    if (isRace) {
      body.appendChild(raceStationCard(SETTINGS));
      return;   // Sonst ist der Renntag reine Leseansicht.
    }

    const monday = weekStartOf(s.date || s.week_start);
    const dayRow = el('div', { class: 'day-picker' }, daysOfWeek(monday).map((d) => el('button', {
      class: 'day-pill tap' + (d === s.date ? ' active' : ''),
      onclick: () => {
        try { assignSession(PLAN, s.id, d); persist(); haptic(); render(); openSessionSheet(s.id, true); }
        catch (e) { alert(e.message); }
      },
    }, [
      el('span', { class: 'day-pill-wd', text: WEEKDAYS_SHORT[weekday(d)] }),
      el('span', { class: 'day-pill-n', text: String(dt(d).getDate()) }),
    ])));
    body.appendChild(card([
      el('div', { class: 'card-title', text: 'Tag' }),
      dayRow,
      el('div', { class: 'btn-row' }, [
        actionButton('In den Pool', () => {
          unassignSession(PLAN, s.id); persist(); render(); closeSheet();
        }, 'ghost'),
        actionButton('◀︎ Woche', () => {
          const prev = addDays(monday, -7);
          try { assignSession(PLAN, s.id, addDays(prev, weekday(s.date || monday))); persist(); render(); openSessionSheet(s.id, true); }
          catch (e) { alert(e.message); }
        }, 'ghost'),
        actionButton('Woche ▶︎', () => {
          const next = addDays(monday, 7);
          try { assignSession(PLAN, s.id, addDays(next, weekday(s.date || monday))); persist(); render(); openSessionSheet(s.id, true); }
          catch (e) { alert(e.message); }
        }, 'ghost'),
      ]),
    ]));

    recordCard(s).forEach((n) => body.appendChild(n));

    const notes = el('textarea', { rows: '3', placeholder: 'Eigene Notiz …' });
    notes.value = s.notes || '';
    body.appendChild(card([
      el('div', { class: 'card-title', text: 'Notiz' }),
      notes,
      actionButton('Notiz speichern', () => {
        s.notes = notes.value;
        touch(s); persist(); render(); openSessionSheet(s.id, true);
      }, 'ghost'),
    ]));

    body.appendChild(el('div', { class: 'btn-row wide' }, [
      s.status === TrainingStatus.DONE
        ? actionButton('↩ Nicht erledigt', () => {
          markUndone(PLAN, s.id); persist(); render(); openSessionSheet(s.id, true);
        }, 'ghost')
        : actionButton('Keine Zeit', () => {
          skipSession(PLAN, s.id); persist(); render(); closeSheet();
        }, 'ghost'),
      s.custom_added
        ? actionButton('Löschen', () => {
          if (!confirm('Diese selbst hinzugefügte Einheit löschen?')) return;
          deleteSession(PLAN, s.id); persist(); render(); closeSheet();
        }, 'danger')
        : actionButton('Archivieren', () => {
          if (!confirm('Einheit archivieren? Sie bleibt in der Statistik als geplant und nicht gelaufen.')) return;
          archiveSession(PLAN, s.id); persist(); render(); closeSheet();
        }, 'danger'),
    ]));
  };

  if (again && refreshSheet(headingOf(initial))) return;
  openSheet(headingOf(initial), fill);
}


function disclosure(title, summaryOf, build) {
  let open = false;
  const sum = el('span', { class: 'disc-sum' });
  const chev = el('span', { class: 'chev', text: '▸' });
  const bodyEl = el('div', { class: 'disc-body' });
  const head = el('button', {
    class: 'disc-head tap', type: 'button',
    onclick: () => {
      open = !open;
      chev.textContent = open ? '▾' : '▸';
      bodyEl.classList.toggle('open', open);
      haptic();
    },
  }, [el('span', { class: 'disc-title', text: title }), sum, chev]);
  build(bodyEl);
  function refresh() { sum.textContent = summaryOf(); }
  refresh();
  return { node: el('div', { class: 'disclosure' }, [head, bodyEl]), refresh: refresh };
}

function zoneMinutesEditor(session) {
  const current = session.zone_minutes || {};
  const inputs = (SETTINGS.zones || []).map((z) => ({
    zone: z,
    field: input('text', current[z.zone] === undefined ? '' : current[z.zone],
      { inputmode: 'decimal', placeholder: 'Min.' }),
  }));

  function value() {
    const out = {};
    inputs.forEach((zi) => {
      const v = num(zi.field.value);
      if (v !== null && v > 0) out[zi.zone.zone] = v;
    });
    return out;
  }

  const disc = disclosure('Zeit je Zone', () => {
    const filled = Object.keys(value());
    if (!filled.length) return 'nicht erfasst';
    const total = filled.reduce((a, k) => a + value()[k], 0);
    return Math.round(total) + ' Min. in ' + filled.length + ' Zonen';
  }, (body) => {
    inputs.forEach((zi) => body.appendChild(el('div', { class: 'zone-row' }, [
      el('span', { class: 'zone-dot', style: 'background:' + (DATA.ZONE_COLOR[zi.zone.zone] || '#888') }),
      el('span', { class: 'zone-name', text: zi.zone.zone + ' · ' + zi.zone.name }),
      zi.field,
    ])));
    body.appendChild(el('div', { class: 'muted small', text: 'Trägt das Diagramm '
      + '„Zeit je Zone" im Tagebuch. Kommt sonst über den Garmin-Abgleich.' }));
  });
  inputs.forEach((zi) => zi.field.addEventListener('input', disc.refresh));
  return { node: disc.node, value: value };
}

function roundsEditor(session, onTotals) {
  let blocks = (session.split_blocks && session.split_blocks.length)
    ? session.split_blocks.map((b) => ({
      count: b.count || 1,
      splits: (b.splits || []).map((x) => Object.assign({}, x)),
    }))
    : (session.splits || []).map((x) => ({ count: 1, splits: [Object.assign({}, x)] }));

  const list = el('div', { class: 'rounds' });
  const totals = el('div', { class: 'muted small' });

  function flat() {
    const out = [];
    blocks.forEach((b) => {
      for (let i = 0; i < Math.max(1, b.count); i += 1) {
        b.splits.forEach((sp) => out.push({
          kind: sp.kind || SPLIT_KINDS[0],
          distance_km: sp.distance_km === undefined ? null : sp.distance_km,
          duration_s: sp.duration_s === undefined ? null : sp.duration_s,
        }));
      }
    });
    return out.filter((sp) => sp.distance_km || sp.duration_s);
  }

  function sums() {
    const f = flat();
    return {
      rounds: f.length,
      km: f.reduce((a, sp) => a + (sp.distance_km || 0), 0),
      seconds: f.reduce((a, sp) => a + (sp.duration_s || 0), 0),
    };
  }

  let onChange = null;

  function paintTotals() {
    const t = sums();
    totals.textContent = t.rounds
      ? t.rounds + ' Runden · ' + fmtKm(t.km) + ' · ' + fmtDuration(t.seconds)
      : 'Noch keine Runde erfasst.';
    if (onChange) onChange();
  }

  function legRow(block, sp, index) {
    const kind = select(SPLIT_KINDS, sp.kind || SPLIT_KINDS[0], (v) => { sp.kind = v; });
    kind.className = 'kind-select';
    const km = input('text', sp.distance_km, { inputmode: 'decimal', placeholder: 'km' });
    const time = input('text', sp.duration_s ? fmtSeconds(sp.duration_s) : '',
      { inputmode: 'numeric', placeholder: 'Zeit' });
    km.addEventListener('input', () => { sp.distance_km = num(km.value); paintTotals(); });
    time.addEventListener('input', () => { sp.duration_s = parseSeconds(time.value); paintTotals(); });
    return el('div', { class: 'round-row' }, [
      kind, km, time,
      el('button', {
        class: 'row-x tap', type: 'button', text: '✕', 'aria-label': 'Abschnitt entfernen',
        onclick: () => {
          block.splits.splice(index, 1);
          if (!block.splits.length) blocks = blocks.filter((b) => b !== block);
          haptic(); paint();
        },
      }),
    ]);
  }

  function paint() {
    list.textContent = '';
    blocks.forEach((block) => {
      const kids = [];
      if (block.count > 1 || block.splits.length > 1) {
        const cnt = input('text', block.count, { inputmode: 'numeric' });
        cnt.className = 'rep-count';
        cnt.addEventListener('input', () => {
          block.count = Math.max(1, parseInt(cnt.value, 10) || 1);
          paintTotals();
        });
        kids.push(el('div', { class: 'rep-head' }, [
          cnt, el('span', { class: 'muted', text: '× Wiederholungen' }),
          el('button', {
            class: 'link-btn tap', type: 'button', text: '＋ Abschnitt',
            onclick: () => {
              block.splits.push({ kind: SPLIT_KINDS[0], distance_km: null, duration_s: null });
              haptic(); paint();
            },
          }),
        ]));
      }
      block.splits.forEach((sp, i) => kids.push(legRow(block, sp, i)));
      list.appendChild(el('div', {
        class: 'round-block' + ((block.count > 1 || block.splits.length > 1) ? ' repeat' : ''),
      }, kids));
    });
    paintTotals();
  }
  paint();

  const disc = disclosure('Runden & Intervalle', () => {
    const t = sums();
    return t.rounds ? t.rounds + ' Runden · ' + fmtKm(t.km) : 'nicht erfasst';
  }, (body) => {
    body.appendChild(el('div', { class: 'round-head' }, [
      el('span', { text: 'Art' }), el('span', { text: 'km' }),
      el('span', { text: 'Zeit' }), el('span', { text: '' }),
    ]));
    body.appendChild(list);
    body.appendChild(totals);
    body.appendChild(el('div', { class: 'btn-row wide' }, [
      actionButton('＋ Runde', () => {
        blocks.push({ count: 1, splits: [{ kind: SPLIT_KINDS[0], distance_km: null, duration_s: null }] });
        paint();
      }, 'ghost'),
      actionButton('⟳ Serie', () => {
        blocks.push({ count: 4, splits: [
          { kind: 'Laufen', distance_km: null, duration_s: null },
          { kind: 'Erholung', distance_km: null, duration_s: null },
        ] });
        paint();
      }, 'ghost'),
    ]));
    body.appendChild(el('div', { class: 'btn-row wide' }, [
      actionButton('Summen übernehmen', () => {
        const t = sums();
        if (!t.rounds) return;
        onTotals(t.km, t.seconds);
        haptic();
      }, 'ghost'),
    ]));
    body.appendChild(el('div', { class: 'muted small', text: 'Die Rundenarten sind '
      + 'nicht Beiwerk: aus ihnen liest die App das Tempo der Arbeitsabschnitte. '
      + 'Ohne sie zählt ein Intervall mit seinem Gesamtschnitt und die Form '
      + 'erscheint schlechter, als sie ist.' }));
  });
  onChange = disc.refresh;
  paintTotals();

  return {
    node: disc.node,
    value: () => ({ splits: flat(), blocks: blocks.filter((b) => b.splits.length) }),
  };
}

function exerciseEditor(session) {
  let rows = (session.exercise_sets || []).map((e) => Object.assign({}, e));
  const list = el('div', { class: 'exercises' });
  let onChange = null;

  function addRow(data) {
    rows.push(Object.assign({ exercise: '', sets: 3, reps: null, weight_kg: null,
      duration_s: null, rest_s: null }, data || {}));
  }

  function paint() {
    list.textContent = '';
    rows.forEach((r, i) => {
      const name = input('text', r.exercise, { placeholder: 'Übung' });
      const sets = input('text', r.sets, { inputmode: 'numeric', placeholder: 'Sätze' });
      const reps = input('text', r.reps, { inputmode: 'numeric', placeholder: 'Wdh.' });
      const kg = input('text', r.weight_kg, { inputmode: 'decimal', placeholder: 'kg' });
      const dur = input('text', r.duration_s ? fmtSeconds(r.duration_s) : '',
        { inputmode: 'numeric', placeholder: 'Zeit' });
      const rest = input('text', r.rest_s ? fmtSeconds(r.rest_s) : '',
        { inputmode: 'numeric', placeholder: 'Pause' });
      name.addEventListener('input', () => { r.exercise = name.value; });
      sets.addEventListener('input', () => { r.sets = parseInt(sets.value, 10) || 1; });
      reps.addEventListener('input', () => { r.reps = num(reps.value); });
      kg.addEventListener('input', () => { r.weight_kg = num(kg.value); });
      dur.addEventListener('input', () => { r.duration_s = parseSeconds(dur.value); });
      rest.addEventListener('input', () => { r.rest_s = parseSeconds(rest.value); });
      list.appendChild(el('div', { class: 'exercise-row' }, [
        el('div', { class: 'exercise-name' }, [
          name,
          el('button', {
            class: 'row-x tap', type: 'button', text: '✕', 'aria-label': 'Übung entfernen',
            onclick: () => { rows.splice(i, 1); haptic(); paint(); },
          }),
        ]),
        el('div', { class: 'exercise-nums' }, [sets, reps, kg, dur, rest]),
      ]));
    });
    if (!rows.length) {
      list.appendChild(el('div', { class: 'muted small', text: 'Noch keine Übung erfasst.' }));
    }
    if (onChange) onChange();
  }
  paint();

  const disc = disclosure('Übungen', () => (rows.length
    ? rows.length + (rows.length === 1 ? ' Übung' : ' Übungen') : 'nicht erfasst'),
  (body) => {
    body.appendChild(el('div', { class: 'exercise-head' }, [
      el('span', { text: 'Sätze' }), el('span', { text: 'Wdh.' }), el('span', { text: 'kg' }),
      el('span', { text: 'Zeit' }), el('span', { text: 'Pause' }),
    ]));
    body.appendChild(list);
    const fromPlan = planExerciseRows(session);
    body.appendChild(el('div', { class: 'btn-row wide' }, [
      actionButton('＋ Übung', () => { addRow(); haptic(); paint(); }, 'ghost'),
      fromPlan.length ? actionButton('Aus dem Plan', () => {
        rows = fromPlan.slice();
        haptic(); paint();
      }, 'ghost') : null,
    ]));
    body.appendChild(el('div', { class: 'muted small', text: 'Zeit und Pause in '
      + 'Sekunden („45") oder als m:ss. Ein Unterarmstütz hat nur Zeit, keine '
      + 'Wiederholungen – beides zusammen geht auch.' }));
  });

  onChange = disc.refresh;
  paint();

  return {
    node: disc.node,
    value: () => rows.filter((r) => (r.exercise || '').trim()).map((r) => ({
      exercise: r.exercise.trim(), sets: Math.max(1, r.sets || 1),
      reps: r.reps === undefined ? null : r.reps,
      weight_kg: r.weight_kg === undefined ? null : r.weight_kg,
      duration_s: r.duration_s === undefined ? null : r.duration_s,
      rest_s: r.rest_s === undefined ? null : r.rest_s,
    })),
  };
}

function recordCard(s) {
  const strength = s.training_type === TrainingType.STRENGTH;
  const dist = input('text', s.actual_distance_km, { inputmode: 'decimal', placeholder: '–' });
  const dur = input('text', s.actual_duration_s ? fmtDuration(s.actual_duration_s) : '',
    { inputmode: 'numeric', placeholder: 'mm:ss' });
  const hr = input('text', s.actual_avg_hr, { inputmode: 'numeric', placeholder: '–' });
  const hrMaxIn = input('text', s.actual_max_hr, { inputmode: 'numeric', placeholder: '–' });
  const aer = input('text', s.aerobic_benefit, { inputmode: 'decimal', placeholder: '0–5' });
  const anaer = input('text', s.anaerobic_benefit, { inputmode: 'decimal', placeholder: '0–5' });
  const effort = stepper(s.perceived_effort, 1, 10, 'Anstrengung (RPE)',
    ['sehr leicht', 'leicht', 'locker', 'zügig', 'fordernd', 'hart', 'sehr hart',
      'am Limit', 'fast alles', 'alles']);
  const felt = stepper(s.felt, 1, 5, 'Gefühl', ['mies', 'mau', 'geht so', 'gut', 'top']);

  const zones = zoneMinutesEditor(s);
  const rounds = strength ? null : roundsEditor(s, (km, seconds) => {
    dist.value = (Math.round(km * 100) / 100).toString().replace('.', ',');
    dur.value = fmtDuration(seconds);
  });
  const exercises = strength ? exerciseEditor(s) : null;
  const error = formError();

  const fields = [];
  if (!strength) fields.push(row('Distanz (km)', dist));
  fields.push(row('Dauer', dur));
  fields.push(row('Ø Puls', hr));
  fields.push(row('Max. Puls', hrMaxIn));
  fields.push(row('Aerober Effekt', aer));
  fields.push(row('Anaerober Effekt', anaer));

  function collect() {
    const v = {
      actual_distance_km: strength ? null : num(dist.value),
      actual_duration_s: parseDuration(dur.value),
      actual_avg_hr: num(hr.value),
      actual_max_hr: num(hrMaxIn.value),
      aerobic_benefit: num(aer.value),
      anaerobic_benefit: num(anaer.value),
      perceived_effort: effort.value(),
      felt: felt.value(),
      zone_minutes: zones.value(),
    };
    if (rounds) {
      const r = rounds.value();
      v.splits = r.splits;
      v.split_blocks = r.blocks;
    }
    if (exercises) v.exercise_sets = exercises.value();
    return v;
  }

  function invalid(v) {
    const bad = [
      [v.actual_avg_hr, 25, 250, 'Ø Puls liegt zwischen 25 und 250 bpm.'],
      [v.actual_max_hr, 25, 250, 'Max. Puls liegt zwischen 25 und 250 bpm.'],
      [v.aerobic_benefit, 0, 5, 'Der aerobe Effekt liegt zwischen 0 und 5.'],
      [v.anaerobic_benefit, 0, 5, 'Der anaerobe Effekt liegt zwischen 0 und 5.'],
      [v.actual_distance_km, 0, 500, 'Die Distanz liegt zwischen 0 und 500 km.'],
    ].find((x) => x[0] !== null && (x[0] < x[1] || x[0] > x[2]));
    return bad ? bad[3] : null;
  }

  function write(done) {
    const v = collect();
    const msg = invalid(v);
    if (msg) { error.textContent = msg; return; }
    if (done) {
      markDone(PLAN, s.id, v);
      Object.keys(v).forEach((k) => {
        if (v[k] === null || v[k] === '') s[k] = v[k];
      });
    } else {
      Object.keys(v).forEach((k) => { s[k] = v[k]; });
      touch(s);
    }
    persist(); haptic(); render(); closeSheet();
  }

  const out = [card([
    el('div', { class: 'card-title', text: 'Erfassen' }),
    el('div', { class: 'grid2' }, fields),
    effort.node,
    felt.node,
  ])];
  if (rounds) out.push(card([rounds.node]));
  if (exercises) out.push(card([exercises.node]));
  out.push(card([zones.node]));
  out.push(error);
  out.push(el('div', { class: 'btn-row wide' }, [
    actionButton('Nur speichern', () => write(false), 'ghost'),
    actionButton('✓ Erledigt', () => write(true), 'primary'),
  ]));
  return out;
}


function openDiarySheet(day, opts) {
  const options = opts || {};
  const entry = normalizeDiaryEntry(Object.assign({}, (PLAN.diary || {})[day] || {}));
  const heading = WEEKDAYS_DE[weekday(day)] + ', ' + fmtDateShort(day);
  const hasNext = addDays(day, 1) <= today();

  openSheet(heading, (body) => {
    body.appendChild(el('div', { class: 'sheet-nav' }, [
      el('button', {
        class: 'icon-btn tap', text: '‹', 'aria-label': 'Tag zurück',
        onclick: () => openDiarySheet(addDays(day, -1), options),
      }),
      el('div', { class: 'sheet-nav-mid' }, [
        el('div', { class: 'sheet-nav-title', text: fmtDate(day) }),
        el('div', { class: 'sheet-nav-sub', text: relativeDay(day) }),
      ]),
      el('button', {
        class: 'icon-btn tap', text: '›', 'aria-label': 'Tag vor',
        disabled: hasNext ? null : 'disabled',
        onclick: () => { if (hasNext) openDiarySheet(addDays(day, 1), options); },
      }),
    ]));

    const sess = sessionsOn(PLAN, day).filter((s) => !s.archived);
    if (sess.length) {
      body.appendChild(card([el('div', { class: 'card-title', text: 'An diesem Tag' })].concat(
        sess.map((s) => el('button', {
          class: 'list-row tap', type: 'button',
          onclick: () => { closeSheet(); setTimeout(() => openSessionSheet(s.id), 200); },
        }, [
          el('span', { class: 'dot', style: 'background:' + typeColor(s.training_type) }),
          el('span', { class: 'list-row-name', text: s.training_type }),
          el('span', { class: 'list-row-val', text: sessionOneLine(s) }),
          el('span', { class: 'chev', text: '›' }),
        ]))
      )));
    }

    const sleep = input('text', entry.sleep_h, { inputmode: 'decimal', placeholder: 'h' });
    const weight = input('text', entry.weight_kg, { inputmode: 'decimal', placeholder: 'kg' });
    const rhr = input('text', entry.resting_hr, { inputmode: 'numeric', placeholder: 'bpm' });
    const hrv = input('text', entry.hrv, { inputmode: 'numeric', placeholder: 'ms' });
    const soreness = stepper(entry.soreness, 0, 5, 'Muskelkater',
      ['keiner', 'kaum', 'leicht', 'spürbar', 'stark', 'platt']);
    const feeling = stepper(entry.feeling, 1, 5, 'Gefühl',
      ['mies', 'mau', 'geht so', 'gut', 'top']);
    const niggle = input('text', entry.niggle, { placeholder: 'z. B. Achillessehne links' });
    const note = el('textarea', { rows: '3', placeholder: 'Wie war der Tag?' });
    note.value = entry.note || '';
    const error = formError();

    body.appendChild(card([
      el('div', { class: 'card-title', text: 'Erholung' }),
      el('div', { class: 'grid2' }, [
        row('Schlaf (h)', sleep), row('Gewicht (kg)', weight),
        row('Ruhepuls (bpm)', rhr), row('HRV (ms)', hrv),
      ]),
      soreness.node,
      feeling.node,
    ]));

    body.appendChild(card([
      el('div', { class: 'card-title', text: 'Notiz' }),
      row('Wehwehchen', niggle),
      note,
    ]));

    const watch = [
      ['Body Battery', entry.body_battery],
      ['Ø Stress', entry.stress_avg],
      ['Schlafscore', entry.sleep_score],
      ['HRV-Einordnung', entry.hrv_status],
    ].filter((r) => r[1] !== null && r[1] !== undefined && r[1] !== '');
    if (watch.length) {
      body.appendChild(card([el('div', { class: 'card-title', text: 'Von der Uhr' })]
        .concat(watch.map((r) => el('div', { class: 'kv' }, [
          el('span', { text: r[0] }), el('strong', { text: String(r[1]) }),
        ])))
        .concat([el('div', { class: 'muted small', text: 'Kommt über den '
          + 'Garmin-Abgleich der Desktop-App – deshalb nur zum Lesen.' })])));
    }

    body.appendChild(error);
    body.appendChild(el('div', { class: 'btn-row wide' }, [
      diaryHasContent(entry)
        ? actionButton('Löschen', () => {
          if (!confirm('Den Tagebucheintrag dieses Tages löschen?')) return;
          PLAN.diary[day] = { date: day, note: '', niggle: '', updated_at: nowStamp() };
          persist();
          if (options.onSaved) options.onSaved();
          render();
          closeSheet();
        }, 'danger')
        : null,
      actionButton('Speichern', () => {
        const s = num(sleep.value);
        const w = num(weight.value);
        const r = num(rhr.value);
        const h = num(hrv.value);
        const bad = [
          [s, 0, 24, 'Schlaf liegt zwischen 0 und 24 Stunden.'],
          [w, 30, 200, 'Gewicht liegt zwischen 30 und 200 kg.'],
          [r, 25, 120, 'Ruhepuls liegt zwischen 25 und 120 bpm.'],
          [h, 5, 250, 'HRV liegt zwischen 5 und 250 ms.'],
        ].find((x) => x[0] !== null && (x[0] < x[1] || x[0] > x[2]));
        if (bad) { error.textContent = bad[3]; return; }

        PLAN.diary = PLAN.diary || {};
        PLAN.diary[day] = Object.assign({}, entry, {
          date: day,
          sleep_h: s, weight_kg: w, resting_hr: r, hrv: h,
          soreness: soreness.value(),
          feeling: feeling.value(),
          niggle: niggle.value.trim(),
          note: note.value.trim(),
          updated_at: nowStamp(),
        });
        persist();
        haptic();
        if (options.onSaved) options.onSaved();
        render();
        closeSheet();
      }, 'primary'),
    ]));
  });

  onSwipe(sheetEl, (dir) => {
    if (dir > 0) openDiarySheet(addDays(day, -1), options);
    else if (addDays(day, 1) <= today()) openDiarySheet(addDays(day, 1), options);
  });
}

function relativeDay(day) {
  const diff = daysBetween(day, today());
  if (diff === 0) return 'heute';
  if (diff === 1) return 'gestern';
  if (diff === -1) return 'morgen';
  return diff > 1 ? 'vor ' + diff + ' Tagen' : 'in ' + (-diff) + ' Tagen';
}

function sessionOneLine(s) {
  if (s.status === TrainingStatus.DONE) {
    const bits = [];
    if (s.actual_distance_km) bits.push(fmtKm(s.actual_distance_km));
    if (s.actual_duration_s) bits.push(fmtDuration(s.actual_duration_s));
    const p = actualPace(s);
    if (p) bits.push(fmtPace(p));
    return bits.length ? bits.join(' · ') : 'erledigt';
  }
  if (s.status === TrainingStatus.MISSED) return 'keine Zeit';
  return s.target_distance_km ? fmtKm(s.target_distance_km) : 'geplant';
}


function todayHero(s, now, eyebrow, ring) {
  const done = s.status === TrainingStatus.DONE;
  const hint = paceHint(s, PLAN, SETTINGS, null) || '';
  const pace = hint.match(/\d:\d\d(?:[–-]\d:\d\d)?/);
  const zone = (s.hr_zone && s.hr_zone !== Zone.NONE) ? String(s.hr_zone).match(/Z[1-5]/) : null;
  const km = (done && s.actual_distance_km) || s.target_distance_km;
  const cells = [];
  if (pace) cells.push([pace[0], 'min/km', 'wide']);
  if (km) cells.push([String(Math.round(km * 10) / 10), 'km']);
  else if (s.target_duration_min) cells.push([String(s.target_duration_min), 'Min.']);
  if (zone) cells.push([zone[0], 'Puls']);
  const shoe = shoeHint(s, SETTINGS);
  const fuel = fuelingSummary(fuelingFor(s, PLAN, SETTINGS, now));
  const extra = [shoe, fuel].filter(Boolean).join('  ·  ');
  const body = planText(s, PLAN, SETTINGS, null, false);

  return el('div', { class: 'glass today', style: '--type:' + typeColor(s.training_type) }, [
    eyebrow ? el('div', { class: 'today-eyebrow', text: eyebrow }) : null,
    ring,
    el('div', { class: 'today-type', text: s.training_type + (done ? ' ✓' : '') }),
    cells.length ? el('div', { class: 'today-metrics' }, cells.map((c) => el('div', {
      class: 'today-metric' + (c[2] ? ' wide' : ''),
    }, [
      el('div', { class: 'today-num', text: c[0] }),
      el('div', { class: 'today-unit', text: c[1] }),
    ]))) : null,
    (!pace && hint && !/^Z[1-5]$/.test(hint.trim())) ? el('div', { class: 'today-effort', text: hint }) : null,
    body ? el('div', { class: 'today-text', text: body }) : null,
    extra ? el('div', { class: 'today-extra', text: extra }) : null,
    el('div', { class: 'btn-row' }, [
      actionButton(done ? 'Ansehen' : 'Erledigt', () => openSessionSheet(s.id), done ? 'ghost' : 'primary'),
    ]),
  ]);
}

const DARK_COLORS = {
  TYPE_COLOR: { ...DATA.TYPE_COLOR }, STATUS_COLOR: { ...DATA.STATUS_COLOR },
  ZONE_COLOR: { ...DATA.ZONE_COLOR }, PALETTE: { ...DATA.PALETTE },
};

function applyTheme() {
  const wanted = (SETTINGS && SETTINGS.phone_theme) || 'auto';
  const light = wanted === 'light' || (wanted === 'auto'
    && window.matchMedia('(prefers-color-scheme: light)').matches);
  const set = light ? DATA.LIGHT_COLORS : DARK_COLORS;
  ['TYPE_COLOR', 'STATUS_COLOR', 'ZONE_COLOR', 'PALETTE'].forEach((k) => Object.assign(DATA[k], set[k]));
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', set.PALETTE.BG_ROOT);
}

function viewHeute() {
  const now = today();
  const out = [];
  const left = daysBetween(now, PLAN.target_date);

  const progress = weekProgress(PLAN, weekStartOf(now));
  const pct = progress[1] ? Math.round((progress[0] / progress[1]) * 100) : 0;
  const weekRing = el('div', { class: 'hero-ring' }, [
    el('div', { class: 'ring', style: '--pct:' + pct }, [
      el('span', { text: progress[0] + '/' + progress[1] }),
    ]),
    el('div', { class: 'hero-ring-cap', text: 'diese Woche' }),
  ]);
  const eyebrow = WEEKDAYS_SHORT[weekday(now)] + ' · ' + fmtDate(now).replace(/\s*\d{4}$/, '');

  const carbo = carboLoading(PLAN, SETTINGS, now);
  if (carbo) {
    out.push(card([
      el('div', { class: 'card-title', text: carbo.title }),
      el('div', { class: 'note', text: carbo.text }),
    ], 'accent-warn'));
  }

  const todays = sessionsOn(PLAN, now);
  if (todays.length) {
    todays.forEach((s, i) => out.push(todayHero(s, now, i === 0 ? eyebrow : null, i === 0 ? weekRing : null)));
  } else {
    const next = PLAN.sessions.filter((s) => s.date && s.date > now && !s.archived
      && s.status !== TrainingStatus.MISSED).sort((a, b) => (a.date < b.date ? -1 : 1))[0];
    out.push(el('div', { class: 'glass today rest' }, [
      el('div', { class: 'today-eyebrow', text: eyebrow }),
      weekRing,
      el('div', { class: 'today-type', text: 'Ruhetag' }),
      el('div', { class: 'today-text', text: 'Ein Tag ohne Einheit ist der Ruhetag – das ist so gewollt.' }),
    ]));
    const pool = weekPool(PLAN, weekStartOf(now));
    if (pool.length && (!next || daysBetween(now, next.date) > 7)) {
      out.push(sectionTitle('Diese Woche verteilen'));
      out.push(card([
        el('div', { class: 'note', text: pool.length + ' Einheiten liegen noch ohne Tag im Pool. '
          + 'Der Plan sagt, was eine Woche enthält – wann, entscheidest du.' }),
        el('div', { class: 'btn-row wide' }, [
          actionButton('Zur Woche', () => switchView('woche'), 'primary'),
        ]),
      ]));
    } else if (next) {
      out.push(sectionTitle('Als Nächstes · ' + fmtDate(next.date)));
      out.push(sessionCard(next, { day: true }));
    }
  }

  const ready = readinessToday(PLAN, now);
  const form = buildTiles(PLAN, SETTINGS, now).find((t) => t.key === 'form_vdot');
  out.push(el('div', { class: 'quick' }, [
    el('div', { class: 'glass quick-cell' }, [
      el('div', { class: 'quick-value', text: form ? form.value.replace('VDOT ', '') : '–' }),
      el('div', { class: 'quick-label', text: 'Form (VDOT)' }),
    ]),
    el('button', {
      class: 'glass quick-cell tap', type: 'button', onclick: () => openDiarySheet(now),
    }, [
      el('div', {
        class: 'quick-value', text: ready ? String(ready.score) : '–',
        style: ready ? 'color:' + (ready.accent === 'done' ? DATA.STATUS_COLOR['erledigt']
          : ready.accent === 'missed' ? DATA.STATUS_COLOR['keine Zeit'] : DATA.ZONE_COLOR['Z4'] || DATA.PALETTE.ACCENT) : null,
      }),
      el('div', { class: 'quick-label', text: ready ? 'Erholung' : 'Erholung eintragen' }),
    ]),
    el('div', { class: 'glass quick-cell' }, [
      el('div', { class: 'quick-value', text: left > 0 ? String(left) : '0' }),
      el('div', { class: 'quick-label', text: left === 1 ? 'Tag bis Zürich' : 'Tage bis Zürich' }),
    ]),
  ]));
  if (ready) out.push(el('div', { class: 'pre-run', text: ready.note }));

  out.push(sectionTitle('Überblick', el('button', {
    class: 'link-btn tap', text: 'Felder',
    onclick: () => openTilePicker(),
  })));
  out.push(el('div', { class: 'tiles' }, visibleTiles(PLAN, SETTINGS, now).map(tileEl)));
  return out;
}

function openTilePicker() {
  openSheet('Felder', (body) => {
    const available = buildTiles(PLAN, SETTINGS, today());
    const byKey = {};
    available.forEach((t) => { byKey[t.key] = t; });
    let chosen = ((SETTINGS.phone_tiles && SETTINGS.phone_tiles.length)
      ? SETTINGS.phone_tiles : DEFAULT_PHONE_TILES).slice();

    const list = el('div', { class: 'pick-list' });

    function save() {
      SETTINGS.phone_tiles = chosen.slice();
      persist();
      render.keepScroll = true;
      render();
    }

    function reorder(shown) {
      chosen = shown.concat(chosen.filter((k) => !byKey[k]));
      save();
    }

    function paint() {
      list.textContent = '';
      const shown = chosen.filter((k) => byKey[k]);
      shown.forEach((k, i) => {
        const t = byKey[k];
        list.appendChild(el('div', { class: 'pick-row on' }, [
          el('button', {
            class: 'pick-toggle tap', type: 'button', text: '✓',
            'aria-label': t.title + ' entfernen',
            onclick: () => {
              chosen = chosen.filter((x) => x !== k);
              haptic(); paint(); save();
            },
          }),
          el('span', { class: 'pick-name', text: t.title }),
          el('button', {
            class: 'pick-move tap', type: 'button', text: '↑', disabled: i ? null : 'disabled',
            'aria-label': t.title + ' nach oben',
            onclick: () => {
              if (!i) return;
              const c = shown.slice();
              c[i - 1] = shown[i]; c[i] = shown[i - 1];
              haptic(); reorder(c); paint();
            },
          }),
          el('button', {
            class: 'pick-move tap', type: 'button', text: '↓',
            disabled: i === shown.length - 1 ? 'disabled' : null,
            'aria-label': t.title + ' nach unten',
            onclick: () => {
              if (i === shown.length - 1) return;
              const c = shown.slice();
              c[i + 1] = shown[i]; c[i] = shown[i + 1];
              haptic(); reorder(c); paint();
            },
          }),
        ]));
      });
      const rest = available.filter((t) => chosen.indexOf(t.key) === -1);
      if (rest.length) {
        list.appendChild(el('div', { class: 'pick-sep', text: 'Nicht gezeigt' }));
        rest.forEach((t) => list.appendChild(el('div', { class: 'pick-row' }, [
          el('button', {
            class: 'pick-toggle tap', type: 'button', text: '＋',
            'aria-label': t.title + ' hinzufügen',
            onclick: () => { chosen = chosen.concat([t.key]); haptic(); paint(); save(); },
          }),
          el('span', { class: 'pick-name', text: t.title }),
          el('span', { class: 'pick-val', text: t.value }),
        ])));
      }
    }
    paint();

    body.appendChild(card([
      el('div', { class: 'note', text: 'Angeboten wird, was deine Daten hergeben – '
        + 'eine Garmin-Kachel erscheint erst, wenn Werte da sind. Die Auswahl '
        + 'bleibt auf diesem Gerät und geht nicht mit dem Abgleich.' }),
      list,
      el('div', { class: 'btn-row wide' }, [
        actionButton('Auf Vorgabe zurücksetzen', () => {
          SETTINGS.phone_tiles = null;
          chosen = DEFAULT_PHONE_TILES.slice();
          persist(); paint(); render.keepScroll = true; render();
        }, 'ghost'),
      ]),
    ]));
  });
}

function viewWoche() {
  const now = today();
  if (!BOARD_MONDAY) BOARD_MONDAY = weekStartOf(now);
  const monday = BOARD_MONDAY;
  const out = [];
  const weeks = groupByWeek(PLAN).map((w) => w[0]);
  const index = weeks.indexOf(monday);
  const week = weekSessions(PLAN, monday);
  const phase = (week.find((s) => s.phase) || {}).phase || '';
  const prog = weekSessionCount(week);
  const hard = hardDays(PLAN);

  out.push(el('div', { class: 'glass weeknav' }, [
    el('button', { class: 'icon-btn tap', text: '‹', onclick: () => { BOARD_MONDAY = addDays(monday, -7); render(); } }),
    el('div', { class: 'weeknav-mid' }, [
      el('div', { class: 'weeknav-title', text: index >= 0 ? 'Woche ' + (index + 1) + ' / ' + weeks.length : fmtDateShort(monday) }),
      el('div', { class: 'weeknav-sub', text: fmtDateShort(monday) + ' – ' + fmtDateShort(addDays(monday, 6)) + (phase ? ' · ' + phase.split(':')[0].replace('PHASE ', 'Ph. ') : '') }),
      el('div', { class: 'weeknav-sub', text: prog[0] + ' von ' + prog[1] + ' Einheiten' }),
    ]),
    el('button', { class: 'icon-btn tap', text: '›', onclick: () => { BOARD_MONDAY = addDays(monday, 7); render(); } }),
  ]));

  const pool = weekPool(PLAN, monday);
  out.push(sectionTitle('Noch zu verteilen (' + pool.length + ')', el('div', { class: 'head-actions' }, [
    el('button', {
      class: 'link-btn tap', text: '⟳ Auto',
      onclick: () => {
        const rhythm = Object.keys(SETTINGS.week_rhythm || {}).length ? SETTINGS.week_rhythm : DEFAULT_RHYTHM;
        const n = applyRhythm(PLAN, monday, rhythm);
        persist(); haptic(); render();
        if (!n) alert('Nichts zu verteilen – oder der Rhythmus passt auf keinen freien Tag.');
      },
    }),
    el('button', {
      class: 'link-btn tap', text: '＋ Einheit',
      onclick: () => openAddSheet(monday),
    }),
  ])));
  if (pool.length) pool.forEach((s) => out.push(sessionCard(s)));
  else out.push(card([el('div', { class: 'note', text: 'Alles verteilt.' })]));

  daysOfWeek(monday).forEach((d) => {
    const sess = sessionsOn(PLAN, d);
    const isToday = d === now;
    out.push(el('div', { class: 'day-head' + (isToday ? ' today' : '') }, [
      el('span', { class: 'day-name', text: WEEKDAYS_DE[weekday(d)] }),
      el('span', { class: 'day-date', text: fmtDateShort(d) }),
      hard.has(d) ? el('span', { class: 'day-warn', text: '⚠ harter Tag' }) : null,
      el('button', { class: 'link-btn tap', text: '✎', onclick: () => openDiarySheet(d) }),
    ]));
    if (sess.length) sess.forEach((s) => out.push(sessionCard(s)));
    else out.push(el('div', { class: 'rest-day', text: 'Ruhetag' }));
  });

  const missed = missedPool(PLAN);
  if (missed.length) {
    out.push(sectionTitle('Keine Zeit (' + missed.length + ')'));
    missed.forEach((s) => out.push(sessionCard(s, { day: true })));
  }
  return out;
}

const DEFAULT_RHYTHM = {
  [TrainingType.EASY]: 1, [TrainingType.INTERVAL]: 2, [TrainingType.TEMPO]: 3,
  [TrainingType.RECOVERY]: 4, [TrainingType.LONG_RUN]: 6, [TrainingType.STRENGTH]: 0,
};

function openAddSheet(monday) {
  openSheet('Eigene Einheit', (body) => {
    let type = TrainingType.EASY;
    let day = weekStartOf(today()) === monday ? today() : monday;
    const dayLabel = el('div', { class: 'muted small', text: fmtDate(day) });
    const picker = el('div', { class: 'day-picker' }, daysOfWeek(monday).map((d) => {
      const btn = el('button', {
        class: 'day-pill tap' + (d === day ? ' active' : ''),
        onclick: () => {
          day = d; dayLabel.textContent = fmtDate(d);
          [...picker.children].forEach((c) => c.classList.remove('active'));
          btn.classList.add('active');
        },
      }, [
        el('span', { class: 'day-pill-wd', text: WEEKDAYS_SHORT[weekday(d)] }),
        el('span', { class: 'day-pill-n', text: String(dt(d).getDate()) }),
      ]);
      return btn;
    }));
    body.appendChild(card([
      row('Art', select(RETYPE_TYPES, type, (v) => { type = v; })),
      el('div', { class: 'card-title', text: 'Tag' }), picker, dayLabel,
      el('div', { class: 'btn-row wide' }, [
        actionButton('Hinzufügen', () => {
          try {
            const s = addCustomSession(PLAN, type, day);
            persist(); render(); closeSheet(); openSessionSheet(s.id);
          } catch (e) { alert(e.message); }
        }, 'primary'),
      ]),
    ]));
  });
}

function viewPlan() {
  const out = [];
  const now = today();
  const currentMonday = weekStartOf(now);
  const groups = groupByWeek(PLAN);
  const idx = groups.findIndex((g) => g[0] === currentMonday);
  const ordered = idx >= 0 ? groups.slice(idx).concat(groups.slice(0, idx)) : groups;
  let pastMarked = false;

  ordered.forEach((g) => {
    const monday = g[0];
    const number = groups.findIndex((x) => x[0] === monday) + 1;
    if (monday < currentMonday && !pastMarked) {
      pastMarked = true;
      out.push(el('div', { class: 'divider', text: 'VERGANGENE WOCHEN' }));
    }
    const sess = g[1].filter((s) => !s.archived);
    const prog = weekSessionCount(sess);
    const km = sess.reduce((a, s) => a + (s.target_distance_km || 0), 0);
    const open = !!EXPANDED[monday];
    out.push(el('div', {
      class: 'glass week-head tap' + (monday === currentMonday ? ' current' : ''),
      onclick: () => { EXPANDED[monday] = !open; render(); },
    }, [
      el('div', {}, [
        el('div', { class: 'week-title', text: 'Woche ' + number + (monday === currentMonday ? ' · jetzt' : '') }),
        el('div', { class: 'week-sub', text: fmtDateShort(monday) + ' – ' + fmtDateShort(addDays(monday, 6)) + ' · ' + fmtKm(km) + ' · ' + prog[0] + '/' + prog[1] }),
      ]),
      el('span', { class: 'chev', text: open ? '▾' : '▸' }),
    ]));
    if (open) sess.sort(sortKey).forEach((s) => out.push(sessionCard(s, { day: true })));
  });
  return out;
}


let DIARY_MODE = 'kalender';
let DIARY_MONTH = null;
let DIARY_DAY = null;
let DIARY_METRIC = 'schlaf';
let DIARY_FILTER = 'alle';
let DIARY_WEEKS = 8;

const DIARY_FILTERS = [
  { key: 'alle', label: 'Alle' },
  { key: 'training', label: 'Mit Training' },
  { key: 'tagebuch', label: 'Erfasst' },
  { key: 'notiz', label: 'Notizen' },
  { key: 'offen', label: 'Lücken' },
];

function diaryDayMatches(day, marks, entry) {
  switch (DIARY_FILTER) {
    case 'training': return marks.planned > 0;
    case 'tagebuch': return diaryHasContent(entry);
    case 'notiz': return !!((entry && entry.note) || (entry && entry.niggle));
    case 'offen': return day <= today() && marks.done > 0 && !diaryHasContent(entry);
    default: return marks.planned > 0 || diaryHasContent(entry);
  }
}

function viewTagebuch() {
  const now = today();
  if (!DIARY_MONTH) DIARY_MONTH = monthOf(now);
  const out = [];

  out.push(segmented([
    { key: 'kalender', label: 'Kalender' },
    { key: 'wochen', label: 'Wochen' },
    { key: 'verlauf', label: 'Verlauf' },
  ], DIARY_MODE, (k) => { DIARY_MODE = k; render.keepScroll = false; render(); }));

  if (DIARY_MODE === 'kalender') return out.concat(diaryCalendar(now));
  if (DIARY_MODE === 'wochen') return out.concat(diaryWeeks(now));
  return out.concat(diaryTrends(now));
}


function diaryCalendar(now) {
  const out = [];
  const month = DIARY_MONTH;
  const grid = monthGrid(month);
  const summary = monthSummary(PLAN, month, now);

  const nextMonth = addMonths(month, 1);
  const lastMonth = monthOf(PLAN.target_date);
  out.push(el('div', { class: 'glass weeknav' }, [
    el('button', {
      class: 'icon-btn tap', text: '‹', 'aria-label': 'Monat zurück',
      onclick: () => { DIARY_MONTH = addMonths(month, -1); haptic(); render(); },
    }),
    el('div', { class: 'weeknav-mid' }, [
      el('div', { class: 'weeknav-title', text: fmtMonth(month) }),
      el('div', { class: 'weeknav-sub', text: summary.done + ' erledigt · ' + fmtKm(summary.km) }),
    ]),
    el('button', {
      class: 'icon-btn tap', text: '›', 'aria-label': 'Monat vor',
      disabled: nextMonth > lastMonth ? 'disabled' : null,
      onclick: () => {
        if (nextMonth > lastMonth) return;
        DIARY_MONTH = nextMonth; haptic(); render();
      },
    }),
  ]));

  const cells = grid.map((d) => {
    const inMonth = monthOf(d) === month;
    const marks = dayMarks(PLAN, d);
    const entry = (PLAN.diary || {})[d];
    const isToday = d === now;
    const dots = marks.types.slice(0, 4).map((t, i) => el('span', {
      class: 'cal-dot' + (i < marks.done ? ' filled' : ''),
      style: '--type:' + typeColor(t),
    }));
    return el('button', {
      type: 'button',
      class: 'cal-cell tap' + (inMonth ? '' : ' outside')
        + (isToday ? ' today' : '') + (d === DIARY_DAY ? ' picked' : ''),
      'aria-label': fmtDate(d) + (marks.planned ? ', ' + marks.planned + ' Einheiten' : ''),
      onclick: () => {
        DIARY_DAY = (DIARY_DAY === d) ? null : d;
        if (DIARY_DAY && monthOf(DIARY_DAY) !== month) DIARY_MONTH = monthOf(DIARY_DAY);
        haptic();
        render();
      },
    }, [
      el('span', { class: 'cal-num', text: String(dt(d).getDate()) }),
      el('span', { class: 'cal-dots' }, dots),
      diaryHasContent(entry) ? el('span', { class: 'cal-diary' }) : null,
    ]);
  });

  const calendar = el('div', { class: 'glass card calendar' }, [
    el('div', { class: 'cal-week' }, WEEKDAYS_SHORT.map((w) => el('span', { text: w }))),
    el('div', { class: 'cal-grid' }, cells),
    el('div', { class: 'cal-legend' }, [
      el('span', {}, [el('span', { class: 'cal-dot filled', style: '--type:var(--accent)' }),
        document.createTextNode(' erledigt')]),
      el('span', {}, [el('span', { class: 'cal-dot', style: '--type:var(--accent)' }),
        document.createTextNode(' geplant')]),
      el('span', {}, [el('span', { class: 'cal-diary static' }),
        document.createTextNode(' Tagebuch')]),
    ]),
  ]);
  onSwipe(calendar, (dir) => {
    const target = addMonths(month, dir > 0 ? -1 : 1);
    if (target > lastMonth) return;
    DIARY_MONTH = target;
    render();
  });
  out.push(calendar);

  if (DIARY_DAY) out.push(diaryDayCard(DIARY_DAY));

  out.push(sectionTitle('Rückblick ' + fmtMonth(month)));
  out.push(monthRecapCard(summary));

  const first = month + '-01';
  const days = grid.filter((d) => monthOf(d) === month && d >= PLAN.start_date);
  const shown = days.filter((d) => diaryDayMatches(d, dayMarks(PLAN, d), (PLAN.diary || {})[d]))
    .sort().reverse();

  out.push(sectionTitle('Tage (' + shown.length + ')'));
  out.push(el('div', { class: 'chip-row no-swipe' }, DIARY_FILTERS.map((f) => el('button', {
    class: 'filter-chip tap' + (f.key === DIARY_FILTER ? ' active' : ''),
    type: 'button', text: f.label,
    onclick: () => { DIARY_FILTER = f.key; haptic(); render.keepScroll = true; render(); },
  }))));

  if (!shown.length) {
    out.push(card([el('div', { class: 'note', text: DIARY_FILTER === 'offen'
      ? 'Keine Lücken in diesem Monat – jeder Trainingstag ist erfasst.'
      : 'In diesem Monat steht nichts, was zu diesem Filter passt.' })]));
  }
  shown.forEach((d) => out.push(diaryRow(d, first)));
  return out;
}

function diaryDayCard(day) {
  const entry = (PLAN.diary || {})[day] || {};
  const sess = sessionsOn(PLAN, day).filter((s) => !s.archived);
  const ready = readinessToday(PLAN, day);
  const kids = [
    el('div', { class: 'picked-head' }, [
      el('div', {}, [
        el('div', { class: 'picked-date', text: WEEKDAYS_DE[weekday(day)] + ', ' + fmtDate(day) }),
        el('div', { class: 'muted small', text: relativeDay(day) }),
      ]),
      day <= today() && ready
        ? el('span', { class: 'ready-pill', style: '--c:' + accentColor(ready.accent),
          text: 'Bereitschaft ' + ready.score }) : null,
    ]),
  ];

  sess.forEach((s) => kids.push(el('button', {
    class: 'list-row tap', type: 'button',
    onclick: () => openSessionSheet(s.id),
  }, [
    el('span', { class: 'dot', style: 'background:' + typeColor(s.training_type) }),
    el('span', { class: 'list-row-name', text: s.training_type }),
    el('span', { class: 'list-row-val', text: sessionOneLine(s) }),
    el('span', { class: 'chev', text: '›' }),
  ])));
  if (!sess.length) kids.push(el('div', { class: 'muted small', text: 'Kein Training an diesem Tag.' }));

  const bits = diaryBits(entry);
  if (bits.length) kids.push(el('div', { class: 'diary-bits', text: bits.join(' · ') }));
  if (entry.note) kids.push(el('div', { class: 'diary-note', text: entry.note }));
  if (entry.niggle) kids.push(el('div', { class: 'diary-niggle', text: '⚠ ' + entry.niggle }));

  kids.push(el('div', { class: 'btn-row wide' }, [
    actionButton(diaryHasContent(entry) ? '✎ Tagebuch bearbeiten' : '✎ Tagebuch ausfüllen',
      () => openDiarySheet(day), 'ghost'),
  ]));
  return card(kids, 'picked');
}

function diaryBits(entry) {
  const bits = [];
  if (entry.sleep_h) bits.push(fmtNum(entry.sleep_h) + ' h Schlaf');
  if (entry.resting_hr) bits.push('RHF ' + entry.resting_hr);
  if (entry.hrv) bits.push('HRV ' + entry.hrv);
  if (entry.weight_kg) bits.push(fmtNum(entry.weight_kg) + ' kg');
  if (entry.soreness !== null && entry.soreness !== undefined) bits.push('Kater ' + entry.soreness + '/5');
  if (entry.feeling) bits.push('Gefühl ' + entry.feeling + '/5');
  if (entry.body_battery) bits.push('BB ' + entry.body_battery);
  if (entry.sleep_score) bits.push('Score ' + entry.sleep_score);
  return bits;
}

function fmtNum(v) {
  return (Math.round(Number(v) * 10) / 10).toString().replace('.', ',');
}

function accentColor(key) {
  const map = {
    accent: DATA.PALETTE.ACCENT, done: DATA.STATUS_COLOR['erledigt'],
    missed: DATA.STATUS_COLOR['keine Zeit'], aerob_high: '#fb923c',
    long_run: DATA.TYPE_COLOR['Langer Lauf'],
  };
  return map[key] || DATA.PALETTE.TEXT;
}

function diaryRow(day) {
  const entry = (PLAN.diary || {})[day] || {};
  const sess = sessionsOn(PLAN, day).filter((s) => !s.archived);
  const done = sess.filter((s) => s.status === TrainingStatus.DONE);
  const bits = diaryBits(entry);
  const isToday = day === today();
  return el('button', {
    class: 'glass diary-day tap' + (isToday ? ' today' : ''), type: 'button',
    onclick: () => { DIARY_DAY = day; haptic(); render.keepScroll = true; render(); },
  }, [
    el('div', { class: 'diary-head' }, [
      el('span', { class: 'diary-date', text: WEEKDAYS_SHORT[weekday(day)] + ' · ' + fmtDateShort(day) }),
      sess.length ? el('span', { class: 'cal-dots' }, sess.slice(0, 4).map((s, i) => el('span', {
        class: 'cal-dot' + (s.status === TrainingStatus.DONE ? ' filled' : ''),
        style: '--type:' + typeColor(s.training_type),
      }))) : null,
      isToday ? el('span', { class: 'chip ghost', text: 'heute' }) : null,
    ]),
    done.length ? el('div', { class: 'diary-sess',
      text: done.map((s) => s.training_type + (s.actual_distance_km ? ' ' + fmtKm(s.actual_distance_km) : '')).join(' · ') }) : null,
    bits.length ? el('div', { class: 'diary-bits', text: bits.join(' · ') }) : null,
    entry.note ? el('div', { class: 'diary-note', text: entry.note }) : null,
    (!sess.length && !bits.length && !entry.note)
      ? el('div', { class: 'muted small', text: 'nichts erfasst' }) : null,
  ]);
}

function monthRecapCard(m) {
  const tiles = [
    ['Einheiten', m.done + (m.planned ? ' / ' + m.planned : ''), 'erledigt'],
    ['Kilometer', fmtKm(m.km), m.runs + ' Läufe'],
    ['Zeit', m.duration_s ? fmtHours(Math.round(m.duration_s / 60)) : '–', 'in Bewegung'],
    ['Ø Pace', m.pace ? fmtPace(m.pace) : '–', 'über alle Läufe'],
    ['Längster Lauf', m.longest ? fmtKm(m.longest) : '–', 'im Monat'],
    ['Höhenmeter', m.elevation ? Math.round(m.elevation) + ' hm' : '–', 'gesamt'],
    ['Kraft', String(m.strength), m.strength === 1 ? 'Einheit' : 'Einheiten'],
    ['Belastung', m.load ? fmtNum(m.load) : '–', 'aerob + anaerob'],
  ];
  const recovery = [
    ['Ø Schlaf', m.sleep, (v) => fmtNum(v) + ' h'],
    ['Ø Ruhepuls', m.resting_hr, (v) => Math.round(v) + ' bpm'],
    ['Ø HRV', m.hrv, (v) => Math.round(v) + ' ms'],
    ['Ø Gewicht', m.weight, (v) => fmtNum(v) + ' kg'],
    ['Ø Gefühl', m.feeling, (v) => fmtNum(v) + ' / 5'],
  ].filter((r) => r[1] !== null && r[1] !== undefined);

  return card([
    el('div', { class: 'recap' }, tiles.map((t) => el('div', { class: 'recap-cell' }, [
      el('div', { class: 'recap-val', text: t[1] }),
      el('div', { class: 'recap-title', text: t[0] }),
      el('div', { class: 'recap-sub', text: t[2] }),
    ]))),
    recovery.length ? el('div', { class: 'card-title', style: 'margin-top:14px', text: 'Erholung im Schnitt' }) : null,
  ].concat(recovery.map((r) => el('div', { class: 'kv' }, [
    el('span', { text: r[0] }), el('strong', { text: r[2](r[1]) }),
  ]))).concat([
    el('div', { class: 'muted small',
      text: m.diary_days + ' von ' + (daysBetween(m.first, m.last) + 1) + ' Tagen im Tagebuch erfasst' }),
  ]));
}


function diaryWeeks(now) {
  const out = [];
  const rows = diaryOverview(PLAN, DIARY_WEEKS, now);

  out.push(sectionTitle('Woche für Woche', el('button', {
    class: 'link-btn tap', text: DIARY_WEEKS <= 8 ? 'mehr zeigen' : 'weniger',
    onclick: () => { DIARY_WEEKS = DIARY_WEEKS <= 8 ? 26 : 8; haptic(); render(); },
  })));

  if (!rows.length) {
    out.push(card([el('div', { class: 'note', text: 'Noch keine abgeschlossene Woche.' })]));
    return out;
  }

  rows.forEach((r, i) => {
    const prev = rows[i + 1];
    const rising = r.resting_hr && prev && prev.resting_hr && (r.resting_hr - prev.resting_hr >= 3);
    const pct = r.total ? Math.min(100, Math.round((r.done / r.total) * 100)) : 0;
    const cells = [
      ['Einheiten', r.done + ' / ' + r.total],
      ['Kilometer', fmtKm(r.km)],
      ['Ø Schlaf', r.sleep ? fmtNum(r.sleep) + ' h' : '–'],
      ['Ø Ruhepuls', r.resting_hr ? Math.round(r.resting_hr) + ' bpm' : '–'],
      ['Ø Kater', r.soreness ? fmtNum(r.soreness) + ' / 5' : '–'],
    ];
    out.push(el('div', { class: 'glass card week-row tap' + (r.is_current ? ' current' : ''),
      onclick: () => {
        BOARD_MONDAY = r.monday;
        switchView('woche');
      },
    }, [
      el('div', { class: 'week-row-head' }, [
        el('div', {}, [
          el('div', { class: 'week-title', text: 'Woche ab ' + fmtDateShort(r.monday)
            + (r.is_current ? ' · jetzt' : '') }),
          el('div', { class: 'week-sub', text: fmtDateShort(r.monday) + ' – ' + fmtDateShort(addDays(r.monday, 6)) }),
        ]),
        el('span', { class: 'chev', text: '›' }),
      ]),
      el('div', { class: 'bar' }, [el('span', { style: 'width:' + pct + '%' })]),
      el('div', { class: 'week-cells' }, cells.map((c, ci) => el('div', {
        class: 'week-cell' + (ci === 3 && rising ? ' warn' : ''),
      }, [
        el('div', { class: 'week-cell-val', text: c[1] }),
        el('div', { class: 'week-cell-title', text: c[0] }),
      ]))),
      rising ? el('div', { class: 'week-warn',
        text: '⚠ Ruhepuls +' + Math.round(r.resting_hr - prev.resting_hr) + ' bpm gegenüber der Vorwoche' }) : null,
    ]));
  });
  return out;
}


function diaryTrends(now) {
  const out = [];
  const metric = diaryMetric(DIARY_METRIC);
  const group = metric.group || 'erholung';

  out.push(segmented(METRIC_GROUPS, group, (k) => {
    const first = metricsOfGroup(k)[0];
    if (first) DIARY_METRIC = first.key;
    render.keepScroll = false;
    render();
  }));

  out.push(el('div', { class: 'chip-row no-swipe' }, metricsOfGroup(group).map((m) => el('button', {
    class: 'filter-chip tap' + (m.key === DIARY_METRIC ? ' active' : ''),
    type: 'button', text: m.label,
    onclick: () => { DIARY_METRIC = m.key; haptic(); render.keepScroll = true; render(); },
  }))));

  let chart;
  if (metric.kind === 'multi') {
    const d = metric.data(PLAN, SETTINGS, now);
    chart = multiBarChart({
      labels: d.labels, subs: d.subs, series: d.series, stacked: !!metric.stacked,
      format: metric.format, unit: metric.unit, label: metric.label, height: 182,
    });
  } else if (metric.kind === 'bar') {
    chart = barChart({
      bars: metric.bars(PLAN, SETTINGS, now), color: metric.color,
      format: metric.format, unit: metric.unit, label: metric.label, height: 168,
    });
  } else {
    chart = lineChart({
      points: metric.series(PLAN, SETTINGS, now), color: metric.color,
      format: metric.format, unit: metric.unit, label: metric.label,
      invert: metric.invert, zeroBased: metric.zeroBased, height: 186,
      compare: metric.compare ? metric.compare(PLAN, SETTINGS, now) : null,
    });
  }

  out.push(card([
    el('div', { class: 'card-title', text: metric.label }),
    chart,
    metric.note ? el('div', { class: 'muted small', style: 'margin-top:10px', text: metric.note }) : null,
  ]));

  if (metric.kind === 'line') {
    const pts = metric.series(PLAN, SETTINGS, now);
    if (pts.length) {
      const values = pts.map((p) => p.value);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const first = values[0];
      const last = values[values.length - 1];
      const delta = last - first;
      const better = metric.invert ? -delta : delta;
      out.push(card([
        el('div', { class: 'recap' }, [
          ['Zuletzt', metric.format(last)],
          ['Ø', metric.format(avg)],
          ['Tiefster', metric.format(Math.min.apply(null, values))],
          ['Höchster', metric.format(Math.max.apply(null, values))],
        ].map((t) => el('div', { class: 'recap-cell' }, [
          el('div', { class: 'recap-val', text: t[1] }),
          el('div', { class: 'recap-title', text: t[0] }),
        ]))),
        pts.length > 1 ? el('div', { class: 'kv' }, [
          el('span', { text: 'Seit ' + fmtDateShort(pts[0].date) }),
          el('strong', {
            text: (delta > 0 ? '+' : '') + metric.format(delta).replace(/^\+/, ''),
            style: 'color:' + (Math.abs(better) < 1e-9 ? 'var(--text)'
              : better > 0 ? 'var(--status-done)' : 'var(--status-missed)'),
          }),
          el('span', { class: 'muted', text: pts.length + ' Messwerte' }),
        ]) : null,
      ]));
    }
  }

  if (metric.kind === 'bar') {
    const bars = metric.bars(PLAN, SETTINGS, now).filter((b) => b.value);
    if (bars.length) {
      const values = bars.map((b) => b.value);
      const sum = values.reduce((a, b) => a + b, 0);
      out.push(card([
        el('div', { class: 'recap' }, [
          ['Summe', metric.format(sum)],
          ['Ø', metric.format(sum / values.length)],
          ['Höchster', metric.format(Math.max.apply(null, values))],
          ['Zuletzt', metric.format(values[values.length - 1])],
        ].map((t) => el('div', { class: 'recap-cell' }, [
          el('div', { class: 'recap-val', text: t[1] }),
          el('div', { class: 'recap-title', text: t[0] }),
        ]))),
      ]));
    }
  }

  out.push(el('div', { class: 'muted small', style: 'margin:4px 4px 0',
    text: 'Zum Ablesen mit dem Finger über die Kurve fahren.' }));
  return out;
}

function viewMehr() {
  const out = [];
  out.push(sectionTitle('Einstellungen'));

  out.push(card([
    el('div', { class: 'card-title', text: 'Darstellung' }),
    segmented([
      { key: 'auto', label: 'Wie Gerät' },
      { key: 'dark', label: 'Dunkel' },
      { key: 'light', label: 'Hell' },
    ], SETTINGS.phone_theme || 'auto', (key) => {
      SETTINGS.phone_theme = key; persist(); applyTheme(); render();
    }),
  ]));

  const tt = input('text', fmtDuration(SETTINGS.target_time_min * 60), { placeholder: 'h:mm:ss' });
  out.push(card([
    el('div', { class: 'card-title', text: 'Zielzeit' }),
    row('Marathon', tt),
    el('div', { class: 'muted small', text: 'Zielpace ' + fmtPace(targetPaceSPerKm(SETTINGS)) }),
    actionButton('Speichern', () => {
      const s = parseDuration(tt.value);
      if (!s) return alert('Bitte als h:mm:ss eingeben.');
      SETTINGS.target_time_min = Math.round(s / 60); persist(); render();
    }, 'ghost'),
  ]));

  const vo2 = input('text', vo2maxOf(SETTINGS), { inputmode: 'decimal', placeholder: 'z. B. 48' });
  const lthr = input('text', lactateHr(SETTINGS), { inputmode: 'numeric', placeholder: 'bpm' });
  const ltp = input('text', lactatePace(SETTINGS) ? fmtMinSec(lactatePace(SETTINGS)) : '', { placeholder: 'm:ss' });
  out.push(card([
    el('div', { class: 'card-title', text: 'Form' }),
    row('VO2max', vo2),
    row('Schwellenpuls', lthr),
    row('Schwellen-Pace', ltp),
    el('div', { class: 'muted small', text: 'Beim Speichern werden die Zonen proportional auf den neuen Schwellenpuls geeicht – die Z4-Obergrenze ist per Modell die Schwelle.' }),
    actionButton('Speichern', () => {
      const v = num(vo2.value);
      if (v && v !== vo2maxOf(SETTINGS)) {
        SETTINGS.vo2max_history = (SETTINGS.vo2max_history || [])
          .filter((e) => e.date !== today())
          .concat([{ date: today(), value: v }]);
      }
      const hr = num(lthr.value);
      const pace = ltp.value ? parseDuration(ltp.value) : null;
      if (hr || pace) setLactateThreshold(SETTINGS, hr, pace, today(), true);
      persist(); render();
    }, 'ghost'),
  ]));

  out.push(paceTableCard());

  const rr = SETTINGS.recent_race || {};
  const rrKm = input('text', rr.distance_km, { inputmode: 'decimal', placeholder: 'km' });
  const rrT = input('text', rr.duration_s ? fmtDuration(rr.duration_s) : '', { placeholder: 'h:mm:ss' });
  const rrD = input('date', rr.date || today());
  out.push(card([
    el('div', { class: 'card-title', text: 'Letztes Rennen' }),
    el('div', { class: 'grid2' }, [row('Distanz', rrKm), row('Zeit', rrT)]),
    row('Datum', rrD),
    actionButton('Speichern', () => {
      const km = num(rrKm.value); const s = parseDuration(rrT.value);
      if (!km || !s) return alert('Distanz und Zeit angeben.');
      SETTINGS.recent_race = { distance_km: km, duration_s: s, date: rrD.value || today() };
      persist(); render();
    }, 'ghost'),
  ]));

  out.push(sectionTitle('Herzfrequenzzonen'));
  const zoneInputs = SETTINGS.zones.map((z) => {
    const lo = input('text', z.min_bpm, { inputmode: 'numeric' });
    const hi = input('text', z.max_bpm, { inputmode: 'numeric' });
    return { zone: z, lo: lo, hi: hi };
  });
  out.push(card(zoneInputs.map((zi) => el('div', { class: 'zone-row' }, [
    el('span', { class: 'zone-dot', style: 'background:' + (DATA.ZONE_COLOR[zi.zone.zone] || '#888') }),
    el('span', { class: 'zone-name', text: zi.zone.zone + ' · ' + zi.zone.name }),
    zi.lo, el('span', { class: 'muted', text: '–' }), zi.hi,
  ])).concat([
    actionButton('Zonen speichern', () => {
      let changed = false;
      zoneInputs.forEach((zi) => {
        const lo = num(zi.lo.value); const hi = num(zi.hi.value);
        if (lo && Math.round(lo) !== zi.zone.min_bpm) { zi.zone.min_bpm = Math.round(lo); changed = true; }
        if (hi && Math.round(hi) !== zi.zone.max_bpm) { zi.zone.max_bpm = Math.round(hi); changed = true; }
      });
      if (changed) touchZones(SETTINGS);
      persist(); render();
    }, 'ghost'),
  ])));

  out.push(sectionTitle('Wochenrhythmus'));
  out.push(rhythmCard());

  const shelf = shoeShelfCard();
  const snap = garminCard();
  if (shelf || snap) {
    out.push(sectionTitle('Von der Uhr'));
    if (snap) out.push(snap);
    if (shelf) out.push(shelf);
  }

  out.push(sectionTitle('Abgleich mit dem Rechner'));
  const tok = input('password', SETTINGS.sync_token, {
    placeholder: 'ghp_… (Recht "gist")', autocomplete: 'off', autocapitalize: 'off',
    autocorrect: 'off', spellcheck: 'false',
  });
  const gist = input('text', SETTINGS.sync_gist_id, {
    placeholder: 'wird beim ersten Abgleich selbst gefunden', autocapitalize: 'off',
  });
  const auto = el('input', { type: 'checkbox' });
  auto.checked = SETTINGS.sync_auto !== false;
  const syncStatus = el('div', { class: 'muted small', text: SETTINGS.sync_last
    ? 'zuletzt: ' + SETTINGS.sync_last.replace('T', ' ').replace('Z', ' UTC')
    : 'noch nie abgeglichen' });
  out.push(card([
    el('div', { class: 'note', text: 'Beide Geräte legen denselben Plan in einem '
      + 'privaten GitHub-Gist ab. Je Einheit gilt die zuletzt veränderte Fassung. '
      + 'Zugangsdaten (Garmin, KI) bleiben auf dem jeweiligen Gerät.' }),
    row('GitHub-Token', tok),
    row('Gist-ID', gist),
    el('label', { class: 'field switch' }, [
      auto, el('span', { class: 'field-label', text: 'Beim Öffnen automatisch abgleichen' }),
    ]),
    syncStatus,
    el('div', { class: 'btn-row wide' }, [
      actionButton('Speichern', () => {
        SETTINGS.sync_token = tok.value.trim();
        SETTINGS.sync_gist_id = gist.value.trim();
        SETTINGS.sync_auto = auto.checked;
        persist(); render();
      }, 'ghost'),
      actionButton('⇅ Abgleichen', () => {
        SETTINGS.sync_token = tok.value.trim();
        SETTINGS.sync_gist_id = gist.value.trim();
        SETTINGS.sync_auto = auto.checked;
        persist();
        syncStatus.textContent = 'läuft …';
        doSync(true).then((msg) => { syncStatus.textContent = msg; });
      }, 'primary'),
    ]),
    el('div', { class: 'btn-row wide' }, [
      actionButton('Ablage überschreiben', () => {
        if (!confirm('Der Stand dieses Geräts ersetzt alles, was in der Ablage liegt. '
          + 'Was nur auf dem Rechner erfasst und noch nicht abgeglichen wurde, geht '
          + 'dabei verloren.\n\nFortfahren?')) return;
        SETTINGS.sync_token = tok.value.trim();
        SETTINGS.sync_gist_id = gist.value.trim();
        persist();
        syncStatus.textContent = 'läuft …';
        doSync(true, 'push').then((msg) => { syncStatus.textContent = msg; });
      }, 'ghost'),
    ]),
    el('div', { class: 'muted small', text: 'Token holen: github.com/settings/tokens → '
      + '"Generate new token (classic)" → Haken bei "gist". Denselben Token auch in '
      + 'der Desktop-App eintragen.' }),
  ]));

  out.push(sectionTitle('Daten'));
  out.push(card([
    el('div', { class: 'note', text: 'Alles liegt lokal auf diesem Gerät. Der Export ist die Brücke zur Desktop-App – und deine Sicherung.' }),
    el('div', { class: 'btn-row wide' }, [
      actionButton('Exportieren', () => {
        const blob = new Blob([exportAll(PLAN, SETTINGS)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = el('a', { href: url, download: 'marathon-planer-' + today() + '.json' });
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, 'ghost'),
      actionButton('Importieren', () => {
        const f = el('input', { type: 'file', accept: '.json,application/json' });
        f.addEventListener('change', () => {
          const file = f.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const data = importAll(String(reader.result));
              PLAN = data.plan; SETTINGS = data.settings;
              sweepMissed(PLAN); persist(); render();
              alert('Übernommen: ' + PLAN.sessions.length + ' Einheiten.');
            } catch (e) { alert('Import fehlgeschlagen: ' + e.message); }
          };
          reader.readAsText(file);
        });
        f.click();
      }, 'ghost'),
    ]),
    el('div', { class: 'btn-row wide' }, [
      actionButton('Plan neu erzeugen', () => {
        if (!confirm('Der ganze Plan wird neu aufgebaut. Alles Erfasste geht verloren. Sicher?')) return;
        openStartSheet(true);
      }, 'danger'),
    ]),
  ]));

  out.push(el('div', { class: 'about' }, [
    el('div', { text: 'Marathon Planer · iPhone-Fassung' }),
    el('div', { class: 'muted small', text: 'Plandaten aus MarathonTrainingsplan_Zuerich_2027_Schluss.pdf · ' + DATA.WEEKS.length + ' Wochen · Planversion ' + DATA.PLAN_VERSION }),
    el('div', { class: 'muted small', text: 'Garmin-Abgleich, Uhr-Upload und KI-Coach bleiben der Desktop-App vorbehalten.' }),
  ]));
  return out;
}

function paceTableCard() {
  const now = today();
  const v = currentVdot(PLAN, SETTINGS, now) || garminVdot(SETTINGS);
  if (!v) {
    return card([
      el('div', { class: 'card-title', text: 'Trainingstempi' }),
      el('div', { class: 'note', text: 'Noch zu wenig erfasst. Sobald ein paar '
        + 'Läufe mit Puls oder Anstrengung drin sind – oder ein Rennergebnis '
        + 'oben steht – stehen hier die fünf Bereiche.' }),
    ]);
  }
  const paces = trainingPaces(v.vdot);
  const labels = { E: 'Locker (E)', M: 'Marathon (M)', T: 'Schwelle (T)',
    I: 'Intervall (I)', R: 'Wiederholung (R)' };
  const rows = ['E', 'M', 'T', 'I', 'R'].map((cat) => el('div', { class: 'kv' }, [
    el('span', { text: labels[cat] }),
    el('strong', { text: fmtPaceRange(paces[cat][0], paces[cat][1]) }),
  ]));

  const own = [];
  [[TrainingType.RECOVERY, 'Rekom'], [TrainingType.EASY, 'Locker'],
    [TrainingType.LONG_RUN, 'Longrun']].forEach((r) => {
    const range = easyPaceFor({ training_type: r[0], hr_zone: Zone.NONE }, PLAN, now);
    if (range && range[0] && range[1]) {
      own.push(el('div', { class: 'kv' }, [
        el('span', { text: r[1] }),
        el('strong', { text: fmtPaceRange(range[0], range[1]) }),
      ]));
    }
  });

  return card([
    el('div', { class: 'card-title', text: 'Trainingstempi' }),
    el('div', { class: 'kv' }, [
      el('span', { text: 'VDOT' }),
      el('strong', { text: v.vdot.toFixed(1) }),
      el('span', { class: 'muted', text: v.source }),
    ]),
  ].concat(rows).concat(own.length
    ? [el('div', { class: 'card-title', style: 'margin-top:14px', text: 'Deine eigene Locker-Pace' })]
      .concat(own)
      .concat([el('div', { class: 'muted small', text: 'Gemessen aus deinen '
        + 'Läufen, nicht aus der Formel – du läufst locker bewusst langsamer, '
        + 'als Daniels vorgibt. Die Abstände zwischen den dreien stammen aus '
        + 'Kapitel 1 des Plans.' })])
    : []));
}

function rhythmCard() {
  const current = Object.assign({}, DEFAULT_RHYTHM, SETTINGS.week_rhythm || {});
  const auto = el('input', { type: 'checkbox' });
  auto.checked = SETTINGS.rhythm_auto !== false;
  const rows = RETYPE_TYPES.filter((t) => t !== TrainingType.OTHER).map((t) => {
    const picked = current[t];
    const cells = WEEKDAYS_SHORT.map((wd, i) => el('button', {
      class: 'wd-pill tap' + (picked === i ? ' active' : ''),
      type: 'button', text: wd, 'aria-label': t + ' am ' + WEEKDAYS_DE[i],
      onclick: (e) => {
        current[t] = (current[t] === i) ? null : i;
        SETTINGS.week_rhythm = current;
        persist(); haptic();
        const parent = e.target.parentNode;
        [...parent.children].forEach((c, ci) => c.classList.toggle('active', current[t] === ci));
      },
    }));
    return el('div', { class: 'rhythm-row' }, [
      el('span', { class: 'dot', style: 'background:' + typeColor(t) }),
      el('span', { class: 'rhythm-name', text: t }),
      el('div', { class: 'wd-row' }, cells),
    ]);
  });
  return card([
    el('div', { class: 'note', text: 'Der Plan sagt, was eine Woche enthält – '
      + 'nie wann. Hier steht deine Antwort darauf; „⟳ Auto" auf dem '
      + 'Wochenbrett verteilt danach.' }),
  ].concat(rows).concat([
    el('label', { class: 'field switch' }, [
      auto, el('span', { class: 'field-label', text: 'Neue Wochen von selbst verteilen' }),
    ]),
    actionButton('Speichern', () => {
      SETTINGS.week_rhythm = current;
      SETTINGS.rhythm_auto = auto.checked;
      persist(); render();
    }, 'ghost'),
  ]));
}

function shoeShelfCard() {
  const shoes = ((SETTINGS.garmin || {}).shoes || []).filter((sh) => sh && sh.name);
  if (!shoes.length) return null;
  const sorted = shoes.slice().sort((a, b) => shoeWear(b) - shoeWear(a));
  return card([el('div', { class: 'card-title', text: 'Laufschuhe' })].concat(
    sorted.map((sh) => {
      const share = shoeWear(sh);
      const col = share >= 1 ? 'var(--status-missed)'
        : share >= 0.8 ? '#fb923c' : 'var(--status-done)';
      const bits = [];
      if (sh.activities) bits.push(sh.activities + ' Aktivitäten');
      if (sh.since) bits.push('seit ' + fmtDateShort(String(sh.since).slice(0, 10)));
      return el('div', { class: 'shoe' }, [
        el('div', { class: 'shoe-head' }, [
          el('span', { class: 'shoe-name', text: sh.name }),
          el('strong', { text: Math.round(sh.km || 0) + ' / ' + Math.round(sh.max_km || 0) + ' km' }),
        ]),
        el('div', { class: 'bar' }, [
          el('span', { style: 'width:' + Math.round(Math.min(1, share) * 100) + '%;background:' + col }),
        ]),
        bits.length ? el('div', { class: 'muted small', text: bits.join(' · ') }) : null,
      ]);
    })
  ).concat([
    el('div', { class: 'muted small', text: 'Gepflegt wird das in Garmin Connect – '
      + 'hier steht nur, was von dort kommt.' }),
  ]));
}

function garminCard() {
  const g = SETTINGS.garmin || {};
  const rows = [];
  const add = (label, value, sub) => {
    if (value === null || value === undefined || value === '') return;
    rows.push(el('div', { class: 'kv' }, [
      el('span', { text: label }), el('strong', { text: String(value) }),
      sub ? el('span', { class: 'muted', text: sub }) : null,
    ]));
  };
  add('Trainingszustand', g.training_status, g.training_load ? 'Belastung ' + g.training_load : '');
  add('Trainingsbereitschaft', g.readiness_score, g.readiness_level || '');
  if (g.acwr !== null && g.acwr !== undefined) {
    add('Belastung akut/chronisch', Number(g.acwr).toFixed(2).replace('.', ','), g.acwr_status || '');
  }
  add('Belastungsfokus', g.load_balance_feedback, '');
  if (g.heat_acclimation) add('Hitzeanpassung', g.heat_acclimation + ' %', '');
  if (g.altitude_acclimation) add('Höhenanpassung', g.altitude_acclimation + ' %', '');
  [['5 km', g.race_5k_s], ['10 km', g.race_10k_s], ['Halbmarathon', g.race_half_s],
    ['Marathon', g.race_marathon_s]].forEach((r) => {
    if (r[1]) add('Prognose ' + r[0], fmtDuration(r[1]), '');
  });
  [['5 km', g.pr_5k_s], ['10 km', g.pr_10k_s], ['Halbmarathon', g.pr_half_s],
    ['Marathon', g.pr_marathon_s]].forEach((r) => {
    if (r[1]) add('Bestzeit ' + r[0], fmtDuration(r[1]), '');
  });
  if (g.pr_longest_run_km) add('Längster Lauf je', fmtKm(g.pr_longest_run_km), '');
  if (!rows.length) return null;
  return card([
    el('div', { class: 'card-title', text: 'Garmins eigene Zahlen' }),
  ].concat(rows).concat([
    el('div', { class: 'muted small', text: (g.updated ? 'Stand ' + fmtDateShort(String(g.updated).slice(0, 10)) + ' · ' : '')
      + 'Kommt über den Abgleich vom Rechner. Das Telefon spricht nicht selbst '
      + 'mit Garmin – der Browser darf das nicht.' }),
  ]));
}


function openStartSheet(force) {
  openSheet(force ? 'Plan neu erzeugen' : 'Willkommen', (body) => {
    if (!force) {
      const tok = input('password', SETTINGS && SETTINGS.sync_token, {
        placeholder: 'ghp_… (Recht "gist")', autocomplete: 'off',
        autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false',
      });
      const status = el('div', { class: 'muted small', text: '' });
      body.appendChild(card([
        el('div', { class: 'card-title', text: 'Empfohlen' }),
        el('div', { class: 'note', text: 'Hol den Plan vom Rechner. Erfasste '
          + 'Einheiten, Tagebuch und Einstellungen kommen mit, und beide Geräte '
          + 'bleiben danach von selbst gleich.' }),
        row('GitHub-Token', tok),
        el('div', { class: 'muted small', text: 'Derselbe Token wie in der '
          + 'Desktop-App unter „Handy-Abgleich".' }),
        status,
        el('div', { class: 'btn-row wide' }, [
          actionButton('⇅ Plan vom Rechner holen', () => {
            const token = tok.value.trim();
            if (!token) { status.textContent = 'Bitte den Token einfügen.'; return; }
            SETTINGS = SETTINGS || defaultSettings();
            SETTINGS.sync_token = token;
            SETTINGS.sync_gist_id = '';
            PLAN = { version: DATA.PLAN_VERSION, start_date: today(),
                     target_date: DATA.MARATHON_DATE, sessions: [], diary: {}, deleted: {} };
            status.textContent = 'wird geholt …';
            runSync(PLAN, SETTINGS, 'iPhone').then((msg) => {
              if (!PLAN.sessions.length) {
                status.textContent = 'In der Ablage liegt noch kein Plan. '
                  + 'Zuerst am Rechner einmal abgleichen.';
                PLAN = null;
                return;
              }
              sweepMissed(PLAN); persist(); BOARD_MONDAY = null;
              render(); closeSheet();
            }).catch((e) => {
              PLAN = null;
              status.textContent = e.message || String(e);
            });
          }, 'primary'),
        ]),
      ]));

      body.appendChild(card([
        el('div', { class: 'card-title', text: 'Ohne Token' }),
        el('div', { class: 'note', text: 'Am Rechner unter „Mehr → Daten" '
          + 'exportieren und die Datei hier übernehmen.' }),
        el('div', { class: 'btn-row wide' }, [
          actionButton('Aus Datei übernehmen', () => {
            const f = el('input', { type: 'file', accept: '.json,application/json' });
            f.addEventListener('change', () => {
              const file = f.files[0]; if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  const data = importAll(String(reader.result));
                  PLAN = data.plan; SETTINGS = data.settings;
                  sweepMissed(PLAN); persist(); BOARD_MONDAY = null; render(); closeSheet();
                } catch (e) { alert('Import fehlgeschlagen: ' + e.message); }
              };
              reader.readAsText(file);
            });
            f.click();
          }, 'ghost'),
        ]),
      ]));
    }

    const start = input('date', today());
    const target = input('date', DATA.MARATHON_DATE);
    body.appendChild(card([
      el('div', { class: 'card-title', text: force ? 'Neuer Plan' : 'Nur ohne bestehenden Plan' }),
      el('div', { class: 'note', text: force
        ? 'Der Plan enthält ' + DATA.WEEKS.length + ' Wochen bis zum Renntag. Ist weniger '
          + 'Zeit, wird die Wintergrundlage ausgedünnt – nie das Tapering.'
        : 'Nur wählen, wenn es noch keinen Plan auf dem Rechner gibt. Sonst '
          + 'entsteht ein zweiter, und beim Abgleich steht jede Woche doppelt da.' }),
      row('Start', start),
      row('Renntag', target),
      el('div', { class: 'btn-row wide' }, [
        actionButton(force ? 'Plan erzeugen' : 'Trotzdem neu erzeugen', () => {
          try {
            PLAN = generatePlan(start.value, target.value);
            sweepMissed(PLAN);
            if (!SETTINGS) SETTINGS = defaultSettings();
            persist(); BOARD_MONDAY = null; render(); closeSheet();
          } catch (e) { alert(e.message); }
        }, force ? 'primary' : 'ghost'),
      ]),
    ]));
  });
}


let syncing = false;

async function doSync(manual, mode) {
  if (syncing) return 'läuft schon';
  if (!hasSyncCredentials(SETTINGS)) {
    return manual ? 'Kein Token hinterlegt.' : '';
  }
  syncing = true;
  try {
    const msg = mode === 'push'
      ? await pushOnly(PLAN, SETTINGS, 'iPhone')
      : await runSync(PLAN, SETTINGS, 'iPhone');
    persist();
    render.keepScroll = true;
    render();
    if (manual) haptic();
    return msg;
  } catch (e) {
    const offline = !navigator.onLine;
    const msg = offline ? 'Kein Netz – Abgleich später' : (e.message || String(e));
    if (manual && !offline) alert(msg);
    return msg;
  } finally {
    syncing = false;
  }
}


function tabIcon(paths) {
  return '<svg viewBox="0 0 24 24" width="25" height="25" fill="none" '
    + 'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
    + 'stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
}

const TAB_ICONS = {
  heute: tabIcon('<circle cx="12" cy="12" r="8.6"/>'
    + '<circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/>'),
  woche: tabIcon('<rect x="3.2" y="5" width="17.6" height="16" rx="3.2"/>'
    + '<path d="M3.2 10h17.6"/><path d="M8.2 3v4"/><path d="M15.8 3v4"/>'),
  plan: tabIcon('<path d="M8.5 6.5h12"/><path d="M8.5 12h12"/><path d="M8.5 17.5h12"/>'
    + '<circle cx="4" cy="6.5" r="1.1" fill="currentColor" stroke="none"/>'
    + '<circle cx="4" cy="12" r="1.1" fill="currentColor" stroke="none"/>'
    + '<circle cx="4" cy="17.5" r="1.1" fill="currentColor" stroke="none"/>'),
  tagebuch: tabIcon('<path d="M12 7.2C10.4 5.9 8.4 5.2 6 5.2H4v13h2c2.4 0 4.4.7 6 2"/>'
    + '<path d="M12 7.2c1.6-1.3 3.6-2 6-2h2v13h-2c-2.4 0-4.4.7-6 2"/>'
    + '<path d="M12 7.2v13"/>'),
  mehr: tabIcon('<circle cx="5.5" cy="12" r="1.5" fill="currentColor" stroke="none"/>'
    + '<circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>'
    + '<circle cx="18.5" cy="12" r="1.5" fill="currentColor" stroke="none"/>'),
};

const VIEWS = {
  heute: { label: 'Heute', build: viewHeute },
  woche: { label: 'Woche', build: viewWoche },
  plan: { label: 'Plan', build: viewPlan },
  tagebuch: { label: 'Tagebuch', build: viewTagebuch },
  mehr: { label: 'Mehr', build: viewMehr },
};

function render() {
  const app = $('#app');
  if (!app) return;
  const scroll = app.scrollTop;
  app.textContent = '';
  app.classList.toggle('enter', !render.keepScroll);
  if (!PLAN) { app.appendChild(card([el('div', { class: 'note', text: 'Noch kein Plan.' })])); return; }
  withMemo(() => VIEWS[VIEW].build()).forEach((n) => app.appendChild(n));
  app.scrollTop = render.keepScroll ? scroll : 0;
  render.keepScroll = true;
  $('#title').textContent = VIEWS[VIEW].label;
  [...document.querySelectorAll('.tab')].forEach((t) => {
    t.classList.toggle('active', t.dataset.view === VIEW);
  });
}

function switchView(name) {
  if (VIEW === name) return;
  VIEW = name;
  render.keepScroll = false;
  haptic();
  render();
}

function buildFrame() {
  const tabs = el('nav', { class: 'tabbar' }, Object.keys(VIEWS).map((k) => el('button', {
    class: 'tab', 'data-view': k, type: 'button', onclick: () => switchView(k),
    'aria-label': VIEWS[k].label,
  }, [
    el('span', { class: 'tab-icon', html: TAB_ICONS[k] }),
    el('span', { class: 'tab-label', text: VIEWS[k].label }),
  ])));
  document.body.appendChild(el('header', { class: 'topbar glass-strong' }, [
    el('h1', { id: 'title', text: 'Heute' }),
  ]));
  document.body.appendChild(el('main', { id: 'app' }, []));
  document.body.appendChild(tabs);
}

export function boot() {
  buildFrame();
  SETTINGS = loadSettings();
  applyTheme();
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    applyTheme();
    render();
  });
  PLAN = loadPlan();
  if (PLAN) {
    if (sweepMissed(PLAN)) savePlan(PLAN);
    render();
  } else {
    render();
    openStartSheet(false);
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  if (PLAN && SETTINGS.sync_auto !== false && hasSyncCredentials(SETTINGS)) {
    setTimeout(() => doSync(false), 900);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') return;
    if (PLAN && SETTINGS.sync_auto !== false && hasSyncCredentials(SETTINGS)) doSync(false);
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}
