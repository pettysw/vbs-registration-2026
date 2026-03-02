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
let allExplorers = [];

document.addEventListener('DOMContentLoaded', () => {
    // Show/Hide Password Logic
    const passInput = document.getElementById('passInput');
    const toggleBtn = document.getElementById('togglePass');
    if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passInput.setAttribute('type', type);
            toggleBtn.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    }

    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const userInput = passInput.value;
            const errDiv = document.getElementById('err');
            try {
                const configSnap = await getDoc(doc(db, "config", "admin_settings"));
                if (configSnap.exists() && userInput === configSnap.data().passcode) { 
                    document.getElementById('loginOverlay').style.display = 'none';
                    document.getElementById('adminContent').style.display = 'block';
                    fetchExplorers();
                } else {
                    errDiv.textContent = "Incorrect Password.";
                }
            } catch (e) { errDiv.textContent = "Access Denied."; }
        });
    }
});

async function fetchExplorers() {
    const explorerList = document.getElementById('explorerList');
    const csvContainer = document.getElementById('csvContainer');
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        allExplorers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (csvContainer) {
            csvContainer.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:20px;">
                    <h2 style="white-space: nowrap;">VBS 2026 Roster</h2>
                    <button id="downloadCSV" style="width: auto; background: #27ae60; margin-left: 20px;">Download Roster</button>
                    <span style="font-weight:bold;">Total: ${allExplorers.length}</span>
                </div>
            `;
            document.getElementById('downloadCSV').onclick = downloadCSV;
        }
        renderList(allExplorers);
    } catch (e) { console.error(e); }
}

function renderList(list) {
    const explorerList = document.getElementById('explorerList');
    if (!explorerList) return;
    explorerList.innerHTML = "";
    list.forEach(data => {
        const li = document.createElement('li');
        li.style.cssText = "border-bottom:1px solid #eee; padding:15px 0;";
        li.innerHTML = `
            <div>
                <strong>${data.lastName}, ${data.firstName}</strong> (Grade: ${data.grade})<br>
                <span style="font-size: 0.9em; color: #666;">
                    Parent: ${data.parentName}<br>
                    Pick-up: ${data.pickupNames || 'N/A'}<br>
                    Medical: ${data.medicalNotes || 'N/A'}
                </span>
            </div>
            <button onclick="window.deleteEntry('${data.id}')" style="background:#e74c3c; width: auto; padding: 5px 10px; font-size: 12px; margin-top: 10px;">Delete</button>
        `;
        explorerList.appendChild(li);
    });
}

function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Child,Grade,Parent,Phone,Email,PickUp,Medical\n";
    allExplorers.forEach(d => {
        csvContent += `"${d.firstName} ${d.lastName}","${d.grade}","${d.parentName}","${d.phone}","${d.email}","${d.pickupNames}","${d.medicalNotes}"\n`;
    });
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "VBS_Roster_2026.csv");
    document.body.appendChild(link);
    link.click();
}

window.deleteEntry = async (id) => {
    if (confirm("Delete this entry?")) {
        await deleteDoc(doc(db, "registrations", id));
        fetchExplorers();
    }
};
