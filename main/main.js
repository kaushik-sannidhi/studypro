const firebaseConfig = {
//firebase config here
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

auth.onAuthStateChanged(user => {
    if (user) {
        loadMessages()
    } else {
        window.location.href = '../index.html';
    }
});

const url = window.location.href;
const urlParams = new URLSearchParams(url.split('?')[1]);
const sessionId = urlParams.get('sessionId');

function loadMessages() {
    const chatSection = document.getElementById('chat-messages');

    const chatsRef = database.ref(`users/${auth.currentUser.uid}/sessions/${sessionId}/chats`);

    chatsRef.on('child_added', function (snapshot) {
        const message = snapshot.val();
        const messageElement = document.createElement('div');
        messageElement.className = 'user-message';
        messageElement.textContent = message;
        messageElement.style.marginBottom = '20px';

        chatSection.appendChild(messageElement);
        chatSection.scrollTop = chatSection.scrollHeight;
    });
}

window.addEventListener('load', loadMessages);

function sendMessage() {
    const userMessage = document.getElementById('user-message').value;
    const text = userMessage;
    if (text) {

        document.getElementById('user-message').value = '';

        const chatsRef = database.ref('users/' + auth.currentUser.uid + '/sessions/' + sessionId + '/chats');
        chatsRef.push(text);
        hereco(text);
    }
}

function submitInput() {
    const userQuestion = document.getElementById('user-input').value;
    const currentQuestion = document.getElementById('current-question');

    if (userQuestion) {
        currentQuestion.innerText = userQuestion;
        const questionsRef = database.ref('users/' + auth.currentUser.uid + '/sessions/' + sessionId);
        questionsRef.update({
            "question": userQuestion
        });

        hereco("I need help with the following: " + userQuestion);

        currentQuestion.textContent = userQuestion;
        document.getElementById('user-input').value = '';
    }
}

function signOut() {
    auth.signOut().then(function () {
        window.location.href = '../index.html';
    }).catch(function (error) {
        console.error('Sign-out error:', error);
    });
}

function goBack() {
    window.location.href = '../list/list.html';
}

const hereco = async (question) => {
    const cohereApiKey = ''; //put ur api key here
    const cohereEndpointUrl = 'https://api.cohere.ai/v1/generate';
    const chatsRef = database.ref(`users/${auth.currentUser.uid}/sessions/${sessionId}/chats`);

    const cohereReq = {
        model: 'command-light',
        prompt: question,
        max_tokens: 100,
        temperature: 0.9,
        k: 0,
        p: 0.75,
        stop_sequences: [],
        return_likelihoods: 'NONE'
    };

    const reqBody = JSON.stringify(cohereReq);

    const response = await fetch(cohereEndpointUrl, {
        method: 'POST', headers: {
            'Authorization': `Bearer ${cohereApiKey}`,
            'Content-Type': 'application/json',
            "Cohere-Version": "2022-12-06"
        }, body: reqBody
    });

    const responseBody = await response.json();
    chatsRef.push("Study Sage: "+responseBody.generations[0].text);
};
