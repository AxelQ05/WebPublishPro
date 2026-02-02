// Estado de autenticación
const AuthState = {
    users: []
};

// Inicializar autenticación
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    setupAuthEventListeners();
});

// Inicializar sistema de autenticación
function initAuth() {
    // Cargar usuarios desde localStorage
    const savedUsers = localStorage.getItem('webpublish_pro_users');
    if (savedUsers) {
        AuthState.users = JSON.parse(savedUsers);
    }
    
    // Verificar si hay usuario logueado
    const savedUser = localStorage.getItem('webpublish_pro_current_user');
    if (savedUser && (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html'))) {
        // Redirigir al dashboard si ya está logueado
        window.location.href = 'dashboard.html';
    }
}

// Configurar event listeners de autenticación
function setupAuthEventListeners() {
    // Toggle password visibility
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
    const toggleRegisterConfirmPassword = document.getElementById('toggleRegisterConfirmPassword');
    
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', () => togglePasswordVisibility('loginPassword'));
    }
    
    if (toggleRegisterPassword) {
        toggleRegisterPassword.addEventListener('click', () => togglePasswordVisibility('registerPassword'));
    }
    
    if (toggleRegisterConfirmPassword) {
        toggleRegisterConfirmPassword.addEventListener('click', () => togglePasswordVisibility('registerConfirmPassword'));
    }
    
    // Formularios
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validación
    let isValid = true;
    clearFormErrors('login');
    
    if (!validateEmail(email)) {
        showFormError('loginEmailError', 'Por favor ingresa un correo electrónico válido');
        document.getElementById('loginEmail').classList.add('error');
        isValid = false;
    }
    
    if (password.length < 6) {
        showFormError('loginPasswordError', 'La contraseña debe tener al menos 6 caracteres');
        document.getElementById('loginPassword').classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        showToast('error', 'Error de validación', 'Por favor corrige los errores en el formulario');
        return;
    }
    
    // Buscar usuario
    const user = AuthState.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login exitoso
        const currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            registrationDate: user.registrationDate,
            lastLogin: new Date().toISOString(),
            role: 'Estudiante Premium'
        };
        
        // Guardar en localStorage
        localStorage.setItem('webpublish_pro_current_user', JSON.stringify(currentUser));
        
        // Mostrar mensaje de éxito
        showToast('success', '¡Bienvenido de vuelta!', `Has iniciado sesión correctamente como ${user.name}`);
        
        // Redirigir al dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } else {
        // Credenciales incorrectas
        showFormError('loginPasswordError', 'Correo electrónico o contraseña incorrectos');
        document.getElementById('loginEmail').classList.add('error');
        document.getElementById('loginPassword').classList.add('error');
        showToast('error', 'Error de autenticación', 'Correo electrónico o contraseña incorrectos. Verifica tus credenciales.');
    }
}

// Manejar registro
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validación
    let isValid = true;
    clearFormErrors('register');
    
    if (name.length < 2) {
        showFormError('registerNameError', 'Por favor ingresa tu nombre completo');
        document.getElementById('registerName').classList.add('error');
        isValid = false;
    }
    
    if (!validateEmail(email)) {
        showFormError('registerEmailError', 'Por favor ingresa un correo electrónico válido');
        document.getElementById('registerEmail').classList.add('error');
        isValid = false;
    }
    
    if (password.length < 6) {
        showFormError('registerPasswordError', 'La contraseña debe tener al menos 6 caracteres');
        document.getElementById('registerPassword').classList.add('error');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showFormError('registerConfirmPasswordError', 'Las contraseñas no coinciden');
        document.getElementById('registerConfirmPassword').classList.add('error');
        isValid = false;
    }
    
    // Verificar si el usuario ya existe
    const userExists = AuthState.users.some(u => u.email === email);
    if (userExists) {
        showFormError('registerEmailError', 'Este correo electrónico ya está registrado');
        document.getElementById('registerEmail').classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        showToast('error', 'Error de validación', 'Por favor corrige los errores en el formulario');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        role: 'Estudiante',
        joinedDate: new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    };
    
    // Añadir a la lista de usuarios
    AuthState.users.push(newUser);
    localStorage.setItem('webpublish_pro_users', JSON.stringify(AuthState.users));
    
    // Establecer como usuario actual
    const currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        registrationDate: newUser.registrationDate,
        lastLogin: newUser.lastLogin,
        role: newUser.role
    };
    
    localStorage.setItem('webpublish_pro_current_user', JSON.stringify(currentUser));
    
    // Inicializar progreso de temas para el nuevo usuario
    const defaultTopics = [
        { 
            id: 'publicador', 
            name: 'Publicador de Sitio Web', 
            description: 'Software y herramientas para transferir archivos a servidores web',
            completed: false,
            level: 'beginner',
            duration: '4 horas',
            points: 100,
            progress: 0
        },
        { 
            id: 'servidor', 
            name: 'Servidor Web', 
            description: 'Infraestructura hardware y software para servir contenido web',
            completed: false,
            level: 'intermediate',
            duration: '6 horas',
            points: 150,
            progress: 0
        },
        { 
            id: 'dominio', 
            name: 'Dominio Web', 
            description: 'Identificador único y direccionable en Internet para sitios web',
            completed: false,
            level: 'beginner',
            duration: '3 horas',
            points: 80,
            progress: 0
        },
        { 
            id: 'alojamiento', 
            name: 'Alojamiento y Publicación', 
            description: 'Servicios para publicar y mantener sitios web accesibles 24/7',
            completed: false,
            level: 'intermediate',
            duration: '5 horas',
            points: 120,
            progress: 0
        },
        { 
            id: 'solucion', 
            name: 'Solución Web Integral', 
            description: 'Plataformas todo-en-uno para creación y gestión de sitios web',
            completed: false,
            level: 'beginner',
            duration: '4 horas',
            points: 100,
            progress: 0
        },
        { 
            id: 'plataforma', 
            name: 'Plataforma Web', 
            description: 'Entorno tecnológico para desarrollar aplicaciones web modernas',
            completed: false,
            level: 'advanced',
            duration: '8 horas',
            points: 200,
            progress: 0
        }
    ];
    
    localStorage.setItem('webpublish_pro_topics_progress', JSON.stringify(defaultTopics));
    
    // Mostrar mensaje de éxito
    showToast('success', '¡Cuenta creada exitosamente!', `Bienvenido ${name}, tu cuenta ha sido creada y ya puedes acceder a todos los recursos.`);
    
    // Redirigir al dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Funciones de utilidad
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFormError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function clearFormErrors(formType) {
    const errorElements = document.querySelectorAll(`#${formType}Form .error-message`);
    errorElements.forEach(el => {
        el.style.display = 'none';
    });
    
    const inputElements = document.querySelectorAll(`#${formType}Form .form-control`);
    inputElements.forEach(el => {
        el.classList.remove('error');
    });
}

// Sistema de notificaciones Toast (para páginas de auth)
function showToast(type, title, message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toastId = 'toast-' + Date.now();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.id = toastId;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" data-toast-id="${toastId}">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        hideToast(toastId);
    }, 5000);
    
    // Event listener para cerrar manualmente
    toast.querySelector('.toast-close').addEventListener('click', () => {
        hideToast(toastId);
    });
}

function hideToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400);
    }
}