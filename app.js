import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Fix login button responsiveness with modern listener
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const userInput = document.getElementById('passInput').value;
            // Secret admin password check
            if (userInput === "VBS2026") { 
                document.getElementById('loginOverlay').style.display = 'none';
                document.getElementById('adminContent').style.display = 'block';
                fetchExplorers();
            } else {
                const errDiv = document.getElementById('err');
                if (errDiv) errDiv.textContent = "Incorrect Password.";
            }
        });
    }

    const showPass = document.getElementById('showPass');
    if (showPass) {
        showPass.onclick = () => {
            document.getElementById('passInput').type = showPass.checked ? "text" : "password";
        };
    }
});

async function fetchExplorers() {
    const explorerList = document.getElementById('explorerList');
    const countDisplay = document.getElementById('totalCount');
    
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        const loadingMsg = document.getElementById('loading');
        if (loadingMsg) loadingMsg.style.display = 'none';
        
        explorerList.innerHTML = ""; 
        // Display total registered count
        countDisplay.textContent = querySnapshot.size;

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const li = document.createElement('li');
            li.style.cssText = "display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding:12px 0;";
            
            // Reordered Admin Display Template
            // Order: Parent Name -> Phone -> Email -> Home Church
            li.innerHTML = `
                <div style="flex-grow: 1; padding-right: 15px;">
                    <strong>${data.lastName}, ${data.firstName}</strong> (Grade: ${data.grade})<br>
                    <span style="font-size: 0.9em; color: #666;">
                        Parent: ${data.parentName || 'N/A'}<br>
                        Phone: ${data.phone}<br>
                        Email: ${data.email || 'N/A'}<br>
                        Church: ${data.homeChurch || 'None'}
                    </span>
                </div>
                <button onclick="window.deleteEntry('${id}')" 
                        style="background:#e74c3c; color:white; border:none; padding:8px 0; border-radius:4px; width: 80px; min-width: 80px; text-align: center; font-weight: bold; cursor:pointer;">
                    Delete
                </button>
            `;
            explorerList.appendChild(li);
        });
    } catch (e) {
        const errDiv = document.getElementById('err');
        if (errDiv) errDiv.textContent = "Database Error. Ensure Firebase Rules are correct.";
    }
}

// Global delete function
window.deleteEntry = async (id) => {
    if (confirm("Permanently delete this explorer?")) {
        await deleteDoc(doc(db, "registrations", id));
        fetchExplorers();
    }
};

