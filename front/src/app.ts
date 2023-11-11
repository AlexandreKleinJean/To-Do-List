interface TaskData {
    id: string;
    name: string;
}

document.addEventListener('DOMContentLoaded', function init() {

    // Fetch des tâches
    taskManager.fetchAndInsertTasksFromApi();

    // Soumission formulaire
    const taskForm: HTMLFormElement | null = document.querySelector('.create-task');
    if (taskForm) {
        taskForm.addEventListener('submit', taskManager.handleCreateForm);
    }
});

const taskManager = {
    apiEndpoint: 'http://localhost:3000',

/*------------------------------Récupération des tâches-----------------------------*/

    fetchAndInsertTasksFromApi: async function () {
        try {
            const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks`);
            const allTasksFromApi: (string)[] = await httpResponse.json();
    
            if (allTasksFromApi.length > 0) {
                allTasksFromApi.forEach((oneTaskFromApi: string) => {
                    console.log(oneTaskFromApi);
                    taskManager.insertTaskInHtml(oneTaskFromApi);
                });
            }
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des tâches :', error);
        }
    },
    

/*------------------------------------Ajout des tâches------------------------------*/

    insertTaskInHtml: function(taskData: TaskData) {

        const taskTemplate: HTMLTemplateElement | null = document.querySelector('.template-task');
        if (taskTemplate) {
            // Clonage du template de tâche
            const newTask: HTMLDivElement = taskTemplate.content.cloneNode(true) as HTMLDivElement;
    
            if (newTask) {
                const taskNameElement: HTMLSpanElement | null = newTask.querySelector('.task__name');
                const taskInputNameElement: HTMLInputElement | null = newTask.querySelector('.task__input-name');
                const taskInputIdElement: HTMLInputElement | null = newTask.querySelector('.task__input-id');
                const taskElement: HTMLDivElement | null = newTask.querySelector('.task');

                if (taskNameElement && taskInputNameElement && taskInputIdElement && taskElement) {
                    taskNameElement.textContent = taskData.name;
                    taskInputNameElement.value = taskData.name;
                    taskInputIdElement.value = taskData.id;
                    taskElement.dataset.id = taskData.id;
                } else {
                console.error("Certains éléments du clone n'ont pas été trouvés.");
                }
            }
        
            // Implémentation des fonctionnalités des boutons du clone
            const taskDeleteElement: HTMLButtonElement | null = newTask.querySelector('.task__delete');
            const taskEditElement: HTMLButtonElement | null = newTask.querySelector('.task__edit');
            const taskEditFormElement: HTMLButtonElement | null = newTask.querySelector('.task__edit-form');
    
            if (taskDeleteElement && taskEditElement && taskEditFormElement) {
                taskDeleteElement.addEventListener('click', taskManager.handleDeleteButton);
                taskEditElement.addEventListener('click', taskManager.handleEditButton);
                taskEditFormElement.addEventListener('submit', taskManager.handleEditForm);
            } else {
                console.error("Certains boutons du clone n'ont pas été trouvés.");
            }

            // Intégration du clone dans le container de tâches
            const tasks: HTMLDivElement | null = document.querySelector('.tasks');
            if(tasks){
                tasks.append(newTask);
            }
        }
    },

/*----------------------------------Création du formulaire------------------------------*/

    handleCreateForm: async function (event: MouseEvent) {

        event.preventDefault();

        const taskFormData = new FormData(event.currentTarget);
        const newTaskData = Object.fromEntries(taskFormData);
        console.log("hello :" +newTaskData)

        // A travailler
        event.currentTarget.reset(); 

        const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks`, {
            method: "POST",
            body: JSON.stringify(newTaskData),
            headers: { "Content-Type": "application/json" }
        });
          
        const createdTask = await httpResponse.json();

        taskManager.insertTaskInHtml(createdTask)

    },

    // Bouton supprimer
    handleDeleteButton: async function (event) {

        const taskHtmlElement = event.currentTarget.closest('.task');
        console.log(taskHtmlElement)
        const taskToDeleteId = taskHtmlElement.dataset.id;

        try {
            const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks/${taskToDeleteId}`, {
                    method: 'DELETE',
                });

            if(httpResponse.ok) {
                taskHtmlElement.remove();

                // A travailler
                const notification = document.querySelector('.notification-hidden')
                console.log(notification)
                notification.classList.add("notification-visible")
                    

            }
            else{
                console.error('La suppression a échoué');
            }
                
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    // Bouton modifier
    handleEditButton: function (event: MouseEvent) {
        // On récupére l'élément HTML de la tâche à modifier (template task)
        const taskHtmlElement = event.currentTarget.closest('.task');
        // On affiche l'input de modification
        taskHtmlElement.querySelector('.task__edit-form').style.display = 'flex';
        // On masque le titre
        taskHtmlElement.querySelector('.task__name').style.display = 'none';
    },

    // Bouton modifier formulaire
    handleEditForm: async function (event) {
        event.preventDefault();
    
        const taskHtmlElement = event.currentTarget.closest('.task');
    
        const taskFormData = new FormData(event.currentTarget);
    
        const modifiedTaskId = taskFormData.get('id');
        console.log(modifiedTaskId);
    
        const modifiedTaskData = Object.fromEntries(taskFormData);
        console.log(modifiedTaskData);
    
        const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks/${modifiedTaskId}`, {
            method: "PATCH",
            body: JSON.stringify(modifiedTaskData),
            headers: { "Content-Type": "application/json" }
        });
    
        if (!httpResponse.ok) { return null; }
    
        const taskNameToEdit = taskHtmlElement.querySelector('.task__name');
        taskNameToEdit.textContent = modifiedTaskData.name;
    
        taskHtmlElement.querySelector('.task__edit-form').style.display = 'none';

        taskNameToEdit.style.display = 'block';
    
        const updatedList = await httpResponse.json();
        return updatedList;
    }

};
