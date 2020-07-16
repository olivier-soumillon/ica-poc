// NOTE: côté client backoffice, on crée un socket client vers notre server node
const socket = io('http://localhost:8080');

/*
NOTE: EVENT_JOIN_BACK_OFFICE_CHANNEL est l'événement émis pour inscrire notre socket client au channel back office
(voir server.js)
 */

const EVENT_JOIN_BACK_OFFICE_CHANNEL = 'EVENT/CHANNEL/BACK_OFFICE/JOIN'

/*
NOTE: EVENT_SEND_NOTIFICATION est l'événement émis pour envoyer une notification au serveur
(voir server.js)
 */

const EVENT_SEND_NOTIFICATION = 'EVENT/NOTIFICATION/SEND'

/*
NOTE: handleFormSubmit est la fonction appelée lorsque le bouton "valider" du formulaire est pressé (voir backoffice.html)
cette fonction crée un objet JSON à partir des données du formulaire [formId] et émet un événement EVENT_SEND_NOTIFICATION
vers le serveur, avec les données jointes.
*/

function handleFormSubmit (formId) {
    const formDataArray = $('#' + formId).serializeArray()

    const formData = {}

    formDataArray.forEach(function (inputData) {
        formData[inputData.name] = inputData.value
    })

    socket.emit(EVENT_SEND_NOTIFICATION, formData)
}


/*
 NOTE: lorsque la page est prête, on émet EVENT_JOIN_BACK_OFFICE_CHANNEL au serveur pour s'inscrire au channel back office
 (voir server.js)
*/

$(document).ready(function() {
    socket.emit(EVENT_JOIN_BACK_OFFICE_CHANNEL)
})