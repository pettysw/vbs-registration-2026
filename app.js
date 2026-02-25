import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB9wvQ525wCsxZmIZmfzj6Z5VjF2aSUu_g",
    authDomain: "registervbs-83306.firebaseapp.com",
    projectId: "registervbs-83306",
    storageBucket: "registervbs-83306.firebasestorage.app",
    messagingSenderId: "462529063270",
    appId: "1:462529063270:web:40c1333dc7c450345300a7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('registrationForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = "Registering...";

    try {
        await addDoc(collection(db, "registrations"), {
            firstName: document.getElementById('childFirstName').value,
            lastName: document.getElementById('childLastName').value,
            grade: document.getElementById('grade').value,
            email: document.getElementById('parentEmail').value,
            phone: document.getElementById('parentPhone').value,
            timestamp: new Date()
        });

        document.getElementById('registrationForm').reset();
        document.getElementById('successMsg').style.display = 'block';
        btn.textContent = "Register Another Explorer";
        btn.disabled = false;
    } catch (error) {
        alert("Error saving registration: " + error.message);
        btn.disabled = false;
        btn.textContent = "Register Explorer";
    }
};
