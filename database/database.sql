CREATE DATABASE calendarDatabase;
USE calendarDatabase;

CREATE TABLE users (
    username VARCHAR(50) UNIQUE NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE calendarTasks (
    taskID INT AUTO_INCREMENT PRIMARY KEY,
    taskDate DATE,
    task VARCHAR(1500) NOT NULL,
    username VARCHAR(50),
    FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE calendarNotes (
    noteID INT AUTO_INCREMENT PRIMARY KEY,
    noteDate DATE,
    note VARCHAR(1500) NOT NULL,
    username VARCHAR(50),
    FOREIGN KEY (username) REFERENCES users(username)
);
