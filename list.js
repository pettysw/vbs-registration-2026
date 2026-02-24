import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your verified Firebase Config
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

const loginOverlay = document.getElementById('loginOverlay');
const adminContent = document.getElementById('adminContent');
const loginBtn = document.getElementById('loginBtn');
const passInput = document.getElementById('passInput');
const explorerList = document.getElementById('explorerList');

// The Lock Logic
loginBtn.onclick = () => {
    // CURRENT PASSWORD: VBS2026
    if (passInput.value === "VBS2026") {
        loginOverlay.style.display = 'none';
        adminContent.style.display = 'block';
        fetchExplorers();
    } else {
        document.getElementById('err').textContent = "Incorrect password. Please try again.";
    }
};

// The Data Fetching Logic
async function fetchExplorers() {
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        document.getElementById('loading').style.display = 'none';
        
        if (querySnapshot.empty) {
            explorerList.innerHTML = "<li>No explorers registered yet.</li>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="explorer-name">${data.childName}</span>
                <span class="explorer-details">
                    Age: ${data.age} | Grade: ${data.grade}<br>
                    Parent: ${data.email} | Phone: ${data.phone}<br>
                    Allergies: ${data.allergies || 'None'}
                </span>
            `;
            explorerList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching explorers:", error);
        document.getElementById('loading').textContent = "Error: Access Denied. Check Firestore Rules.";
    }
}
