import { renderDashboard } from '../components/App.js';
import { getTranslation } from './i18n.js';

// Simulated user database
const users = [
    { 
        id: 'user1', 
        name: 'Test Patient', 
        email: 'patient@example.com', 
        password: 'password123', 
        role: 'patient' 
    },
    { 
        id: 'doc1', 
        name: 'Dr. Smith', 
        email: 'doctor@example.com', 
        password: 'doctor123', 
        role: 'doctor',
        patients: ['user1'] 
    }
];

let currentUser = null;

export function getCurrentUser() {
    // Check session storage first
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser && !currentUser) {
        currentUser = JSON.parse(storedUser);
    }
    return currentUser;
}

export function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        // Don't store password in session
        const { password, ...userWithoutPassword } = user;
        currentUser = userWithoutPassword;
        sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return userWithoutPassword;
    }
    return null;
}

export function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
}

export function register(userData) {
    // In a real app, this would send data to a server
    const newUser = {
        id: `user${Date.now()}`,
        ...userData,
        role: 'patient'
    };
    
    users.push(newUser);
    return login(userData.email, userData.password);
}

export function initAuth(container) {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        renderDashboard(container, currentUser);
    } else {
        showLoginForm(container);
    }
}

export function showLoginForm(container) {
    container.innerHTML = '';
    
    const authForm = document.createElement('div');
    authForm.className = 'auth-form';
    
    // Tabs for login/register
    const tabs = document.createElement('div');
    tabs.className = 'auth-tabs';
    
    const loginTab = document.createElement('div');
    loginTab.className = 'auth-tab active';
    loginTab.textContent = getTranslation('login');
    
    const registerTab = document.createElement('div');
    registerTab.className = 'auth-tab';
    registerTab.textContent = getTranslation('register');
    
    tabs.appendChild(loginTab);
    tabs.appendChild(registerTab);
    
    // Form container
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';
    
    // Login form
    const loginForm = document.createElement('form');
    loginForm.className = 'login-form';
    loginForm.innerHTML = `
        <h2>${getTranslation('login')}</h2>
        <div class="form-group">
            <label for="email">${getTranslation('email')}</label>
            <input type="email" id="email" required>
        </div>
        <div class="form-group">
            <label for="password">${getTranslation('password')}</label>
            <input type="password" id="password" required>
        </div>
        <div class="form-error" id="login-error"></div>
        <button type="submit" class="btn primary-btn">${getTranslation('login')}</button>
    `;
    
    // Register form
    const registerForm = document.createElement('form');
    registerForm.className = 'register-form hidden';
    registerForm.innerHTML = `
        <h2>${getTranslation('register')}</h2>
        <div class="form-group">
            <label for="reg-name">${getTranslation('fullName')}</label>
            <input type="text" id="reg-name" required>
        </div>
        <div class="form-group">
            <label for="reg-email">${getTranslation('email')}</label>
            <input type="email" id="reg-email" required>
        </div>
        <div class="form-group">
            <label for="reg-password">${getTranslation('password')}</label>
            <input type="password" id="reg-password" required>
        </div>
        <div class="form-group">
            <label for="reg-confirm-password">${getTranslation('confirmPassword')}</label>
            <input type="password" id="reg-confirm-password" required>
        </div>
        <div class="form-error" id="register-error"></div>
        <button type="submit" class="btn primary-btn">${getTranslation('register')}</button>
    `;
    
    formContainer.appendChild(loginForm);
    formContainer.appendChild(registerForm);
    
    authForm.appendChild(tabs);
    authForm.appendChild(formContainer);
    
    // Tab switching logic
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });
    
    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginError = document.getElementById('login-error');
        
        const user = login(email, password);
        if (user) {
            renderDashboard(container, user);
        } else {
            loginError.textContent = getTranslation('invalidCredentials');
        }
    });
    
    // Register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const registerError = document.getElementById('register-error');
        
        if (password !== confirmPassword) {
            registerError.textContent = getTranslation('passwordMismatch');
            return;
        }
        
        const user = register({ name, email, password });
        renderDashboard(container, user);
    });
    
    container.appendChild(authForm);
}