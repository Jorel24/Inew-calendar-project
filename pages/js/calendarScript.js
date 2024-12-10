//Calendar generation
angular.module('calendarApp', [])
.service('DayGenerator', function() {
    this.isLeapYear = function(year) {
        return year % 400 === 0 || (year % 4 === 0 && year % 100 != 0);
    };

    this.getTotalNumberOfDays = function(month, year) {
        let total = 0;
        for (let i = 1800; i < year; i++) {
            total += this.isLeapYear(i) ? 366 : 365;
        }
        const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (this.isLeapYear(year)) monthDays[1] = 29;
        for (let i = 0; i < month - 1; i++) {
            total += monthDays[i];
        }
        return total;
    };

    this.getStartDay = function(month, year) {
        const startingDay = 3; //1800 would start on a Wednesday
        const totalNumberOfDays = this.getTotalNumberOfDays(month, year);
        return (totalNumberOfDays + startingDay) % 7;
    };
})

.controller('CalendarController', function($scope, $http, $window, DayGenerator) {
    $scope.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.currentMonth = new Date().getMonth() + 1;
    $scope.currentYear = new Date().getFullYear();
    $scope.weeks = [];
    $scope.selectedDate = null;
    $scope.newTask = '';
    $scope.newNote = '';
    $scope.showOverlay = false;
    $scope.selectedDayTasks = [];
    $scope.selectedDayNotes = [];

    $scope.generateMonth = function(month, year) {
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (DayGenerator.isLeapYear(year)) daysInMonth[1] = 29;

        let startDay = DayGenerator.getStartDay(month, year);
        month--;
        if (startDay !== 0) {
            if (month === 0) {
                month = 11;
                year--;
            } else {
                month--;
            }
            startDay = daysInMonth[month] - startDay + 1;
        } else {
            startDay = 1;
        }

        let day = startDay;
        $scope.weeks = [];

        for (let i = 0; i < 5; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                let fullDate;
                if (day <= daysInMonth[month]) {
                    fullDate = `${year}-${('0' + (month + 1)).slice(-2)}-${('0' + day).slice(-2)}`;
                    week.push({ date: day++, fullDate: fullDate, tasks: [], notes: [], isCurrentMonth: true });
                } else {
                    day = 1;
                    if (month === 11) {
                        month = 0;
                        year++;
                    } else {
                        month++;
                    }
                    fullDate = `${year}-${('0' + (month + 1)).slice(-2)}-${('0' + day).slice(-2)}`;
                    week.push({ date: day++, fullDate: fullDate, tasks: [], notes: [], isNextMonth: true });
                }
            }
            $scope.weeks.push(week);
        }

//Fetch tasks and notes to display on each day
        $scope.weeks.forEach(week => {
            week.forEach(day => {
                const taskDate = day.fullDate;

                $http.get('/api/tasks', { params: { taskDate: taskDate } })
                    .then(function(response) {
                        day.tasks = response.data;
                    })
                    .catch(function(error) {
                        console.error('Error fetching tasks:', error);
                    });

                $http.get('/api/notes', { params: { noteDate: taskDate } })
                    .then(function(response) {
                        day.notes = response.data;
                    })
                    .catch(function(error) {
                        console.error('Error fetching notes:', error);
                    });
            });
        });
    };

    $scope.prevMonth = function() {
        if ($scope.currentMonth === 1) {
            $scope.currentMonth = 12;
            $scope.currentYear--;
        } else {
            $scope.currentMonth--;
        }
        $scope.generateMonth($scope.currentMonth, $scope.currentYear);
    };

    $scope.nextMonth = function() {
        if ($scope.currentMonth === 12) {
            $scope.currentMonth = 1;
            $scope.currentYear++;
        } else {
            $scope.currentMonth++;
        }
        $scope.generateMonth($scope.currentMonth, $scope.currentYear);
    };

    $scope.selectDay = function(day) {
        $scope.selectedDate = day.fullDate;
        $scope.selectedDayTasks = day.tasks;
        $scope.selectedDayNotes = day.notes;
        $scope.showOverlay = true;
    };

    $scope.addTask = function() {
        if ($scope.selectedDate && $scope.newTask) {
            const taskData = {
                taskDate: $scope.selectedDate,
                task: $scope.newTask
            };
            $http.post('/api/tasks', taskData)
                .then(function(response) {
                    console.log('Task added successfully:', response.data);
                    $scope.newTask = '';
                    $scope.generateMonth($scope.currentMonth, $scope.currentYear);
                })
                .catch(function(error) {
                    console.error('Error adding task:', error);
                });
        } else {
            alert('Please select a date and enter a task.');
        }
    };
    $scope.addTask = function() {
        if ($scope.selectedDate && $scope.newTask) {
            const taskData = {
                taskDate: $scope.selectedDate,
                task: $scope.newTask
            };
            $http.post('/api/tasks', taskData)
                .then(function(response) {
                    console.log('Task added successfully:', response.data);
                    $scope.newTask = '';
                    $scope.generateMonth($scope.currentMonth, $scope.currentYear);
                    $scope.showOverlay = false;
                })
                .catch(function(error) {
                    console.error('Error adding task:', error);
                });
        } else {
            alert('Please select a date and enter a task.');
        }
    };
    
    $scope.addNote = function() {
        if ($scope.selectedDate && $scope.newNote) {
            const noteData = {
                noteDate: $scope.selectedDate,
                note: $scope.newNote
            };
            $http.post('/api/notes', noteData)
                .then(function(response) {
                    console.log('Note added successfully:', response.data);
                    $scope.newNote = '';
                    $scope.generateMonth($scope.currentMonth, $scope.currentYear);
                    $scope.showOverlay = false;
                })
                .catch(function(error) {
                    console.error('Error adding note:', error);
                });
        } else {
            alert('Please select a date and enter a note.');
        }
    };
    
    $scope.deleteTask = function(taskId) {
        $http.delete(`/api/tasks/${taskId}`)
            .then(function(response) {
                console.log('Task deleted successfully:', response.data);
                $scope.generateMonth($scope.currentMonth, $scope.currentYear);
                $scope.showOverlay = false;
            })
            .catch(function(error) {
                console.error('Error deleting task:', error);
            });
    };
    
    $scope.deleteNote = function(noteId) {
        $http.delete(`/api/notes/${noteId}`)
            .then(function(response) {
                console.log('Note deleted successfully:', response.data);
                $scope.generateMonth($scope.currentMonth, $scope.currentYear);
                $scope.showOverlay = false;
            })
            .catch(function(error) {
                console.error('Error deleting note:', error);
            });
    };
//Log out the user from calendar
    $scope.logout = function() {
        $http.get('/api/logout')
            .then(function(response) {
                console.log('User logged out successfully:', response.data);
                $window.location.href = './logout.html';
            })
            .catch(function(error) {
                console.error('Error logging out user:', error);
            });
    };
//Used to close the overlay with a button in the sidebar
    $scope.closeOverlay = function() {
        $scope.showOverlay = false;
    };

    $scope.generateMonth($scope.currentMonth, $scope.currentYear);
});
