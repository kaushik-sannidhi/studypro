const firebaseConfig = {
}; //firebase config here

function openContainer() {
    var container = document.querySelector('.container');
    container.classList.add('active');
}

function closeContainer() {
    var container = document.querySelector('.container');
    container.classList.remove('active');
}

var toggleButton = document.querySelector('.toggle');
var closeButton = document.querySelector('.close');

if (toggleButton && closeButton) {
    toggleButton.addEventListener('click', openContainer);
    closeButton.addEventListener('click', closeContainer);
}


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const database = firebase.database();

function register() {
    let email = document.getElementById('signupUsername').value
    let password = document.getElementById('signupPassword').value
    if (validate_email(email) === false || validate_password(password) === false) {
        alert('Email or Password input error')
        return
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(function () {
            var user = auth.currentUser;
            var userId = user.uid;

            var userRef = database.ref('users/' + userId);

            userRef.update({
                password: password, email: email, name: email
            }).then(function () {
                alert('User Created')
                window.location = "../list/list.html";
            }).catch(function (error) {
                var error_message = error.message;
                alert(error_message);
            });

        })
        .catch(function (error) {
            var error_message = error.message
            alert(error_message)
        })
}

function login() {
    email = document.getElementById('loginUsername').value
    password = document.getElementById('loginPassword').value

    if (validate_email(email) === false || validate_password(password) === false) {
        alert('Email or Password input error')
        return
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            firebase.auth().onAuthStateChanged(user => {
                window.location = "../list/list.html";
            });

        })
        .catch(function (error) {
            var error_message = error.message

            alert(error_message)
        })
}


function validate_email(email) {
    if (!email) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function validate_password(password) {
    return password.length >= 6;
}

function validate_field(field) {
    if (field == null) {
        return false
    }

    return field.length > 0;
}
