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

/*---------------------------------Récupération des tâches--------------------------------*/

    fetchAndInsertTasksFromApi: async function () {
        try {
            const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks`);
            const allTasksFromApi: TaskData[] = await httpResponse.json();
    
            if (allTasksFromApi.length > 0) {
                allTasksFromApi.forEach((oneTaskFromApi: TaskData) => {
                    console.log(oneTaskFromApi);
                    taskManager.insertTaskInHtml(oneTaskFromApi);
                });
            }
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des tâches :', error);
        }
    },
    

/*------------------------------------Ajout des tâches dans la View------------------------------*/

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

/*--------------------------Input pour créer une tâche-------------------------*/

   handleCreateForm: async function (event: SubmitEvent) {

    event.preventDefault();

    // Extraction des données entrées dans l'input
    const taskInputData: FormData = new FormData(event.currentTarget as HTMLFormElement);

    // Création d'un objet avec les données d'input
    const createdTask: TaskData = {
        id: taskInputData.get('id')?.toString() || '',
        name: taskInputData.get('name')?.toString() || '',
    };

    // Reset du champs d'input lorsque la tâche est crée
    (event.currentTarget as HTMLFormElement).reset(); 

    // Ajout Database
    const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks`, {
        method: "POST",
        body: JSON.stringify(createdTask),
        headers: { "Content-Type": "application/json" }
    });
      
    const newTask = await httpResponse.json();

    // Ajout View
    taskManager.insertTaskInHtml(newTask)

    }, 

/*------------------------------Input pour modifier une tâche------------------------------*/

    handleEditForm: async function (event:SubmitEvent) {
        event.preventDefault();
    
        // Tâche sélectionnée
        const taskToEdit: HTMLDivElement | null = (event.currentTarget as HTMLDivElement).closest('.task');
    
        // Extraction des données entrées dans l'input
        const taskInputData: FormData = new FormData(event.currentTarget as HTMLFormElement);
    
        // Création d'un objet avec les données d'input
        const modifiedTask: TaskData = {
            id: taskInputData.get('id')?.toString() || '',
            name: taskInputData.get('name')?.toString() || '',
        };
    
        // Update Database
        const httpResponse: Response = await fetch(`${taskManager.apiEndpoint}/tasks/${modifiedTask.id}`, {
            method: "PATCH",
            body: JSON.stringify(modifiedTask),
            headers: { "Content-Type": "application/json" }
        });
    
        if (!httpResponse.ok) { return null; }

        // Update View
        if(taskToEdit){
            const taskNameToEdit: HTMLSpanElement | null  = taskToEdit.querySelector('.task__name');
            if(taskNameToEdit){
                taskNameToEdit.textContent = modifiedTask.name;
                taskNameToEdit.style.display = 'block';
            } else {
                console.error('Nom de la tâche est inexistant.');
            }
    
            const modifiedTaskInput: HTMLFormElement | null  = taskToEdit.querySelector('.task__edit-form')
            if(modifiedTaskInput){
                modifiedTaskInput.style.display = 'none';
            } else {
                console.error('Input de la tâche inexistant.');
            }
    
        const updatedList = await httpResponse.json();
        return updatedList;
        }
    },

/*-----------------------------------Action du bouton "edit"--------------------------------*/

    handleEditButton: function (event: MouseEvent) {

        const taskToEdit: HTMLDivElement | null = (event.currentTarget as HTMLDivElement).closest('.task');
        if(taskToEdit){

            const taskToEditInput: HTMLFormElement | null = taskToEdit.querySelector('.task__edit-form')
            if(taskToEditInput){
                taskToEditInput.style.display = 'flex';
            } else {
                console.error('Input de la tâche non trouvé.');
            }

            const taskToEditName: HTMLSpanElement | null = taskToEdit.querySelector('.task__name')
            if(taskToEditName){
                taskToEditName.style.display = 'none';
            } else {
                console.error('Nom de la tâche non trouvé.');
            }
        }
    },

/*-----------------------------Action du bouton "delete"--------------------------------*/

    handleDeleteButton: async function (event: MouseEvent) {

        const taskToDelete: HTMLDivElement | null = (event.currentTarget as HTMLDivElement).closest('.task');
        if(taskToDelete){
            const taskToDeleteId: string | undefined = taskToDelete.dataset.id;

            try {
                const httpResponse: Response = await fetch(`${taskManager.apiEndpoint}/tasks/${taskToDeleteId}`, {
                        method: 'DELETE',
                    });

                if(httpResponse.ok) {
                    (taskToDelete as HTMLDivElement).remove();

                    const notification: HTMLDivElement | null = document.querySelector('.notification-hidden')
                    if(notification){
                        notification.classList.add("notification-visible")
                        setTimeout(() => {
                            notification.classList.remove("notification-visible");
                        }, 3000);
                    }
                } else {
                    console.error('La suppression a échoué');
                }
                    
            } catch (error) {
                console.error(error);
                return false;
            }
        }
    }
};
