const taskManager = {
    apiEndpoint: 'http://localhost:3000',

    /* Récupération des tâches */
    fetchAndInsertTasksFromApi: async function () {

        const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks`);
        const allTasksFromApi = await httpResponse.json();

        for(oneTaskFromApi of allTasksFromApi) {
            console.log(oneTaskFromApi)
        taskManager.insertTaskInHtml(oneTaskFromApi)

        }
    },

    /* Ajout de tâches */
    insertTaskInHtml: function (taskData) {

        const taskTemplate = document.querySelector('.template-task');
        const newTask = document.importNode(taskTemplate.content, true);

        newTask.querySelector('.task__name').textContent = taskData.name;
        newTask.querySelector('.task__input-name').value = taskData.name;
        newTask.querySelector('.task__input-id').value = taskData.id;
        newTask.querySelector('.task').dataset.id = taskData.id;

        newTask.querySelector('.task__delete').addEventListener(
            'click', taskManager.handleDeleteButton);
        
        newTask.querySelector('.task__edit').addEventListener(
            'click', taskManager.handleEditButton);

        newTask.querySelector('.task__edit-form').addEventListener(
            'submit', taskManager.handleEditForm);

        document.querySelector('.tasks').append(newTask);

    },

    // Création du formulaire
    handleCreateForm: async function (event) {

        event.preventDefault();

        const taskFormData = new FormData(event.currentTarget);
        const newTaskData = Object.fromEntries(taskFormData);
        console.log(newTaskData)

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
    handleEditButton: function (event) {
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
