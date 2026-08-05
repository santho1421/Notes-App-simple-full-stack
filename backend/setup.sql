-- setup.sql
-- Run this script in your MySQL client to prepare the database for the Notes App.

-- Create the database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS notes_db;

-- Switch to the new database
USE notes_db;

-- Create the notes table
CREATE TABLE IF NOT EXISTS notes (
    id      INT         AUTO_INCREMENT PRIMARY KEY,
    message TEXT        NOT NULL
);

-- Verify
SELECT 'notes_db and notes table created successfully!' AS status;
