const db = require('../database');

class CalendarTask {
    constructor(taskID, taskDate, task) {
        this.taskID = taskID;
        this.taskDate = taskDate;
        this.task = task;
    }

//Method to create a new task
    async addTask(username) {
        const { taskDate, task } = this;
        const query = 'INSERT INTO calendarTasks (username, taskDate, task) VALUES (?, ?, ?)';
        try {
            await db.execute(query, [username, taskDate, task]);
        } catch (err) {
            throw err;
        }
    }
//Method to read a task for a specific user and date
    static async getTasksByDate(username, taskDate) {
        const query = 'SELECT * FROM calendarTasks WHERE username = ? AND taskDate = ?';
        try {
            const [results] = await db.execute(query, [username, taskDate]);
            return results.map(task => ({
                id: task.taskID,
                taskDate: task.taskDate,
                task: task.task
            }));
        } catch (err) {
            throw err;
        }
    }

//Method to update a task
    async updateTask(username) {
        const { taskID, taskDate, task } = this;
        const query = 'UPDATE calendarTasks SET taskDate = ?, task = ? WHERE taskID = ? AND username = ?';
        try {
            const [results] = await db.execute(query, [taskDate, task, taskID, username]);
            if (results.affectedRows === 0) {
                throw 'Task not found';
            }
        } catch (err) {
            throw err;
        }
    }

//Method to delete a task
    static async deleteTask(taskID, username) {
        const query = 'DELETE FROM calendarTasks WHERE taskID = ? AND username = ?';
        try {
            const [results] = await db.execute(query, [taskID, username]);
            if (results.affectedRows === 0) {
                throw 'Task not found';
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = CalendarTask;
