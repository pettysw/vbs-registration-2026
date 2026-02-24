import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// VERIFIED FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyB9wvQ525wCsxZmIZmfzj6Z5VjF2aSUu_g",
    authDomain: "registervbs-83306.firebaseapp.com",
    projectId: "registervbs-83306",
    storageBucket: "registervbs-83306.firebasestorage.app",
    messagingSenderId: "462529063270",
    appId: "1:462529063270:web:40c1333dc7c450345300a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Monitor Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        fetchExplorers();
    } else {
        document.getElementById('loginOverlay').style.display = 'block';
        document.getElementById('adminContent').style.display = 'none';
    }
});

// Show Password Toggle
document.getElementById('showPass').onclick = () => {
    const passInput = document.getElementById('passInput');
    passInput.type = document.getElementById('showPass').checked ? "text" : "password";
};

// Login Functionality
document.getElementById('loginBtn').onclick = async () => {
    const email = "admin@yourchurch.com"; //
    const password = document.getElementById('passInput').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        // Displays the actual error from Firebase on your screen
        document.getElementById('err').textContent = "Error: " + error.message;
    }
};

// Sign Out Functionality
document.getElementById('logoutBtn').onclick = async () => {
    await signOut(auth);
    location.reload();
};

// Fetch and Display Registrations
async function fetchExplorers() {
    const explorerList = document.getElementById('explorerList');
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        document.getElementById('loading').style.display = 'none';
        explorerList.innerHTML = ""; 
        
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const li = document.createElement('li');
            li.style.cssText = "display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 10px 0;";
            li.innerHTML = `
                <div>
                    <strong>${data.childName}</strong> (Grade: ${data.grade})<br>
                    Parent: ${data.email} | Phone: ${data.phone}
                </div>
                <button onclick="window.deleteEntry('${id}')" style="background:#e74c3c; color:white; border:none; padding:8px; cursor:pointer; border-radius:4px;">Delete</button>
            `;
            explorerList.appendChild(li);
        });
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

// Global Delete Function
window.deleteEntry = async (id) => {
    if (confirm("Permanently delete this explorer?")) {
        await deleteDoc(doc(db, "registrations", id));
        location.reload();
    }
};
