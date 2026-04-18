import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
            parentName: document.getElementById('parentName').value,
            phone: document.getElementById('parentPhone').value,
            email: document.getElementById('parentEmail').value,
            homeChurch: document.getElementById('homeChurch').value,
            pickupNames: document.getElementById('pickupNames').value,
            medicalNotes: document.getElementById('medicalNotes').value,
            specialNotes: document.getElementById('specialNotes').value,
            tshirtSize: document.getElementById('tshirtSize').value, // SAVES THE T-SHIRT SIZE
            timestamp: serverTimestamp()
        });
        window.location.href = "success.html";
    } catch (error) {
        alert("Registration Error: " + error.message);
        btn.disabled = false;
        btn.textContent = "Register Child";
    }
};
