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
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const userInput = document.getElementById('passInput').value;
            const errDiv = document.getElementById('err');
            
            try {
                // Fixed database passcode fetch
                const configSnap = await getDoc(doc(db, "config", "admin_settings"));
                if (configSnap.exists() && userInput === configSnap.data().passcode) { 
                    document.getElementById('loginOverlay').style.display = 'none';
                    document.getElementById('adminContent').style.display = 'block';
                    fetchExplorers();
                } else {
                    errDiv.textContent = "Incorrect Password.";
                }
            } catch (e) { 
                errDiv.textContent = "Login Failed. Check Firestore Config.";
            }
        });
    }
});

async function fetchExplorers() {
    const explorerList = document.getElementById('explorerList');
    const csvContainer = document.getElementById('csvContainer');
    const searchInput = document.getElementById('adminSearch');
    
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        allExplorers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Single line header layout fix
        csvContainer.className = "csv-btn-center";
        csvContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:20px;">
                <h2 style="margin:0; white-space: nowrap;">VBS 2026 Roster</h2>
                <button id="downloadCSV" style="width: auto; background: #27ae60; margin-left: 20px;">Download Roster</button>
                <span style="font-weight:bold;">Total Children: ${allExplorers.length}</span>
            </div>
        `;
        
        document.getElementById('downloadCSV').onclick = downloadCSV;
        renderList(allExplorers);

        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allExplorers.filter(ex => 
                ex.firstName.toLowerCase().includes(term) || 
                ex.lastName.toLowerCase().includes(term) || 
                ex.parentName.toLowerCase().includes(term)
            );
            renderList(filtered);
        };
    } catch (e) { console.error(e); }
}

function renderList(list) {
    const explorerList = document.getElementById('explorerList');
    explorerList.innerHTML = "";
    list.forEach(data => {
        const li = document.createElement('li');
        li.style.cssText = "display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding:12px 0;";
        li.innerHTML = `
            <div>
                <strong>${data.lastName}, ${data.firstName}</strong> (Grade: ${data.grade})<br>
                <span style="font-size: 0.9em; color: #666;">
                    Parent: ${data.parentName}<br>
                    Email: ${data.email} | Phone: ${data.phone}<br>
                    <strong>Allergies:</strong> ${data.allergies || 'None'}<br>
                    <strong>Medical:</strong> ${data.medicalInfo || 'None'}
                </span>
            </div>
            <button onclick="window.deleteEntry('${data.id}')" style="background:#e74c3c; width: auto; padding: 5px 10px; font-size: 12px; cursor:pointer;">Delete</button>
        `;
        explorerList.appendChild(li);
    });
}

function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Child,Grade,Parent,Phone,Email,Allergies,Medical\n";
    allExplorers.forEach(d => {
        csvContent += `"${d.firstName} ${d.lastName}","${d.grade}","${d.parentName}","${d.phone}","${d.email}","${d.allergies}","${d.medicalInfo}"\n`;
    });
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "VBS_Roster_2026.csv");
    document.body.appendChild(link);
    link.click();
}

window.deleteEntry = async (id) => {
    if (confirm("Permanently delete this entry?")) {
        await deleteDoc(doc(db, "registrations", id));
        fetchExplorers();
    }
};
