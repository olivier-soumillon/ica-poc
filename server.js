/*
NOTE: on utilise le framework express js pour construire le serveur
 */

const express = require('express')
const path = require('path')
const http = require('http')

const app = express()

/*
NOTE: on rend le dossier "./public" accessible de l'extérieur, il contient les codes javascript
des pages backoffice et screen
 */

app.use('/public', express.static('public'))

/*
NOTE: on indique au server que les requests vers les URLs /back-office et /screen doivent servir respectivement les
pages backoffice.html et screen.html, l'on gère ça ici pour des raisons pratiques de démonstration, mais en principe
les pages HTML seront rendues par votre serveur PHP, et non par le serveur Node qui lui sera à priori dédié à faire
circuler les messages en temps réel
*/

app.get('/back-office', function (req, res) {
    return res.sendFile(path.join(__dirname, '/pages/backoffice.html'))
})

app.get('/screen', function (req, res) {
    return res.sendFile(path.join(__dirname, '/pages/screen.html'))
})

// NOTE: creation du serveur HTTP, en lui indiquant d'utiliser l'app express
const server = http.createServer(app)

// NOTE: creation du socket server grâce à socket.io, on le lie au serveur HTTP
const serverSocket = require('socket.io')(server)

/*
NOTE: ici l'on définit dans des constantes deux noms de channels (= rooms, dans le lexique socket.io), c'est une
solution pratique pour définir vers qui émettre les messages, dans notre cas l'on veut que nos pages "backoffice"
émettent leurs notifications aux pages "screen"
*/

const CHANNEL_BACK_OFFICE = 'CHANNEL/BACK_OFFICE'
const CHANNEL_SCREEN = 'CHANNEL/SCREEN'

const EVENT_JOIN_BACK_OFFICE_CHANNEL = 'EVENT/CHANNEL/BACK_OFFICE/JOIN'
const EVENT_JOIN_SCREEN_CHANNEL = 'EVENT/CHANNEL/SCREEN/JOIN'

/*
NOTE: ici l'on définit dans des constantes deux noms d'événement, EVENT_SEND_NOTIFICATION sera l'événement émit par les
le socket client des pages "backoffice" vers le socket serveur pour signaler qu'une notification doit être dispatchée
aux socket client des pages "screen" et EVENT_SHOW_NOTIFICATION sera l'événement émit par le socket serveur vers les
socket client des page "screen", pour leur demander d'afficher la notification
 */
const EVENT_SEND_NOTIFICATION = 'EVENT/NOTIFICATION/SEND'
const EVENT_SHOW_NOTIFICATION = 'EVENT/NOTIFICATION/SHOW'

// NOTE: Lorsque le socket serveur détecte une connection ...
serverSocket.on('connect', function (clientSocket) {

    /*
    NOTE: Lorque le socket client émet au socket serveur l'événement EVENT_JOIN_BACK_OFFICE_CHANNEL
    ou EVENT_JOIN_SCREEN_CHANNEL, on lie le socket client au channel correspondant (CHANNEL_BACK_OFFICE ou CHANNEL_SCREEN)
    */
    clientSocket.on(EVENT_JOIN_BACK_OFFICE_CHANNEL, function () {
        clientSocket.join(CHANNEL_BACK_OFFICE)
    })

    clientSocket.on(EVENT_JOIN_SCREEN_CHANNEL, function () {
        clientSocket.join(CHANNEL_SCREEN)
    })

    /*
    NOTE: Lorque le socket client émet au socket serveur l'événement EVENT_SEND_NOTIFICATION, l'on vérifie si ce
    socket client fait bien partie du channel CHANNEL_BACK_OFFICE, si oui l'on demande au serveur d'émettre sur le
    channel CHANNEL_SCREEN un événement EVENT_SHOW_NOTIFICATION
     */
    clientSocket.on(EVENT_SEND_NOTIFICATION, function notifyAbsence (data) {
        if (Object.values(clientSocket.rooms).indexOf(CHANNEL_BACK_OFFICE) >= 0) {
            serverSocket.to(CHANNEL_SCREEN).emit(EVENT_SHOW_NOTIFICATION, data)
        }
    })
})

// NOTE: l'on démarre le serveur sur le port 8080
server.listen(8080, () => {
    console.log('Server listening on port 8080 ;)')
})