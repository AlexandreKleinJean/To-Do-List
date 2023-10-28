const { Task } = require('../models');

const taskController = {

    defaut:function (req, res) {
        res.send("Back ok")
    },

    listTasks: async function (req, res) {
        try {
            // Récupérer la liste des taches
            const getTasks = await Task.findAll()
            // Renvoyer les tasks en json
            res.json(getTasks)
        } catch (e) {
            console.trace(e);
            res.status(500).json(e.toString())
        }
    },

    createAndAddTask: async function (req, res) {
        try {
            // Récupérer le nom de la nouvelle task dans le formulaire
            const { name } = req.body;
            if (!name) {
                throw new Error('name is empty');
            }
            const newTask = await Task.create({
                name
            })
            // Renvoyer la nouvelle task en json
            res.json(newTask);
        } catch (e) {
            console.trace(e);
            res.status(500).json(e.toString())
        }
    },

    updateTask: async function (req, res) {
        try {
            // Récupérer l'id de l'URL
            const taskId = req.params.id;

            // Récupérer la Task avec l'id de l'URL, dans la BDD
            const taskToUpdate = await Task.findByPk(taskId);
            if (!taskToUpdate) {
                throw new Error('no task with this id');
            }
            const { name } = req.body;

            if (name) {
                taskToUpdate.name = name;
            } 

            const updatedTask = await taskToUpdate.save();

            // Renvoyer la task mis à jour en json
            res.json(updatedTask);
        } catch (e) {
            console.trace(e);
            res.status(500).json(e.toString())
        }
    },

    deleteTask: async function (req, res) {
        try {
            const taskToDeleteId = req.params.id;
            console.log(taskToDeleteId)
            const task = await Task.findByPk(taskToDeleteId);
            console.log(task)
            if (!task) {
                throw new Error('task with this id does not exist');
            }
            await task.destroy();

            res.status(204).end();
        } catch (e) {
            console.trace(e);
            res.status(500).json(e.toString())
        }
    },
}

module.exports = taskController;
