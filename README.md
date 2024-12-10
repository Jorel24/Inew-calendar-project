# Inew-calendar-project
Introduction
This is a calendar application. It stores notes and tasks for each user through user authentication.

Technical documentation
This project uses:
AngularJS
Node.js
express
mysql2
bcrypt
dotenv
express-session
path

[Flowchart](docs/CalendarFlowchart.png)

Endpoints
User Authentication
POST /api/register
POST /api/login
GET /api/logout

Task Management
POST /api/tasks
GET /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

Note Management
POST /api/notes
GET /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id

User Document
1. Register with a username and password
2. Log in
3. To navigate the calendar, use the arrows at the top.
Clicking a day will select that day to allow the user to add notes and tasks.
Use the sidebar to add notes and tasks to the selected day.
Clicking a day will also show an overlay for that day's notes and tasks.
These notes and tasks can be clicked in the overlay to be deleted.
To close the overlay, either press the back to calendar button, or add or delete a note or task.
4. When finished, you can log out and return to the homepage.
[Video with the demonstration attached](docs/CalendarProject.mp4)

Description of pages
Both login and the calendar pages use user authentication and sessions. This ensures that only a logged-in user can read and modify their own tasks and notes. The calendar page uses AngularJS to generate a calendar with the correct notes and tasks for the user.