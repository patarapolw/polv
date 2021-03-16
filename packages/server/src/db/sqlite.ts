import sqlite3 from 'better-sqlite3'

export const db: sqlite3.Database = sqlite3('data.db')

db.exec(/* sql */ `
CREATE TABLE IF NOT EXISTS user (
  id      INT PRIMARY KEY NOT NULL DEFAULT 1,
  theme   JSON NOT NULL
);

CREATE VIRTUAL TABLE IF NOT EXISTS "entry" USING fts5(
  "path",             -- TEXT PRIMARY KEY NOT NULL
  title,              -- TEXT NOT NULL
  "image" UNINDEXED,  -- TEXT NULL
  "date",             -- TIMESTAMP/FLOAT EPOCH MILLI
  tag,                -- TEXT NOT NULL SPACE SEPARATED
  "text",             -- TEXT NOT NULL
  html UNINDEXED,     -- TEXT
  tokenize = 'porter unicode61 remove_diacritics 1'
);
`)
