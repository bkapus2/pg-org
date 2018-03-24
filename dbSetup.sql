CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	first_name TEXT,
	last_name TEXT,
	username TEXT
);

CREATE TABLE emails (
	email_id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users,
	email_address TEXT NOT NULL
);