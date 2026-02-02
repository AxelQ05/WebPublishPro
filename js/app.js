// Estado de la aplicación
const AppState = {
    currentUser: null,
    topics: [
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
    ]
};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
    setupScrollProgress();
});

// Configurar indicador de progreso de scroll
function setupScrollProgress() {
    const progressIndicator = document.getElementById('progressIndicator');
    
    if (progressIndicator) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressIndicator.style.transform = `scaleX(${scrolled / 100})`;
        });
    }
}

// Inicializar aplicación
function initApp() {
    // Cargar usuario actual desde localStorage
    const savedUser = localStorage.getItem('webpublish_pro_current_user');
    if (savedUser) {
        AppState.currentUser = JSON.parse(savedUser);
    }
    
    // Cargar progreso de temas desde localStorage
    const savedTopics = localStorage.getItem('webpublish_pro_topics_progress');
    if (savedTopics) {
        const topicsProgress = JSON.parse(savedTopics);
        AppState.topics = topicsProgress;
    }
    
    updateUI();
}

// Configurar event listeners
function setupEventListeners() {
    // Navegación principal
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Actualizar clase activa
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Desplazarse a la sección
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Botones de inicio
    const startLearningBtn = document.getElementById('startLearningBtn');
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', () => {
            document.getElementById('publicador').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
    
    // Dashboard button
    const dashboardBtn = document.getElementById('dashboardBtn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }
    
    // Botones de autenticación en header
    const headerLoginBtn = document.getElementById('headerLoginBtn');
    const headerRegisterBtn = document.getElementById('headerRegisterBtn');
    
    if (headerLoginBtn) {
        headerLoginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
    
    if (headerRegisterBtn) {
        headerRegisterBtn.addEventListener('click', () => {
            window.location.href = 'register.html';
        });
    }
    
    // Navegación suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Actualizar UI según estado
function updateUI() {
    const authSection = document.getElementById('authSection');
    const startLearningBtn = document.getElementById('startLearningBtn');
    const dashboardBtn = document.getElementById('dashboardBtn');
    const userStatusInfo = document.getElementById('userStatusInfo');
    
    if (authSection) {
        if (AppState.currentUser) {
            // Usuario logueado
            authSection.innerHTML = `
                <div class="user-profile">
                    <div class="user-avatar">${AppState.currentUser.name.charAt(0).toUpperCase()}</div>
                    <div class="user-info">
                        <div class="user-name">${AppState.currentUser.name}</div>
                        <div class="user-role">Estudiante Premium</div>
                    </div>
                </div>
                <button id="logoutBtn" class="btn btn-logout">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
            `;
            
            if (startLearningBtn) startLearningBtn.style.display = 'none';
            if (dashboardBtn) dashboardBtn.style.display = 'inline-flex';
            if (userStatusInfo) {
                userStatusInfo.textContent = `Conectado como: ${AppState.currentUser.email}`;
                userStatusInfo.style.color = '#4cc9f0';
            }
            
            // Añadir event listener al botón de logout
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', handleLogout);
            }
            
        } else {
            // Usuario no logueado
            authSection.innerHTML = `
                <button id="headerLoginBtn" class="btn btn-outline">
                    <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                </button>
                <button id="headerRegisterBtn" class="btn btn-primary">
                    <i class="fas fa-user-plus"></i> Registrarse
                </button>
            `;
            
            if (startLearningBtn) startLearningBtn.style.display = 'inline-flex';
            if (dashboardBtn) dashboardBtn.style.display = 'none';
            if (userStatusInfo) {
                userStatusInfo.textContent = 'Estado: No autenticado';
                userStatusInfo.style.color = '#94a3b8';
            }
            
            // Añadir event listeners a los botones de autenticación
            const newHeaderLoginBtn = document.getElementById('headerLoginBtn');
            const newHeaderRegisterBtn = document.getElementById('headerRegisterBtn');
            
            if (newHeaderLoginBtn) {
                newHeaderLoginBtn.addEventListener('click', () => {
                    window.location.href = 'login.html';
                });
            }
            
            if (newHeaderRegisterBtn) {
                newHeaderRegisterBtn.addEventListener('click', () => {
                    window.location.href = 'register.html';
                });
            }
        }
    }
}

// Manejar logout
function handleLogout() {
    AppState.currentUser = null;
    localStorage.removeItem('webpublish_pro_current_user');
    
    showToast('info', 'Sesión cerrada', 'Has cerrado sesión correctamente. ¡Vuelve pronto!');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Sistema de notificaciones Toast
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

// Actualizar progreso de los temas aleatoriamente para demo
function updateTopicProgress() {
    AppState.topics.forEach((topic, index) => {
        if (!topic.completed) {
            // Incrementar progreso aleatoriamente (solo para demostración)
            const increment = Math.floor(Math.random() * 15);
            topic.progress = Math.min(topic.progress + increment, 100);
            
            // Si el progreso alcanza 100, marcar como completado
            if (topic.progress >= 100 && !topic.completed) {
                topic.completed = true;
                if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                    showToast('success', '¡Módulo completado!', `Has completado automáticamente el módulo "${topic.name}"`);
                }
            }
        }
    });
    
    // Guardar cambios
    localStorage.setItem('webpublish_pro_topics_progress', JSON.stringify(AppState.topics));
}

// Simular progreso automático cada 30 segundos (solo para demostración)
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    setInterval(updateTopicProgress, 30000);
}