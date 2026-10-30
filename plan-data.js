
export const PLAN_VERSION = 6;

export const MARATHON_DATE = "2027-04-11";

export const MARATHON_DISTANCE_KM = 42.195;

export const PHASES = [
 "PHASE 1: GRUNDLAGENAUFBAU",
 "PHASE 2: AUFBAU & TEMPOHÄRTE",
 "PHASE 3: WINTERGRUNDLAGE",
 "PHASE 4: MARATHONSPEZIFISCH",
 "PHASE 5: TAPER"
];

export const DEFAULT_ZONES = [
 {
  "zone": "Z1",
  "name": "Regeneration",
  "min_bpm": 100,
  "max_bpm": 138
 },
 {
  "zone": "Z2",
  "name": "Grundlagen",
  "min_bpm": 139,
  "max_bpm": 155
 },
 {
  "zone": "Z3",
  "name": "Marathon-Tempo",
  "min_bpm": 156,
  "max_bpm": 175
 },
 {
  "zone": "Z4",
  "name": "Schwelle",
  "min_bpm": 176,
  "max_bpm": 186
 },
 {
  "zone": "Z5",
  "name": "Spitzenbereich",
  "min_bpm": 187,
  "max_bpm": 200
 }
];

export const DEFAULT_LACTATE_HR = 186;

export const TYPE_COLOR = {
 "Intervall": "#f472b6",
 "Tempolauf": "#fb923c",
 "Langer Lauf": "#60a5fa",
 "Lockerer Lauf": "#34d399",
 "Recovery": "#22d3ee",
 "Krafttraining": "#d8b4fe",
 "Pause": "#64748b",
 "Wettkampf": "#ff5a1f",
 "Andere Aktivität": "#94a3b8"
};

export const STATUS_COLOR = {
 "erledigt": "#34d399",
 "ausstehend": "#fbbf24",
 "keine Zeit": "#f87171"
};

export const ZONE_COLOR = {
 "Z1": "#22d3ee",
 "Z2": "#34d399",
 "Z3": "#fbbf24",
 "Z4": "#fb923c",
 "Z5": "#f87171",
 "Keine Vorgabe": "#a3a9b5"
};

export const TYPE_ICON = {
 "Intervall": "●",
 "Tempolauf": "●",
 "Langer Lauf": "●",
 "Lockerer Lauf": "●",
 "Recovery": "●",
 "Krafttraining": "●",
 "Pause": "●",
 "Wettkampf": "●",
 "Andere Aktivität": "●"
};

export const PALETTE = {
 "BG_ROOT": "#050608",
 "BG_SIDEBAR": "#0a0b0e",
 "BG_CARD": "#121418",
 "BG_CARD_HOVER": "#1a1d23",
 "BG_ELEVATED": "#22262d",
 "BORDER_SUBTLE": "#22262d",
 "TEXT": "#f7f8fa",
 "TEXT_MUTED": "#a3a9b5",
 "TEXT_FAINT": "#7a818e",
 "ACCENT": "#ff5a1f",
 "ACCENT_HOVER": "#ff7a48",
 "ON_ACCENT": "#101216",
 "LIGHT": false,
 "RADIUS_CARD": 18,
 "RADIUS_TILE": 16,
 "RADIUS_CTRL": 12,
 "RADIUS_CHIP": 14,
 "BORDER_CARD": 0,
 "USE_ICONS": true,
 "SIDEBAR_WIDTH": 252,
 "RAIL_WIDTH": 76
};

export const LIGHT_COLORS = {
 "TYPE_COLOR": {
  "Intervall": "#be185d",
  "Tempolauf": "#c2410c",
  "Langer Lauf": "#1d4ed8",
  "Lockerer Lauf": "#047857",
  "Recovery": "#0e7490",
  "Krafttraining": "#9333ea",
  "Pause": "#475569",
  "Wettkampf": "#d9420b",
  "Andere Aktivität": "#64748b"
 },
 "STATUS_COLOR": {
  "erledigt": "#047857",
  "ausstehend": "#b45309",
  "keine Zeit": "#b91c1c"
 },
 "ZONE_COLOR": {
  "Z1": "#0e7490",
  "Z2": "#047857",
  "Z3": "#a16207",
  "Z4": "#c2410c",
  "Z5": "#b91c1c",
  "Keine Vorgabe": "#4b5563"
 },
 "PALETTE": {
  "BG_ROOT": "#eef0f3",
  "BG_SIDEBAR": "#f7f8fa",
  "BG_CARD": "#ffffff",
  "BG_CARD_HOVER": "#f3f4f6",
  "BG_ELEVATED": "#e5e7eb",
  "BORDER_SUBTLE": "#dfe2e7",
  "TEXT": "#0d1014",
  "TEXT_MUTED": "#4b5563",
  "TEXT_FAINT": "#667080",
  "ACCENT": "#d9420b",
  "ACCENT_HOVER": "#b93607",
  "ON_ACCENT": "#ffffff",
  "LIGHT": true,
  "RADIUS_CARD": 18,
  "RADIUS_TILE": 16,
  "RADIUS_CTRL": 12,
  "RADIUS_CHIP": 14,
  "BORDER_CARD": 0,
  "USE_ICONS": true,
  "SIDEBAR_WIDTH": 252,
  "RAIL_WIDTH": 76
 }
};

export const AKTIVIERUNG_TEXT = "Aktivierung · Loop Band (5 Min.) – leichtestes Band, die Spannung darf nie abfallen. Vor Kraft B und vor jeder Qualitätseinheit.\n· Ausfallschritt mit Band (Monster Walk) – 15 Schritte hin und zurück\n· Seitliches Gehen mit Band – 15 je Richtung\n· Clamshell mit Band – 15 je Seite\n· Beckenheben mit Band – 15\n· Stehende Hüftabduktion – 15 je Bein";

export const AKTIVIERUNG_DURATION_MIN = 5;

export const KRAFT_A_TEXT = "Kraft A · Core und Stabilität (20 Min.) – zwei Durchgänge, Übungen direkt hintereinander, 60 Sek. Pause zwischen den Durchgängen.\n1. Unterarmstütz – 3× 45–60 Sek.\n2. Seitstütz – 3× 30–45 Sek. je Seite\n3. Copenhagen Plank – 2× 20–30 Sek. je Seite\n4. Bird Dog – 3× 10 je Seite\n5. Dead Bug – 3× 12 je Seite\n6. Superman – 3× 12\n7. Einbeinstand – 3× 10 je Bein (einbeiniges Kreuzheben: Oberkörper mit geradem Rücken nach vorne kippen, freies Bein streckt nach hinten)";

export const KRAFT_A_DURATION_MIN = 20;

export const KRAFT_B_TEXT = "Kraft B · Beine und Laufkraft (30 Min.) – Reihenfolge einhalten, 60–90 Sek. Pause zwischen den Sätzen, Bewegungstempo 2 Sek. runter / 1 Sek. hoch. Vorher immer die Aktivierungsroutine.\n1. Kniebeuge – 3× 15–20 (mit Loop Band über den Knien)\n2. Ausfallschritt rückwärts – 3× 10 je Bein\n3. Bulgarian Split Squat – 3× 8–12 je Bein\n4. Einbeiniges Wadenheben – 3× 15–20 je Bein (3 Sek. runter, gegen Achillesprobleme)\n5. Einbeinige Hüftbrücke – 3× 12 je Bein\n6. Nordic Hamstring Curl – 3× 5–8\n7. Step-up – 2× 12 je Bein\nDanach Mobility M1 (8 Min.).";

export const KRAFT_B_DURATION_MIN = 30;

export const KRAFT_B_REDUZIERT_TEXT = "Kraft B reduziert (Entlastungswoche) – dieselben sieben Übungen, aber nur 2 statt 3 Sätze. Kraft A fällt diese Woche weg.\n1. Kniebeuge – 2× 15–20\n2. Ausfallschritt rückwärts – 2× 10 je Bein\n3. Bulgarian Split Squat – 2× 8–12 je Bein\n4. Einbeiniges Wadenheben – 2× 15–20 je Bein\n5. Einbeinige Hüftbrücke – 2× 12 je Bein\n6. Nordic Hamstring Curl – 2× 5–8\n7. Step-up – 2× 12 je Bein\nDanach Mobility M1 (8 Min.).";

export const MOBILITY_TEXT = "Mobility M1 (8 Min., direkt nach jedem Lauf): Wadendehnung gestreckt und gebeugt, Hüftbeuger im Ausfallschritt, Hamstring im Stand, Taubensitz, Quadrizeps im Stand – je 30–45 Sek. pro Seite, statisch, nicht wippen.\nMobility M2 (12 Min., an jedem laufenfreien Tag): Katze–Kuh, BWS-Rotation, 90/90-Hüftrotation, Sprunggelenk zur Wand, Beinschwingen vor/zurück und seitlich, Zehengreifen – danach die komplette Routine M1.";

export const RACE_TARGETS = [
 210,
 225,
 240
];

export const RACE_STATIONS = [
 {
  "number": 1,
  "km": 3.8,
  "place": "Stadtrunde · Bellevue / Enge",
  "gel": 1,
  "times": [
   1140,
   1200,
   1320
  ]
 },
 {
  "number": 2,
  "km": 7.5,
  "place": "Richtung Erlenbach / Küsnacht",
  "gel": null,
  "times": [
   2220,
   2400,
   2580
  ]
 },
 {
  "number": 3,
  "km": 11.2,
  "place": "Küsnacht / Erlenbach",
  "gel": 2,
  "times": [
   3360,
   3600,
   3840
  ]
 },
 {
  "number": 4,
  "km": 15.0,
  "place": "Herrliberg",
  "gel": null,
  "times": [
   4500,
   4800,
   5160
  ]
 },
 {
  "number": 5,
  "km": 18.5,
  "place": "Meilen, vor dem Wendepunkt",
  "gel": 3,
  "times": [
   5520,
   5940,
   6360
  ]
 },
 {
  "number": 6,
  "km": 21.5,
  "place": "Wendepunkt Meilen",
  "gel": null,
  "times": [
   6420,
   6900,
   7380
  ]
 },
 {
  "number": 7,
  "km": 25.0,
  "place": "Herrliberg, Rückweg",
  "gel": 4,
  "times": [
   7440,
   7980,
   8520
  ]
 },
 {
  "number": 8,
  "km": 29.0,
  "place": "Erlenbach, Rückweg",
  "gel": null,
  "times": [
   8640,
   9300,
   9900
  ]
 },
 {
  "number": 9,
  "km": 32.5,
  "place": "Küsnacht, Rückweg",
  "gel": 5,
  "times": [
   9720,
   10380,
   11100
  ]
 },
 {
  "number": 10,
  "km": 36.0,
  "place": "Zollikon / Stadtgrenze",
  "gel": null,
  "times": [
   10740,
   11520,
   12300
  ]
 },
 {
  "number": 11,
  "km": 39.0,
  "place": "Zürich Seefeld",
  "gel": 6,
  "times": [
   11640,
   12480,
   13320
  ]
 },
 {
  "number": 12,
  "km": 42.2,
  "place": "Sechseläutenplatz · Ziel",
  "gel": null,
  "times": [
   12600,
   13500,
   14400
  ]
 }
];

export const RACE_CARBS = {
 "210": [
  69,
  74
 ],
 "225": [
  64,
  69
 ],
 "240": [
  60,
  65
 ]
};

export const RACE_GEL_CARBS_G = 40;

export const RACE_RULES = [
 "Gel immer mit Wasser, nie mit Iso – sonst stockt die Magenentleerung.",
 "Alle sechs Gels selbst tragen, von 1 bis 6 nummeriert, Aufrissecken eingekerbt.",
 "Nach Postennummer zählen, nicht nach Kilometerschild."
];

export const FUEL_MIN_DURATION_MIN = 60;

export const FALLBACK_WEIGHT_KG = 70;

export const WEEKS = [
 {
  "num": 1,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "25. Mai – 31. Mai 2026",
  "km_total": 30.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "Einstieg: Umfang vor Tempo. Jeder Lauf muss sich «unterhaltungsfähig» anfühlen.",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 7.0,
    "min": null,
    "text": "Locker + 4×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 7.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 11.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 5.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 2,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "1. Juni – 7. Juni 2026",
  "km_total": 33.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "Locker + 5×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 12.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 5.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 3,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "8. Juni – 14. Juni 2026",
  "km_total": 36.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z3",
    "km": 8.0,
    "min": null,
    "text": "Fahrtspiel: 6×1' zügig (Z3) / 2' Trab",
    "pace": "zügig = Z3 156–175"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 14.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 4,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "15. Juni – 21. Juni 2026",
  "km_total": 28.0,
  "strength": [
   "B-reduziert"
  ],
  "note": "ENTLASTUNGSWOCHE – Umfang bewusst runter, Körper baut jetzt auf.",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 7.0,
    "min": null,
    "text": "Locker + 4×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 7.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 4.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 5,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "22. Juni – 28. Juni 2026",
  "km_total": 38.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z4",
    "km": 9.0,
    "min": null,
    "text": "Hügel: 6×45 s bergauf kräftig, Trab zurück",
    "pace": "bergauf hart · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 15.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 6,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "29. Juni – 5. Juli 2026",
  "km_total": 40.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z4",
    "km": 9.0,
    "min": null,
    "text": "Hügel: 8×45 s bergauf, Trab zurück",
    "pace": "bergauf hart · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 9.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 16.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 7,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "6. Juli – 12. Juli 2026",
  "km_total": 43.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z3",
    "km": 10.0,
    "min": null,
    "text": "Fahrtspiel: 8×1' zügig (Z3) / 2' Trab",
    "pace": "zügig = Z3 156–175"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 9.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 18.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 8,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "13. Juli – 19. Juli 2026",
  "km_total": 32.0,
  "strength": [
   "B-reduziert"
  ],
  "note": "ENTLASTUNGSWOCHE",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "Locker + 5×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 7.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 12.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 5.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 9,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "20. Juli – 26. Juli 2026",
  "km_total": 44.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z4",
    "km": 10.0,
    "min": null,
    "text": "Hügel: 8×60 s bergauf, Trab zurück",
    "pace": "bergauf hart · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 18.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 10,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "27. Juli – 2. Aug 2026",
  "km_total": 47.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z3",
    "km": 11.0,
    "min": null,
    "text": "Tempodauerlauf: 3×8' Z3 / 2' Trab",
    "pace": "Z3 · 5:10–5:25"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 20.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 11,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "3. Aug – 9. Aug 2026",
  "km_total": 48.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z4",
    "km": 11.0,
    "min": null,
    "text": "Hügel: 10×60 s bergauf, Trab zurück",
    "pace": "bergauf hart · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 20.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 12,
  "phase": "PHASE 1: GRUNDLAGENAUFBAU",
  "dates": "10. Aug – 16. Aug 2026",
  "km_total": 36.0,
  "strength": [
   "B-reduziert"
  ],
  "note": "ENTLASTUNGSWOCHE – Abschluss Grundlagenblock. Kurzcheck: Schlaf, Puls, Motivation.",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "Locker + 6×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 14.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 13,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "17. Aug – 23. Aug 2026",
  "km_total": 46.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "Neuer Block: erstmals echte Schwellenarbeit. Nicht überziehen – 4:45–4:55/km ist die Obergrenze.",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 11.0,
    "min": null,
    "text": "Schwelle: 3×6' / 2' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 18.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 14,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "24. Aug – 30. Aug 2026",
  "km_total": 50.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 12.0,
    "min": null,
    "text": "Schwelle: 4×6' / 2' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 11.0,
    "min": null,
    "text": "Locker + 5×20 s Steig.",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 20.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 15,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "31. Aug – 6. Sept 2026",
  "km_total": 53.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 12.0,
    "min": null,
    "text": "Schwelle: 2×12' / 3' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 11.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 22.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 8.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 16,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "7. Sept – 13. Sept 2026",
  "km_total": 39.0,
  "strength": [
   "B-reduziert"
  ],
  "note": "ENTLASTUNGSWOCHE – Vorbereitung auf den 10-km-Test.",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 9.0,
    "min": null,
    "text": "Locker + 6×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 9.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 15.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 17,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "14. Sept – 20. Sept 2026",
  "km_total": 40.0,
  "strength": [],
  "note": "TESTWETTKAMPF 10 km. Ziel: ~44–46 min. Ergebnis dient als Referenz für alle weiteren Tempi.",
  "sessions": [
   {
    "slot": "WETTKAMPF",
    "type": "Tempolauf",
    "zone": "Z3",
    "km": 16.0,
    "min": null,
    "text": "WETTKAMPF 10 km + 3 km Ein-/2 km Auslaufen",
    "pace": ""
   },
   {
    "slot": "VORBEREITUNG",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Locker + 5×100 m flott",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "Locker + 3×1' im Wettkampftempo",
    "pace": "Renntempo"
   },
   {
    "slot": "AUSSCHÜTTELN",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 6.0,
    "min": null,
    "text": "Ausschütteln + 4×20 s",
    "pace": "Z2 · 5:55–6:30"
   }
  ]
 },
 {
  "num": 18,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "21. Sept – 27. Sept 2026",
  "km_total": 52.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "Nach dem Wettkampf zwei ruhige Tage einplanen.",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 11.0,
    "min": null,
    "text": "Locker + 6×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 12.0,
    "min": null,
    "text": "Schwelle: 5×6' / 2' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 22.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 19,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "28. Sept – 4. Okt 2026",
  "km_total": 55.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z4",
    "km": 12.0,
    "min": null,
    "text": "Intervalle: 6×3' Z4 / 2' Trab",
    "pace": "4:10–4:25 · Z4/5 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 12.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 24.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 20,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "5. Okt – 11. Okt 2026",
  "km_total": 41.0,
  "strength": [
   "B-reduziert"
  ],
  "note": "ENTLASTUNGSWOCHE",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 9.0,
    "min": null,
    "text": "Locker + 6×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 16.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 21,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "12. Okt – 18. Okt 2026",
  "km_total": 55.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 12.0,
    "min": null,
    "text": "Schwelle: 3×10' / 3' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 12.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 24.0,
    "min": null,
    "text": "Longrun, letzte 4 km zügig (Z3)",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 22,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "19. Okt – 25. Okt 2026",
  "km_total": 58.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "Umfangs-Höhepunkt des Herbstblocks.",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z4",
    "km": 13.0,
    "min": null,
    "text": "Intervalle: 5×4' Z4 / 2:30' Trab",
    "pace": "4:10–4:25 · Z4/5 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 12.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 26.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 23,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "26. Okt – 1. Nov 2026",
  "km_total": 44.0,
  "strength": [
   "B-reduziert"
  ],
  "note": "Mini-Taper für den Halbmarathon.",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 11.0,
    "min": null,
    "text": "Schwelle: 2×8' / 3' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 16.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 24,
  "phase": "PHASE 2: AUFBAU & TEMPOHÄRTE",
  "dates": "2. Nov – 8. Nov 2026",
  "km_total": 50.0,
  "strength": [],
  "note": "ZIELWETTKAMPF HERBST: Halbmarathon. Realistisch 1:38–1:45. Erste Verpflegungs-/Renngeneralprobe.",
  "sessions": [
   {
    "slot": "WETTKAMPF",
    "type": "Tempolauf",
    "zone": "Z3",
    "km": 26.0,
    "min": null,
    "text": "HALBMARATHON + Ein-/Auslaufen",
    "pace": ""
   },
   {
    "slot": "VORBEREITUNG",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Locker + 6×100 m flott",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "Locker + 3×2' im HM-Tempo",
    "pace": "4:40–4:50"
   },
   {
    "slot": "AUSSCHÜTTELN",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 6.0,
    "min": null,
    "text": "Ausschütteln + 4×20 s",
    "pace": "Z2 · 5:55–6:30"
   }
  ]
 },
 {
  "num": 25,
  "phase": "PHASE 3: WINTERGRUNDLAGE",
  "dates": "9. Nov – 15. Nov 2026",
  "km_total": 36.0,
  "strength": [
   "B-reduziert"
  ],
  "note": "REGENERATIONSWOCHE nach dem Halbmarathon. Kein Tempo, keine Ausnahmen.",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Recovery",
    "zone": "Z1",
    "km": 8.0,
    "min": null,
    "text": "Sehr locker (Z1–Z2)",
    "pace": "Z1 · 6:30–7:00"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 14.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 26,
  "phase": "PHASE 3: WINTERGRUNDLAGE",
  "dates": "16. Nov – 22. Nov 2026",
  "km_total": 46.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "Winterstart: Stirnlampe, Reflektoren, Zwiebelprinzip. Bei Eis lieber Laufband/Halle.",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Locker + 6×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 11.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 18.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 27,
  "phase": "PHASE 3: WINTERGRUNDLAGE",
  "dates": "23. Nov – 29. Nov 2026",
  "km_total": 50.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z4",
    "km": 11.0,
    "min": null,
    "text": "Hügel: 10×60 s bergauf, Trab zurück",
    "pace": "bergauf hart · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 11.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 20.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 8.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 28,
  "phase": "PHASE 3: WINTERGRUNDLAGE",
  "dates": "30. Nov – 6. Dez 2026",
  "km_total": 54.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 12.0,
    "min": null,
    "text": "Schwelle: 4×8' / 2' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 12.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 22.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 8.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 29,
  "phase": "PHASE 3: WINTERGRUNDLAGE",
  "dates": "7. Dez – 13. Dez 2026",
  "km_total": 41.0,
  "strength": [
   "B-reduziert"
  ],
  "note": "ENTLASTUNGSWOCHE",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 9.0,
    "min": null,
    "text": "Locker + 6×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 16.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 30,
  "phase": "PHASE 3: WINTERGRUNDLAGE",
  "dates": "14. Dez – 20. Dez 2026",
  "km_total": 51.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z4",
    "km": 12.0,
    "min": null,
    "text": "Hügel: 12×60 s bergauf, Trab zurück",
    "pace": "bergauf hart · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 12.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 20.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 31,
  "phase": "PHASE 3: WINTERGRUNDLAGE",
  "dates": "21. Dez – 27. Dez 2026",
  "km_total": 54.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 12.0,
    "min": null,
    "text": "Schwelle: 2×15' / 4' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 12.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 22.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 8.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 32,
  "phase": "PHASE 3: WINTERGRUNDLAGE",
  "dates": "28. Dez – 3. Jan 2027",
  "km_total": 45.0,
  "strength": [],
  "note": "Optionaler 10-km-Test. Wenn kein Wettkampf passt: 10 km Zeitfahren allein oder 5×1 km Z4.",
  "sessions": [
   {
    "slot": "WETTKAMPF",
    "type": "Tempolauf",
    "zone": "Z3",
    "km": 17.0,
    "min": null,
    "text": "TESTLAUF 10 km (z.B. Silvesterlauf) + Ein-/Auslaufen",
    "pace": ""
   },
   {
    "slot": "VORBEREITUNG",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 11.0,
    "min": null,
    "text": "Locker + 6×100 m flott",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 9.0,
    "min": null,
    "text": "Locker + 3×1' zügig",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "AUSSCHÜTTELN",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   }
  ]
 },
 {
  "num": 33,
  "phase": "PHASE 3: WINTERGRUNDLAGE",
  "dates": "4. Jan – 10. Jan 2027",
  "km_total": 38.0,
  "strength": [
   "B-reduziert"
  ],
  "note": "ENTLASTUNGSWOCHE über den Jahreswechsel. Danach beginnt die heisse Phase.",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Recovery",
    "zone": "Z1",
    "km": 8.0,
    "min": null,
    "text": "Sehr locker (Z1–Z2)",
    "pace": "Z1 · 6:30–7:00"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 9.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 15.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 34,
  "phase": "PHASE 4: MARATHONSPEZIFISCH",
  "dates": "11. Jan – 17. Jan 2027",
  "km_total": 52.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "Ab jetzt steht alles im Dienst des 11. April. Marathontempo (MRT) wird zum Leitwert.",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 11.0,
    "min": null,
    "text": "Schwelle: 3×8' / 2' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 12.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 22.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 35,
  "phase": "PHASE 4: MARATHONSPEZIFISCH",
  "dates": "18. Jan – 24. Jan 2027",
  "km_total": 55.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z3",
    "km": 12.0,
    "min": null,
    "text": "MRT: 3×3 km im Marathontempo / 3' Trab",
    "pace": "MRT 5:20 · Z3"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 12.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 24.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 36,
  "phase": "PHASE 4: MARATHONSPEZIFISCH",
  "dates": "25. Jan – 31. Jan 2027",
  "km_total": 58.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "Erster Longrun mit Tempo am Ende – genau das trainiert den Marathon.",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 12.0,
    "min": null,
    "text": "Schwelle: 5×6' / 2' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 13.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 26.0,
    "min": null,
    "text": "Longrun, letzte 6 km im MRT",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 37,
  "phase": "PHASE 4: MARATHONSPEZIFISCH",
  "dates": "1. Feb – 7. Feb 2027",
  "km_total": 44.0,
  "strength": [
   "B-reduziert"
  ],
  "note": "ENTLASTUNGSWOCHE",
  "sessions": [
   {
    "slot": "LAUF 1",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Locker + 6×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 10.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 18.0,
    "min": null,
    "text": "Longrun ruhig",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 38,
  "phase": "PHASE 4: MARATHONSPEZIFISCH",
  "dates": "8. Feb – 14. Feb 2027",
  "km_total": 62.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "Ab hier bei jedem Longrun über 20 km Gels und Getränk üben, alle 35–40 min.",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z3",
    "km": 12.0,
    "min": null,
    "text": "MRT: 2×5 km im Marathontempo / 4' Trab",
    "pace": "MRT 5:20 · Z3"
   },
   {
    "slot": "MITTELLANG",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 14.0,
    "min": null,
    "text": "Mittellanger Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 28.0,
    "min": null,
    "text": "Longrun, letzte 6 km im MRT · Verpflegung testen",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 8.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 39,
  "phase": "PHASE 4: MARATHONSPEZIFISCH",
  "dates": "15. Feb – 21. Feb 2027",
  "km_total": 64.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z4",
    "km": 13.0,
    "min": null,
    "text": "Intervalle: 6×3' Z4 / 2' Trab",
    "pace": "4:10–4:25 · Z4/5 · +2 km WU/CD"
   },
   {
    "slot": "MITTELLANG",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 15.0,
    "min": null,
    "text": "Mittellanger Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 28.0,
    "min": null,
    "text": "Longrun, letzte 8 km im MRT",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 8.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 40,
  "phase": "PHASE 4: MARATHONSPEZIFISCH",
  "dates": "22. Feb – 28. Feb 2027",
  "km_total": 53.0,
  "strength": [],
  "note": "FORMTEST Halbmarathon (~6 Wochen vor dem Ziel). Ergebnis × 2 + 10–12 min = realistische Marathonzeit.",
  "sessions": [
   {
    "slot": "WETTKAMPF",
    "type": "Tempolauf",
    "zone": "Z3",
    "km": 26.0,
    "min": null,
    "text": "HALBMARATHON-TEST + Ein-/Auslaufen",
    "pace": ""
   },
   {
    "slot": "VORBEREITUNG",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 11.0,
    "min": null,
    "text": "Locker + 6×100 m flott",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 9.0,
    "min": null,
    "text": "Locker + 3×2' im HM-Tempo",
    "pace": "4:40–4:50"
   },
   {
    "slot": "AUSSCHÜTTELN",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 7.0,
    "min": null,
    "text": "Ausschütteln + 4×20 s",
    "pace": "Z2 · 5:55–6:30"
   }
  ]
 },
 {
  "num": 41,
  "phase": "PHASE 4: MARATHONSPEZIFISCH",
  "dates": "1. März – 7. März 2027",
  "km_total": 66.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "Zweiter langer Lauf mit Tempo-Endteil. Generalprobe für Schuhe, Kleidung, Frühstück und Gels.",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 13.0,
    "min": null,
    "text": "Schwelle: 3×10' / 3' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "MITTELLANG",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 15.0,
    "min": null,
    "text": "Mittellanger Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 30.0,
    "min": null,
    "text": "Longrun, letzte 10 km im MRT · volle Renn-Verpflegung",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 8.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 42,
  "phase": "PHASE 4: MARATHONSPEZIFISCH",
  "dates": "8. März – 14. März 2027",
  "km_total": 67.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "PEAK-WOCHE. Höchster Umfang des gesamten Plans. Danach geht es nur noch bergab (im guten Sinn).",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z3",
    "km": 13.0,
    "min": null,
    "text": "MRT: 3×4 km im Marathontempo / 3' Trab",
    "pace": "MRT 5:20 · Z3"
   },
   {
    "slot": "MITTELLANG",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 14.0,
    "min": null,
    "text": "Mittellanger Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 32.0,
    "min": null,
    "text": "LÄNGSTER LONGRUN ruhig – Zeitlimit 3:15 h",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 8.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 43,
  "phase": "PHASE 4: MARATHONSPEZIFISCH",
  "dates": "15. März – 21. März 2027",
  "km_total": 59.0,
  "strength": [
   "A",
   "B"
  ],
  "note": "Letzter grosser Longrun. Ab nächster Woche: Taper.",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z4",
    "km": 12.0,
    "min": null,
    "text": "Schwelle: 4×8' / 2' Trab",
    "pace": "Z4 · 4:45–4:55 · +2 km WU/CD"
   },
   {
    "slot": "MITTELLANG",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 14.0,
    "min": null,
    "text": "Mittellanger Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 26.0,
    "min": null,
    "text": "Longrun mit 12 km im MRT (Blöcke à 4 km)",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 7.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 44,
  "phase": "PHASE 5: TAPER",
  "dates": "22. März – 28. März 2027",
  "km_total": 50.0,
  "strength": [
   "B-reduziert"
  ],
  "note": "TAPER 1 – Umfang −20 %, Intensität bleibt. Frische Beine sind jetzt wichtiger als Kilometer.",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Tempolauf",
    "zone": "Z3",
    "km": 11.0,
    "min": null,
    "text": "MRT: 2×4 km im Marathontempo / 3' Trab",
    "pace": "MRT 5:20 · Z3"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 11.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 22.0,
    "min": null,
    "text": "Longrun, letzte 5 km im MRT",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 6.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 45,
  "phase": "PHASE 5: TAPER",
  "dates": "29. März – 4. Apr 2027",
  "km_total": 40.0,
  "strength": [],
  "note": "TAPER 2 – Kraft nur noch als Mobility. Schlaf priorisieren (8–9 h). Startnummer und Anreise klären.",
  "sessions": [
   {
    "slot": "QUALITÄT",
    "type": "Intervall",
    "zone": "Z4",
    "km": 10.0,
    "min": null,
    "text": "Intervalle: 5×3' Z4 / 2' Trab",
    "pace": "4:10–4:25 · Z4/5 · +2 km WU/CD"
   },
   {
    "slot": "LOCKER",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 9.0,
    "min": null,
    "text": "Lockerer Dauerlauf",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "LONGRUN",
    "type": "Langer Lauf",
    "zone": "Z2",
    "km": 16.0,
    "min": null,
    "text": "Longrun locker",
    "pace": "Z2 · 6:00–6:30"
   },
   {
    "slot": "OPTIONAL",
    "type": "Recovery",
    "zone": "Z1",
    "km": 5.0,
    "min": null,
    "text": "Rekom (optional)",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 },
 {
  "num": 46,
  "phase": "PHASE 5: TAPER",
  "dates": "5. Apr – 11. Apr 2027",
  "km_total": 60.2,
  "strength": [],
  "note": "Ruhe. Startunterlagen holen, Spaziergang max. 20 min · WETTKAMPFWOCHE. Reihenfolge hier ausnahmsweise fix, weil sie am Renntag hängt. Regeneration · Woche 47–49 · 12. April – 2. Mai 2027 Erst gar nicht laufen, dann sehr locker aufbauen. Ein Ruhetag pro gelaufenem Rennkilometer, bevor es wieder hart wird.",
  "sessions": [
   {
    "slot": "WETTKAMPF",
    "type": "Wettkampf",
    "zone": "Z3",
    "km": 42.2,
    "min": null,
    "text": "ZÜRICH MARATHON · Sonntag, 11. April 2027",
    "pace": ""
   },
   {
    "slot": "6 TAGE VOR",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 8.0,
    "min": null,
    "text": "locker + 4×20 s Steigerungen",
    "pace": "Z2 · 5:55–6:30"
   },
   {
    "slot": "3 TAGE VOR",
    "type": "Lockerer Lauf",
    "zone": "Z2",
    "km": 6.0,
    "min": null,
    "text": "locker + 3×1 km im Marathontempo",
    "pace": "MRT 5:20"
   },
   {
    "slot": "2 TAGE VOR",
    "type": "Recovery",
    "zone": "Z1",
    "km": 4.0,
    "min": null,
    "text": "sehr locker + 3×20 s · Carboloading beginnt",
    "pace": "Z1 · 6:30–7:00"
   }
  ]
 }
];

