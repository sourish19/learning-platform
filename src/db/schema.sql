-- schema.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);

CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  course_id INT REFERENCES courses(id),
  description TEXT NOT NULL
);

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  problem_id INT REFERENCES problems(id),
  submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE progress (
    
  user_id INT REFERENCES users(id),
  course_id INT REFERENCES courses(id),
  completion_percentage NUMERIC(5,2) DEFAULT 0,
  PRIMARY KEY (user_id, course_id)
);