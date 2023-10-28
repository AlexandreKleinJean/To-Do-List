const taskManager = {
    apiEndpoint: 'http://localhost:3000',

    /**
     * Récupére la liste des tâches depuis l'API.
     */
    fetchAndInsertTasksFromApi: async function () {

        // Récupère la liste des tâches à l'aide de la fonction fetch()
        const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks`);
        const allTasksFromApi = await httpResponse.json();

        // Boucle sur la liste des tâches
        for(oneTaskFromApi of allTasksFromApi) {
            console.log(oneTaskFromApi)
        // pour chaque tâche appeler la fonction insertTaskInHtml()
        taskManager.insertTaskInHtml(oneTaskFromApi)

        }
    },

    
    /**
     * Permet de créer une nouvelle tâche sur la page HTML. 
     * La fonction a un paramètre, un objet contenant les données de la tâche. 
     * Il est composé de 2 propriétés : l'id de la tâche et son nom.
     * 
     * Exemple : 
     * {
     *   id: 5,
     *   name: 'Faire les courses'
     * } 
     * 
     * @param {Object} taskData 
     */
    insertTaskInHtml: function (taskData) {

        // On récupère le HTML d'une tâche dans le template
        const taskTemplate = document.querySelector('.template-task');
        const newTask = document.importNode(taskTemplate.content, true);

        // On insère les données de la tâche dans le HTML
        newTask.querySelector('.task__name').textContent = taskData.name;
        newTask.querySelector('.task__input-name').value = taskData.name;
        newTask.querySelector('.task__input-id').value = taskData.id;
        newTask.querySelector('.task').dataset.id = taskData.id;

        // On écoute les événements sur les éléments créés
        newTask.querySelector('.task__delete').addEventListener(
            'click', taskManager.handleDeleteButton);
        
        newTask.querySelector('.task__edit').addEventListener(
            'click', taskManager.handleEditButton);

        newTask.querySelector('.task__edit-form').addEventListener(
            'submit', taskManager.handleEditForm);

        // On insère le HTML de la tâche dans la page
        document.querySelector('.tasks').append(newTask);

    },

    /**
     * Cette fonction est appelée quand le formumaire de création de tâche est soumis. 
     * 
     * @param {Event} event 
     */
    handleCreateForm: async function (event) {

        // Bloquer l'envoie du formulaire
        event.preventDefault();

        // Récupérer les données du formulaire "cachées"
        const taskFormData = new FormData(event.currentTarget);
        // Récupérer les données "utilisables"
        const newTaskData = Object.fromEntries(taskFormData);
        console.log(newTaskData)

        // BONNNUUUUUUUUUUSSSSSSSS 1 !
        event.currentTarget.reset(); 

        // Envoyer les données à l'API
        const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks`, {
            method: "POST",
            body: JSON.stringify(newTaskData),
            headers: { "Content-Type": "application/json" }
        });
          
        const createdTask = await httpResponse.json();

        // Après confirmation de l'API insérer la tâche dans la page en utilisant la valeur de retour de l'API
        taskManager.insertTaskInHtml(createdTask)

    },


    /**
     * Cette fonction est appelée quand l'utilisateur appuie sur le bouton de suppression.
     * 
     * @param {Event} event 
     */
    handleDeleteButton: async function (event) {

        // On récupère l'ID de l'élément à supprimer
        const taskHtmlElement = event.currentTarget.closest('.task');
        console.log(taskHtmlElement)
        const taskToDeleteId = taskHtmlElement.dataset.id;

        try {
            // On envoie la requete de suppression à l'API
            const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks/${taskToDeleteId}`, {
                    method: 'DELETE',
                });

            if(httpResponse.ok) {
                // On supprime l'élément dans la page HTML
                taskHtmlElement.remove();

                //BONUUUUUSSSSS 2 !
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

        



    /**
     * Cette fonction est appelée lors du click sur le bouton "modifier une tâche"
     * 
     * @param {Event} event 
     */
    handleEditButton: function (event) {
        // On récupére l'élément HTML de la tâche à modifier (template task)
        const taskHtmlElement = event.currentTarget.closest('.task');
        // On affiche l'input de modification
        taskHtmlElement.querySelector('.task__edit-form').style.display = 'flex';
        // On masque le titre
        taskHtmlElement.querySelector('.task__name').style.display = 'none';
    },

    /**
     * Cette fonction est appelée quand le formumaire de modification de tâche est soumis. 
     * 
     * @param {Event} event 
     */
    handleEditForm: async function (event) {
        // Bloquer l'envoi du formulaire
        event.preventDefault();
    
        // On récupère l'élément HTML de la tâche à modifier (template task)
        const taskHtmlElement = event.currentTarget.closest('.task');
    
        // Récupérer les données du formulaire "cachées"
        const taskFormData = new FormData(event.currentTarget);
    
        // je récupère l'id de la tâche à modifier
        const modifiedTaskId = taskFormData.get('id');
        console.log(modifiedTaskId);
    
        // Récupérer les données "utilisables"
        const modifiedTaskData = Object.fromEntries(taskFormData);
        console.log(modifiedTaskData);
    
        // Envoyer les données à l'API
        const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks/${modifiedTaskId}`, {
            method: "PATCH",
            body: JSON.stringify(modifiedTaskData),
            headers: { "Content-Type": "application/json" }
        });
    
        if (!httpResponse.ok) { return null; }
    
        // Après confirmation de l'API, modifier le nom de la tâche dans le span.task__name
        const taskNameToEdit = taskHtmlElement.querySelector('.task__name');
        taskNameToEdit.textContent = modifiedTaskData.name;
    
        // On affiche l'input de modification
        taskHtmlElement.querySelector('.task__edit-form').style.display = 'none';
        // On masque le titre
        taskNameToEdit.style.display = 'block';
    
        const updatedList = await httpResponse.json();
        return updatedList;
    }
    


};
