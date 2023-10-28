const express = require('express');
const router = express.Router();
const taskController = require('./controllers/task');

// Route par défaut
router.get('/', taskController.defaut);

// Route pour la liste des taches
router.get('/tasks', taskController.listTasks);

// Route pour ajouter une tache
router.post('/tasks', taskController.createAndAddTask);

// Route pour modifier une tache
router.patch('/tasks/:id', taskController.updateTask);

// Route pour supprimer une tache
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
