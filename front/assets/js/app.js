const app = {
    init: function () {

        // Fetch des tâches
        taskManager.fetchAndInsertTasksFromApi();

        // Soumission formulaire
        document.querySelector('.create-task').addEventListener('submit', taskManager.handleCreateForm);

    }

};

document.addEventListener('DOMContentLoaded', app.init);