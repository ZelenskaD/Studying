-- users table
CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  join_at TIMESTAMP DEFAULT current_timestamp,
  last_login_at TIMESTAMP DEFAULT current_timestamp
);

-- messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
  to_username VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
  body TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT current_timestamp,
  read_at TIMESTAMP
);