import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// YOUR VERIFIED CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyB9wvQ525wCsxZmIZmfzj6Z5VjF2aSUu_g",
    authDomain: "registervbs-83306.firebaseapp.com",
    projectId: "registervbs-83306",
    storageBucket: "registervbs-83306.firebasestorage.app",
    messagingSenderId: "462529063270",
    appId: "1:462529063270:web:40c1333dc7c450345300a7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// AUTH STATE MONITOR
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

// SHOW PASSWORD TOGGLE
document.getElementById('showPass').onclick = () => {
    document.getElementById('passInput').type = document.getElementById('showPass').checked ? "text" : "password";
};

// LOGIN LOGIC
document.getElementById('loginBtn').onclick = async () => {
    const email = "admin@yourchurch.com"; //
    const password = document.getElementById('passInput').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        // This will now show the REAL error reason
        document.getElementById('err').textContent = "Error: " + error.message;
    }
};

// LOGOUT LOGIC
document.getElementById('logoutBtn').onclick = async () => {
    await signOut(auth);
    location.reload();
};

// DATA FETCHING
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
            li.innerHTML = `
                <div style="margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <strong>${data.childName}</strong> (Grade: ${data.grade})<br>
                    Parent: ${data.email} | Phone: ${data.phone}<br>
                    <button onclick="window.deleteEntry('${id}')" style="background:#e74c3c; color:white; border:none; padding:5px; cursor:pointer; margin-top:5px;">Delete</button>
                </div>
            `;
            explorerList.appendChild(li);
        });
    } catch (e) { console.error(e); }
}

window.deleteEntry = async (id) => {
    if (confirm("Delete this explorer?")) {
        await deleteDoc(doc(db, "registrations", id));
        location.reload();
    }
};
