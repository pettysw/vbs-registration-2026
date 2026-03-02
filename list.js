// ... (Firebase initialization same as above) ...

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
                    <strong>Pick-up:</strong> ${data.pickupNames || 'None listed'}<br>
                    <strong>Medical:</strong> ${data.medicalNotes || 'None listed'}
                </span>
            </div>
            <button onclick="window.deleteEntry('${data.id}')" style="background:#e74c3c; width: auto; padding: 5px 10px; font-size: 12px; cursor:pointer;">Delete</button>
        `;
        explorerList.appendChild(li);
    });
}

// ... (CSV and search logic same as before) ...
