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
let currentData = [];

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const userInput = document.getElementById('passInput').value;
            if (userInput === "VBS2026") { 
                document.getElementById('loginOverlay').style.display = 'none';
                document.getElementById('adminContent').style.display = 'block';
                fetchExplorers();
            } else {
                document.getElementById('err').textContent = "Incorrect Password.";
            }
        });
    }

    const showPass = document.getElementById('showPass');
    if (showPass) {
        showPass.onclick = () => {
            document.getElementById('passInput').type = showPass.checked ? "text" : "password";
        };
    }

    document.getElementById('downloadBtn').onclick = downloadCSV;
});

async function fetchExplorers() {
    const explorerList = document.getElementById('explorerList');
    const countDisplay = document.getElementById('totalCount');
    
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        explorerList.innerHTML = ""; 
        countDisplay.textContent = querySnapshot.size;
        currentData = [];

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            currentData.push(data);
            
            const li = document.createElement('li');
            li.style.cssText = "border-bottom:2px solid #3498db; padding:15px 0;";
            
            li.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div style="flex-grow: 1;">
                        <strong style="font-size:1.2em;">${data.lastName}, ${data.firstName}</strong> 
                        <span style="background:#3498db; color:white; padding:2px 8px; border-radius:12px; font-size:0.8em; margin-left:10px;">Grade ${data.grade}</span><br>
                        <div style="margin-top:8px; font-size:0.95em;">
                            <strong>Parent:</strong> ${data.parentName} | <strong>Phone:</strong> ${data.phone}<br>
                            <strong>Church:</strong> ${data.homeChurch || 'None'}<br>
                            <div style="background:#fff3cd; padding:5px; border-radius:4px; margin-top:5px;">
                                <strong>Medical:</strong> ${data.medicalInfo || 'None'}
                            </div>
                            <div style="background:#d4edda; padding:5px; border-radius:4px; margin-top:5px;">
                                <strong>Pickup:</strong> ${data.pickupNames}
                            </div>
                        </div>
                    </div>
                    <button onclick="window.deleteEntry('${id}')" style="background:#e74c3c; color:white; border:none; padding:10px; border-radius:6px; cursor:pointer;">Delete</button>
                </div>
            `;
            explorerList.appendChild(li);
        });
    } catch (e) {
        console.error(e);
    }
}

function downloadCSV() {
    if (currentData.length === 0) return alert("No data to download!");
    
    let csvContent = "data:text/csv;charset=utf-8,First Name,Last Name,Grade,Parent,Phone,Email,Church,Medical,Pickup\n";
    
    currentData.forEach(child => {
        let row = [
            child.firstName,
            child.lastName,
            child.grade,
            child.parentName,
            child.phone,
            child.email,
            child.homeChurch || 'None',
            `"${child.medicalInfo || 'None'}"`,
            `"${child.pickupNames || 'None'}"`
        ].join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "VBS_2026_Roster.csv");
    document.body.appendChild(link);
    link.click();
}

window.deleteEntry = async (id) => {
    if (confirm("Permanently delete this child's record?")) {
        await deleteDoc(doc(db, "registrations", id));
        fetchExplorers();
    }
};
