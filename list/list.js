const firebaseConfig = {
}; // firebase config here

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

auth.onAuthStateChanged(user => {
    if (user) {
        loadSessions(user.uid);
    } else {
        window.location.href = '../index.html';
    }
});

function addSession() {
    var user = auth.currentUser;
    var userId = user.uid;
    var sessionName = prompt("Enter session name:");
    if (sessionName) {
        database.ref('users/' + userId + '/sessions').push({
            name: sessionName,
            question: ""
        });
    }
    loadSessions(userId);
}

function deleteSession(sessionId) {
    var user = auth.currentUser;
    var userId = user.uid;
    if (confirm("Are you sure you want to delete this session?")) {
        database.ref('users/' + userId + '/sessions/'+sessionId).remove();
    }
    loadSessions(userId)
}

function loadSessions(userId) {
    var sessionList = document.getElementById('sessionList');
    sessionList.innerHTML = '';

    database.ref('users/' + userId + '/sessions').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var sessionData = childSnapshot.val();
            var sessionId = childSnapshot.key;
            var sessionItem = document.createElement('li');

            var sessionButton = document.createElement('button');
            sessionButton.classList.add('session-button');

            sessionButton.textContent = sessionData.name;
            sessionButton.addEventListener('click', function () {
                window.location.href = '../main/main.html?sessionId=' + sessionId;
            });

            sessionItem.appendChild(sessionButton);

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', function () {
                deleteSession(sessionId);
            });

            sessionItem.appendChild(deleteButton);

            sessionList.appendChild(sessionItem);
        });
    });
}


function signOut() {
    auth.signOut().then(function () {
    }).catch(function (error) {
    });
}
