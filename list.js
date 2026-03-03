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

// Functions for the buttons
window.toggleMyPass = () => {
    const p = document.getElementById('passInput');
    const b = document.getElementById('togglePass');
    p.type = (p.type === 'password') ? 'text' : 'password';
    b.textContent = (p.type === 'password') ? 'Show' : 'Hide';
};

window.adminLogin = async () => {
    const pass = document.getElementById('passInput').value;
    try {
        const snap = await getDoc(doc(db, "config", "admin_settings"));
        if (snap.exists() && pass === snap.data().passcode) {
            document.getElementById('loginOverlay').style.display = 'none';
            document.getElementById('adminContent').style.display = 'block';
            fetchRoster();
        } else { document.getElementById('err').textContent = "Wrong passcode."; }
    } catch (e) { document.getElementById('err').textContent = "Error."; }
};

async function fetchRoster() {
    const snap = await getDocs(collection(db, "registrations"));
    currentRoster = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    document.getElementById('countDisplay').textContent = currentRoster.length;
    
    // ATTACH FILTER LOGIC
    document.getElementById('adminSearch').oninput = (e) => {
        const val = e.target.value.toLowerCase();
        const filtered = currentRoster.filter(c => 
            c.firstName.toLowerCase().includes(val) || 
            c.lastName.toLowerCase().includes(val)
        );
        render(filtered);
    };
    render(currentRoster);
}

function render(list) {
    const listDiv = document.getElementById('explorerList');
    listDiv.innerHTML = "";
    list.forEach(d => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${d.lastName}, ${d.firstName}</strong> (Grade: ${d.grade})<br>
                <span style="font-size:0.95em; color:#333; line-height:1.7;">
                    <strong>Parent:</strong> ${d.parentName}<br>
                    <strong>Phone:</strong> ${d.phone}<br>
                    <strong>Email:</strong> ${d.email}<br>
                    <strong>Pick-up:</strong> ${d.pickupNames || 'N/A'}<br>
                    <strong>Allergies:</strong> ${d.medicalNotes || 'None'}<br>
                    <strong>Special Notes:</strong> ${d.specialNotes || 'None'}<br>
                    <strong>Home Church:</strong> ${d.homeChurch || 'None'}
                </span>
            </div>
            <button onclick="window.del('${d.id}')" class="delete-btn">Delete</button>
        `;
        listDiv.appendChild(li);
    });
}

window.downloadRoster = () => {
    let csv = "Child,Grade,Parent,Phone,Email,Church,PickUp,Allergies,Special Notes\n";
    currentRoster.forEach(d => {
        csv += `"${d.firstName} ${d.lastName}","${d.grade}","${d.parentName}","${d.phone}","${d.email}","${d.homeChurch}","${d.pickupNames}","${d.medicalNotes}","${d.specialNotes}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VBS_Roster_2026.csv';
    a.click();
};

window.del = async (id) => {
    if (confirm("Delete child?")) {
        await deleteDoc(doc(db, "registrations", id));
        fetchRoster();
    }
};
