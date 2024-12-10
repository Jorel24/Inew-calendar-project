const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

//Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User(username, password);
    await newUser.addUser();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error: ', err.message);
    res.status(500).json({ error: 'Failed to register' });
  }
});

//Log in
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.getUserByUsername(username);
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.user = user;
      res.status(200).json({ message: 'User logged in successfully' });
    } else {
      res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (err) {
    console.error('Error: ', err.message);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

//Log out
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out: ', err);
      res.status(500).json({ error: 'Failed to log out' });
    } else {
      res.status(200).json({ message: 'User logged out successfully' });
    }
  });
});

//Middleware to prevent unauthorized access
function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
}

const CalendarTask = require('../models/calendarTask');

//Create a new task
router.post('/tasks', requireLogin, async (req, res) => {
  const username = req.session.user.username;
  const { taskDate, task } = req.body;
  const newTask = new CalendarTask(null, taskDate, task);
  try {
    await newTask.addTask(username);
    res.status(201).send('Task created successfully');
  } catch (err) {
    console.error('Error: ', err.message);
    res.status(500).send('Failed to create task');
  }
});

//Get all tasks for a specific user and date
router.get('/tasks', requireLogin, async (req, res) => {
  const username = req.session.user.username;
  const taskDate = req.query.taskDate;
  try {
    const tasks = await CalendarTask.getTasksByDate(username, taskDate);
    res.json(tasks);
  } catch (err) {
    console.error('Error: ', err.message);
    res.status(500).send('Failed to retrieve tasks');
  }
});

//Update a task
router.put('/tasks/:id', requireLogin, async (req, res) => {
  const username = req.session.user.username;
  const id = req.params.id;
  const { taskDate, task } = req.body;
  const updatedTask = new CalendarTask(id, taskDate, task);
  try {
    await updatedTask.updateTask(username);
    res.send('Task updated successfully');
  } catch (err) {
    console.error('Error: ', err.message);
    res.status(500).send('Failed to update task');
  }
});

//Delete a task
router.delete('/tasks/:id', requireLogin, async (req, res) => {
  const username = req.session.user.username;
  const id = req.params.id;
  try {
    await CalendarTask.deleteTask(id, username);
    res.send('Task deleted successfully');
  } catch (err) {
    console.error('Error: ', err.message);
    res.status(500).send('Failed to delete task');
  }
});

const CalendarNote = require('../models/calendarNote');

//Create a new note
router.post('/notes', requireLogin, async (req, res) => {
  const username = req.session.user.username;
  const { noteDate, note } = req.body;
  const newNote = new CalendarNote(null, noteDate, note);
  try {
    await newNote.addNote(username);
    res.status(201).send('Note created successfully');
  } catch (err) {
    console.error('Error: ', err.message);
    res.status(500).send('Failed to create note');
  }
});

//Get all notes for a specific user and date
router.get('/notes', requireLogin, async (req, res) => {
  const username = req.session.user.username;
  const noteDate = req.query.noteDate;
  try {
    const notes = await CalendarNote.getNotesByDate(username, noteDate);
    res.json(notes);
  } catch (err) {
    console.error('Error: ', err.message);
    res.status(500).send('Failed to retrieve notes');
  }
});

//Update a note
router.put('/notes/:id', requireLogin, async (req, res) => {
  const username = req.session.user.username;
  const id = req.params.id;
  const { noteDate, note } = req.body;
  const updatedNote = new CalendarNote(id, noteDate, note);
  try {
    await updatedNote.updateNote(username);
    res.send('Note updated successfully');
  } catch (err) {
    console.error('Error: ', err.message);
    res.status(500).send('Failed to update note');
  }
});

//Delete a note
router.delete('/notes/:id', requireLogin, async (req, res) => {
  const username = req.session.user.username;
  const id = req.params.id;
  try {
    await CalendarNote.deleteNote(id, username);
    res.send('Note deleted successfully');
  } catch (err) {
    console.error('Error: ', err.message);
    res.status(500).send('Failed to delete note');
  }
});

module.exports = router;