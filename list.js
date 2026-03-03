import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
let currentRoster = [];

// --- FIXED TOGGLE & LOGIN FOR PC ---
window.toggleMyPass = () => {
    const passInput = document.getElementById('passInput');
    const toggleBtn = document.getElementById('togglePass');
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    toggleBtn.textContent = isPass ? 'Hide' : 'Show';
};

window.adminLogin = async () => {
    const userInput = document.getElementById('passInput').value;
    const errDiv = document.getElementById('err');
    try {
        const configSnap = await getDoc(doc(db, "config", "admin_settings"));
        if (configSnap.exists() && userInput === configSnap.data().passcode) { 
            document.getElementById('loginOverlay').style.display = 'none';
            document.getElementById('adminContent').style.display = 'block';
            fetchChildren();
        } else {
            errDiv.textContent = "Incorrect Password.";
        }
    } catch (e) { errDiv.textContent = "Login Error: " + e.message; }
};

async function fetchChildren() {
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        currentRoster = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        document.getElementById('countDisplay').textContent = currentRoster.length;
        renderList(currentRoster);
    } catch (e) { console.error(e); }
}

function renderList(list) {
    const explorerList = document.getElementById('explorerList');
    explorerList.innerHTML = "";
    list.forEach(data => {
        const li = document.createElement('li');
        // Updated Layout: Phone, Email, and Church on their own lines
        li.innerHTML = `
            <div>
                <strong>${data.lastName}, ${data.firstName}</strong> (Grade: ${data.grade})<br>
                <span style="font-size: 0.95em; color: #333; line-height: 1.6;">
                    <strong>Parent:</strong> ${data.parentName}<br>
                    <strong>Phone:</strong> ${data.phone}<br>
                    <strong>Email:</strong> ${data.email}<br>
                    <strong>Pick-up:</strong> ${data.pickupNames || 'N/A'}<br>
                    <strong>Allergies:</strong> ${data.medicalNotes || 'None'}<br>
                    <strong>Special Notes:</strong> ${data.specialNotes || 'None'}<br>
                    <strong>Home Church:</strong> ${data.homeChurch || 'None'}
                </span>
            </div>
            <button onclick="window.deleteEntry('${data.id}')" class="delete-btn">Delete</button>
        `;
        explorerList.appendChild(li);
    });
}

window.downloadRoster = () => {
    // CSV Header with space between "Special" and "Notes"
    let csv = "Child,Grade,Parent,Phone,Email,Church,PickUp,Allergies,Special Notes\n";
    currentRoster.forEach(d => {
        csv += `"${d.firstName} ${d.lastName}","${d.grade}","${d.parentName}","${d.phone}","${d.email}","${d.homeChurch}","${d.pickupNames}","${d.medicalNotes}","${d.specialNotes}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'VBS_Roster_2026.csv');
    a.click();
};

window.deleteEntry = async (id) => {
    if (confirm("Delete this child's record?")) {
        await deleteDoc(doc(db, "registrations", id));
        fetchChildren();
    }
};
