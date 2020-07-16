// NOTE: côté client screen, on crée un socket client vers notre server node
const socket = io('http://localhost:8080');

// NOTE: EVENT_JOIN_SCREEN_CHANNEL est l'événement émis pour inscrire notre socket client au channel screen (voir server.js)
const EVENT_JOIN_SCREEN_CHANNEL = 'EVENT/CHANNEL/SCREEN/JOIN'

// NOTE: EVENT_SHOW_NOTIFICATION est l'événement reçu lorsqu'une nouvelle notification nous arrive (voir server.js)
const EVENT_SHOW_NOTIFICATION = 'EVENT/NOTIFICATION/SHOW'

// NOTE: la fonction handleShowNotification ajoute une entrée à la liste de notification (voir screen.html)
function handleShowNotification (data) {
    $("#notifications-list").append("<tr><td>" + data.name + "</td></tr>")
}


/*
NOTE:

    1. Lorsque la page est prête, l'on émet un événement EVENT_JOIN_SCREEN_CHANNEL vers le serveur pour s'inscrire au channel screen

    2. L'on écoute la ligne en attente d'un événement EVENT_SHOW_NOTIFICATION, à chaque événement EVENT_SHOW_NOTIFICATION reçu,
       l'on appelle la fonction handleShowNotification
 */

$(document).ready(function() {
    socket.emit(EVENT_JOIN_SCREEN_CHANNEL)

    socket.on(EVENT_SHOW_NOTIFICATION, handleShowNotification)
})