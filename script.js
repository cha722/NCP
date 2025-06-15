// JSONBin configuration
const BIN_ID = 'your-jsonbin-id'; // Replace with your actual bin ID
const API_KEY = '$2a$10$...'; // Replace with your actual API key
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

// Fixed pharmacist credentials
const PHARMACIST_CREDENTIALS = {
    username: 'DrHaniC',
    password: 'NewCHAARpcy@1'
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // 1. Check pharmacist credentials first
    if(username === PHARMACIST_CREDENTIALS.username && 
       password === PHARMACIST_CREDENTIALS.password) {
        sessionStorage.setItem('userRole', 'pharmacist');
        window.location.href = 'pharmacist.html';
        return;
    }
    
    try {
        // 2. Check patient credentials
        const response = await fetch(API_URL, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await response.json();
        const patients = data.record?.patients || [];
        
        // Find matching patient
        const patient = patients.find(p => 
            p.username === username && p.password === password
        );
        
        if(patient) {
            sessionStorage.setItem('userRole', 'patient');
            sessionStorage.setItem('currentPatient', JSON.stringify(patient));
            window.location.href = 'patient.html';
        } else {
            // 3. Check doctor credentials (could be hardcoded or in JSONBin)
            if(username === 'doctor' && password === 'SecureDoctorPass123') {
                sessionStorage.setItem('userRole', 'doctor');
                window.location.href = 'doctor.html';
            } else {
                loginMessage.textContent = 'Invalid credentials!';
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        loginMessage.textContent = 'System error. Please try again.';
    }
});

// Add this to all pages for authentication
function checkAuth(requiredRole) {
    const userRole = sessionStorage.getItem('userRole');
    
    if(!userRole || userRole !== requiredRole) {
        window.location.href = 'index.html';
    }
}

// Add this to all pages for logout
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
}
