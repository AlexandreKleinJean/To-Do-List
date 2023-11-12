import { Request, Response } from 'express';
import Task from '../models/index';
import TaskModel from '../models/Task';

const taskController = {

    defaut:function (req: Request, res: Response): void {
        res.send("Back ok")
    },

    getTasks: async function (req: Request, res: Response): Promise<void> {
        try {
            const getTasks = await Task.findAll()
            res.json(getTasks)
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des tâches.' });
        }
    },

    createAndAddTask: async function (req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body as { name: string | null };
            if (!name) {
                console.error('Le champ est vide.');
                res.status(400).json({ error: 'Le champ "name" ne peut pas être vide.' });
                return;
            }
            const newTask: TaskModel = await Task.create({
                name
            })
            res.json(newTask);
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la création/ajout de la tâche.' });
        }
    },

    updateTask: async function (req: Request, res: Response): Promise<void> {
        try {
            const taskId: string | null = req.params.id;
    
            if (!taskId) {
                console.error("Id inexistant.");
                res.status(400).json({ error: 'ID de la tâche manquant.' });
                return;
            }
    
            const taskToUpdate: TaskModel | null = await Task.findByPk(taskId);
    
            if (!taskToUpdate) {
                console.error('Aucune tâche ne correspond à cet identifiant.');
                res.status(404).json({ error: 'Aucune tâche ne correspond à cet ID.' });
                return;
            }
    
            const { name } = req.body as { name: string | null };
    
            if (!name) {
                console.error('Le champ est vide.');
                res.status(400).json({ error: 'Le champ "name" ne peut pas être vide.' });
                return;
            }
    
            taskToUpdate.name = name;
            const updatedTask: TaskModel = await taskToUpdate.save();
    
            res.json(updatedTask);
        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la modification de la tâche.' });
        }
    },
    
    deleteTask: async function (req: Request, res: Response): Promise<void> {
        try {
            const taskId: string | null = req.params.id;
    
            if (taskId) {
                const task: TaskModel | null = await Task.findByPk(taskId);
                if (!task) {
                    console.error('Aucune tâche ne correspond à cet ID.');
                    res.status(404).json({ error: 'Aucune tâche ne correspond à cet ID.' });
                    return;
                } else {
                    await task.destroy();
                }

            res.status(204).end();
            }

        } catch (error: unknown) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la suppression de la tâche.' });
        }
    },
}

export default taskController;
