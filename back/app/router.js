const express = require('express');
const router = express.Router();
const taskController = require('./controllers/task');

router.get('/', taskController.defaut);

router.get('/tasks', taskController.listTasks);

router.post('/tasks', taskController.createAndAddTask);

router.patch('/tasks/:id', taskController.updateTask);

router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
