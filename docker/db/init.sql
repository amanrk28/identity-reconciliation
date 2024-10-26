DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
ALTER SYSTEM SET max_connections = 250;

CREATE TABLE contact (
  id SERIAL PRIMARY KEY,
  phoneNumber VARCHAR(20),
  email VARCHAR(100),
  linkedId INTEGER,
  linkPrecedence VARCHAR(20) CHECK (linkPrecedence IN ('primary', 'secondary')),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);