# ica-poc

POC using node / express js server with socket.io to dispatch notifications from "backoffice" page to "screen" page using HTML5, Bootstrap,
JQuery and socket.io .

FYI: Comments and explaination below are in french for now for the sake of simplicity, as this POC is addressed to french speaking audiance.
(english version could follow later)

## Live demo
http://ica-poc.herokuapp.com/back-office
http://ica-poc.herokuapp.com/screen


## Environement requis
- Développé sous node 12.18.2

## Démarrage
1) Clonez le repository `git clone https://github.com/olivier-soumillon/ica-poc.git`
2) Ouvrez un terminal à la racine du repository
3) Exécutez la commande ```npm install```
4) Exécutez la commande ```node server.js```
5) Le message `Server listening on port 8080 ;)` devrait apparaître dans le terminal
6) Avec votre browser, rendez-vous à l'url ```http://localhost:8080/back-office```
7) Avec votre browser, rendez-vous à l'url ```http://localhost:8080/screen```

## Fonctionnement

### BACK OFFICE PAGE
1) Emet un événement `CHANNEL_JOIN_BACK_OFFICE` vers le serveur pour rejoindre le channel (room) `CHANNEL_BACK_OFFICE`, lorsque la page est chargée
2) Emet un événement `EVENT_SEND_NOTIFICATION` contenant les données du formulaire vers le serveur lorsque le formulaire est validé

### SERVER
1) Ajoute le socket client back office au channel `CHANNEL_BACK_OFFICE` lorsqu'il reçoit un événement `CHANNEL_JOIN_BACK_OFFICE`
2) Ajoute le socket client screen au channel `CHANNEL_SCREEN` lorsqu'il reçoit un événement `CHANNEL_JOIN_SCREEN`
3) Emet un événement `EVENT_SHOW_NOTIFICATION` sur le channel `CHANNEL_SCREEN` lorsqu'il reçoit un événement `EVENT_SEND_NOTIFICATION` de la part d'un membre du channel `CHANNEL_BACK_OFFICE`

### CLIENT PAGE
1) Emet un événement `CHANNEL_JOIN_SCREEN` vers le serveur pour rejoindre le channel (room) `CHANNEL_SCREEN`, lorsque la page est chargée
2) Ajoute une entrée à la table des notifications lorsqu'il reçoit un événement `EVENT_SHOW_NOTIFICATION` de la part du serveur

Olivier Soumillon
