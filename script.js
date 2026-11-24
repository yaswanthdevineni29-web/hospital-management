
// CAREPLUS HOSPITAL MANAGEMENT SYSTEM

// Initial demo data
let patients = JSON.parse(localStorage.getItem("carePatients")) || [
    {name:"Rahul Sharma", age:28, gender:"Male", phone:"9876543210"},
    {name:"Priya Reddy", age:24, gender:"Female", phone:"9876543211"},
    {name:"Arjun Kumar", age:35, gender:"Male", phone:"9876543212"}
];

let appointments = JSON.parse(localStorage.getItem("careAppointments")) || [
    {patient:"Rahul Sharma", doctor:"Dr. Anil Kumar", department:"Cardiology", date:"2026-11-23", status:"Confirmed"},
    {patient:"Priya Reddy", doctor:"Dr. Sneha Rao", department:"Neurology", date:"2026-11-23", status:"Pending"},
    {patient:"Arjun Kumar", doctor:"Dr. Ravi Teja", department:"Orthopedics", date:"2026-11-24", status:"Confirmed"}
];

// Save data
function saveData() {
    localStorage.setItem("carePatients", JSON.stringify(patients));
    localStorage.setItem("careAppointments", JSON.stringify(appointments));
}

// Safe HTML text
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#39;"
    })[char]);
}

// Format date
function formatDate(date) {
    if (!date) return "-";
    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
        day:"2-digit",
        month:"short",
        year:"numeric"
    });
}

// UPDATE DASHBOARD
function updateDashboard() {
    document.getElementById("totalPatients").textContent =
        (1245 + patients.length).toLocaleString("en-IN");

    document.getElementById("totalAppointments").textContent =
        83 + appointments.length;

    document.getElementById("reportPatients").textContent =
        (1245 + patients.length).toLocaleString("en-IN");

    document.getElementById("reportAppointments").textContent =
        83 + appointments.length;

    renderPatients();
    renderAppointments();
    renderDashboardAppointments();
}

// NAVIGATION
function navigate(page) {
    document.querySelectorAll(".page").forEach(section => {
        section.classList.add("hidden");
    });

    const target = document.getElementById(page + "-page");

    if (!target) return;

    target.classList.remove("hidden");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.dataset.page === page);
    });

    const titles = {
        dashboard:"Dashboard",
        patients:"Patients",
        doctors:"Doctors",
        appointments:"Appointments",
        departments:"Departments",
        billing:"Billing",
        reports:"Reports",
        settings:"Settings"
    };

    document.getElementById("page-title").textContent = titles[page] || page;

    document.getElementById("sidebar").classList.remove("open");
}

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        navigate(this.dataset.page);
    });
});

// SIDEBAR TOGGLE
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
}

// PATIENT MODAL
function openModal() {
    document.getElementById("patientModal").classList.add("show");
}

function closeModal() {
    document.getElementById("patientModal").classList.remove("show");
    document.getElementById("patientForm").reset();
}

// REGISTER PATIENT
document.getElementById("patientForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const patient = {
        name: document.getElementById("patientName").value.trim(),
        age: document.getElementById("patientAge").value,
        gender: document.getElementById("patientGender").value,
        phone: document.getElementById("patientPhone").value.trim()
    };

    if (!patient.name || !patient.age || !patient.gender || !patient.phone) {
        alert("Please fill all fields.");
        return;
    }

    if (!/^[0-9]{10}$/.test(patient.phone)) {
        alert("Enter a valid 10-digit phone number.");
        return;
    }

    patients.push(patient);

    saveData();
    updateDashboard();
    closeModal();

    alert("Patient registered successfully!");
    navigate("patients");
});

// DISPLAY PATIENTS
function renderPatients() {
    const table = document.getElementById("patientTable");

    if (patients.length === 0) {
        table.innerHTML = `<tr><td colspan="5">No patient records found.</td></tr>`;
        return;
    }

    table.innerHTML = patients.map((p, index) => `
        <tr>
            <td>${escapeHTML(p.name)}</td>
            <td>${escapeHTML(p.age)}</td>
            <td>${escapeHTML(p.gender)}</td>
            <td>${escapeHTML(p.phone)}</td>
            <td>
                <button class="delete-btn" onclick="deletePatient(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

// DELETE PATIENT
function deletePatient(index) {
    if (confirm("Are you sure you want to delete this patient?")) {
        patients.splice(index, 1);
        saveData();
        updateDashboard();
        alert("Patient deleted successfully!");
    }
}

// APPOINTMENT MODAL
function appointmentForm() {
    document.getElementById("appointmentModal").classList.add("show");
}

function closeAppointment() {
    document.getElementById("appointmentModal").classList.remove("show");
    document.getElementById("appointmentForm").reset();
}

// BOOK APPOINTMENT
document.getElementById("appointmentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const appointment = {
        patient: document.getElementById("appointmentPatient").value.trim(),
        doctor: document.getElementById("appointmentDoctor").value,
        department: document.getElementById("appointmentDepartment").value,
        date: document.getElementById("appointmentDate").value,
        status: "Confirmed"
    };

    if (!appointment.patient || !appointment.date) {
        alert("Please complete the appointment form.");
        return;
    }

    if (appointment.date < new Date().toLocaleDateString("en-CA")) {
        alert("Please select today or a future date.");
        return;
    }

    appointments.push(appointment);

    saveData();
    updateDashboard();
    closeAppointment();

    alert("Appointment booked successfully!");
    navigate("appointments");
});

// APPOINTMENT TABLE
function renderAppointments() {
    const table = document.getElementById("appointmentTable");

    if (appointments.length === 0) {
        table.innerHTML = `<tr><td colspan="5">No appointments found.</td></tr>`;
        return;
    }

    table.innerHTML = appointments.map(a => `
        <tr>
            <td>${escapeHTML(a.patient)}</td>
            <td>${escapeHTML(a.doctor)}</td>
            <td>${escapeHTML(a.department)}</td>
            <td>${formatDate(a.date)}</td>
            <td><span class="status ${a.status === "Pending" ? "pending" : "confirmed"}">
                ${escapeHTML(a.status)}
            </span></td>
        </tr>
    `).join("");
}

// DASHBOARD RECENT APPOINTMENTS
function renderDashboardAppointments() {
    const table = document.getElementById("dashboardAppointments");

    const recent = [...appointments].reverse().slice(0, 5);

    if (!recent.length) {
        table.innerHTML = `<tr><td colspan="5">No appointments available.</td></tr>`;
        return;
    }

    table.innerHTML = recent.map(a => `
        <tr>
            <td>${escapeHTML(a.patient)}</td>
            <td>${escapeHTML(a.doctor)}</td>
            <td>${escapeHTML(a.department)}</td>
            <td>${formatDate(a.date)}</td>
            <td><span class="status ${a.status === "Pending" ? "pending" : "confirmed"}">
                ${escapeHTML(a.status)}
            </span></td>
        </tr>
    `).join("");
}

// GLOBAL SEARCH
document.getElementById("globalSearch").addEventListener("input", function() {
    const search = this.value.toLowerCase();

    if (!document.getElementById("patients-page").classList.contains("hidden")) {
        const filtered = patients.filter(p =>
            p.name.toLowerCase().includes(search) ||
            p.phone.includes(search)
        );

        document.getElementById("patientTable").innerHTML = filtered.length
            ? filtered.map(p => `
                <tr>
                    <td>${escapeHTML(p.name)}</td>
                    <td>${escapeHTML(p.age)}</td>
                    <td>${escapeHTML(p.gender)}</td>
                    <td>${escapeHTML(p.phone)}</td>
                    <td>Patient</td>
                </tr>
            `).join("")
            : `<tr><td colspan="5">No matching patients found.</td></tr>`;
    } else {
        navigate("patients");
        this.focus();
        this.dispatchEvent(new Event("input"));
    }
});

// BILL GENERATION
function generateBill() {
    const name = document.getElementById("billName").value.trim();
    const consultation = Number(document.getElementById("consultFee").value);
    const medicine = Number(document.getElementById("medicineFee").value);
    const other = Number(document.getElementById("otherFee").value);

    if (!name || [consultation, medicine, other].some(n => !Number.isFinite(n) || n < 0)) {
        alert("Enter a valid patient name and charges.");
        return;
    }

    const total = consultation + medicine + other;

    document.getElementById("billResult").innerHTML = `
        <hr>
        <h3>CAREPLUS HOSPITAL</h3>
        <p>Patient: ${escapeHTML(name)}</p>
        <p>Consultation: ₹${consultation.toFixed(2)}</p>
        <p>Medicine: ₹${medicine.toFixed(2)}</p>
        <p>Other Charges: ₹${other.toFixed(2)}</p>
        <hr>
        <h3>Total Amount: ₹${total.toFixed(2)}</h3>
        <button class="primary-btn" onclick="window.print()">Print Bill</button>
    `;
}

// NOTIFICATIONS
function showNotifications() {
    alert("Hospital Notifications\n\n• Welcome to CarePlus!\n• Check today's appointments.\n• Review patient registrations.");
}

// CLOSE MODALS ON BACKGROUND CLICK
document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
});

// INITIALIZE WEBSITE
saveData();
updateDashboard();
navigate("dashboard");

// Set appointment minimum date to today
document.getElementById("appointmentDate").min =
    new Date().toLocaleDateString("en-CA");
