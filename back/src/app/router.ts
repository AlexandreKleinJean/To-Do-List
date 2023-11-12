import express from 'express';
const router = express.Router();
import taskController from './controllers/task';

router.get('/', taskController.defaut);

router.get('/tasks', taskController.getTasks);

router.post('/tasks', taskController.createAndAddTask);

router.patch('/tasks/:id', taskController.updateTask);

router.delete('/tasks/:id', taskController.deleteTask);

export default router;
