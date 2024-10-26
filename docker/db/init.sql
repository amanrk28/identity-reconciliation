DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
ALTER SYSTEM SET max_connections = 250;

CREATE TABLE contact (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20),
  email VARCHAR(100),
  linked_id INTEGER,
  link_precedence VARCHAR(20) CHECK (link_precedence IN ('primary', 'secondary')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);