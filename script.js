// JSONBin configuration
const BIN_ID = '684e7de18960c979a5aa2be0';
const API_KEY = '$2a$10$e8COjJNqV/ReJs5XiIW7aOntP2QEh3F8EDXCeUmx4oMyRzg2NHobm';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const LATEST_URL = `${API_URL}/latest`;

// Fixed pharmacist credentials
const PHARMACIST_CREDENTIALS = {
    username: 'DrHaniC',
    password: 'NewCHAARpcy@1'
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

// Handle login
if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';
        loginMessage.textContent = '';
        
        // Check pharmacist
        if(username === PHARMACIST_CREDENTIALS.username && 
           password === PHARMACIST_CREDENTIALS.password) {
            sessionStorage.setItem('userRole', 'pharmacist');
            window.location.href = 'pharmacist.html';
            return;
        }
        
        try {
            // Get all users
            const response = await fetch(LATEST_URL, {
                headers: { 'X-Master-Key': API_KEY }
            });
            const data = await response.json();
            const binData = data.record;
            
            // Check doctor
            if(binData.doctor && 
               binData.doctor.username === username && 
               binData.doctor.password === password) {
                sessionStorage.setItem('userRole', 'doctor');
                window.location.href = 'doctor.html';
                return;
            }
            
            // Check patients
            const patient = binData.patients?.find(p => 
                p.username === username && p.password === password
            );
            
            if(patient) {
                sessionStorage.setItem('userRole', 'patient');
                sessionStorage.setItem('currentPatient', JSON.stringify(patient));
                window.location.href = 'patient.html';
                return;
            }
            
            // Invalid credentials
            loginMessage.textContent = 'Invalid username or password';
            
        } catch (error) {
            console.error('Login error:', error);
            loginMessage.textContent = 'System error. Please try again.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });
}

// Authentication functions
function checkAuth(requiredRole) {
    const userRole = sessionStorage.getItem('userRole');
    if(!userRole || userRole !== requiredRole) {
        window.location.href = 'index.html';
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
}
