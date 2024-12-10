const db = require('../database');

class CalendarNote {
    constructor(noteID, noteDate, note) {
        this.noteID = noteID;
        this.noteDate = noteDate;
        this.note = note;
    }

//Method to create a new note
    async addNote(username) {
        const { noteDate, note } = this;
        const query = 'INSERT INTO calendarNotes (username, noteDate, note) VALUES (?, ?, ?)';
        try {
            await db.execute(query, [username, noteDate, note]);
        } catch (err) {
            throw err;
        }
    }

//Method to read notes for a specific user and date
    static async getNotesByDate(username, noteDate) {
        const query = 'SELECT * FROM calendarNotes WHERE username = ? AND noteDate = ?';
        try {
            const [results] = await db.execute(query, [username, noteDate]);
            return results.map(note => ({
                id: note.noteID,
                noteDate: note.noteDate,
                note: note.note
            }));
        } catch (err) {
            throw err;
        }
    }

//Method to update a note
    async updateNote(username) {
        const { noteID, noteDate, note } = this;
        const query = 'UPDATE calendarNotes SET noteDate = ?, note = ? WHERE noteID = ? AND username = ?';
        try {
            const [results] = await db.execute(query, [noteDate, note, noteID, username]);
            if (results.affectedRows === 0) {
                throw 'Note not found';
            }
        } catch (err) {
            throw err;
        }
    }

//Method to delete a note
    static async deleteNote(noteID, username) {
        const query = 'DELETE FROM calendarNotes WHERE noteID = ? AND username = ?';
        try {
            const [results] = await db.execute(query, [noteID, username]);
            if (results.affectedRows === 0) {
                throw 'Note not found';
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = CalendarNote;
