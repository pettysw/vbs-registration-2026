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

// Phone Formatter
const phoneInput = document.getElementById('parentPhone');
if (phoneInput) {
    phoneInput.oninput = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = "";
        if (value.length > 0) {
            formatted = "(" + value.substring(0, 3);
            if (value.length > 3) formatted += ") " + value.substring(3, 6);
            if (value.length > 6) formatted += "-" + value.substring(6, 10);
        }
        e.target.value = formatted;
    };
}

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
            timestamp: new Date()
        });
        window.location.href = "success.html";
    } catch (error) {
        alert("Error: " + error.message);
        btn.disabled = false;
        btn.textContent = "Register Explorer";
    }
};
