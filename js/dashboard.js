// Estado del dashboard
const DashboardState = {
    currentUser: null,
    topics: [],
    recentActivity: []
};

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    setupDashboardEventListeners();
    updateDashboard();
});

// Inicializar dashboard
function initDashboard() {
    // Cargar usuario actual desde localStorage
    const savedUser = localStorage.getItem('webpublish_pro_current_user');
    if (savedUser) {
        DashboardState.currentUser = JSON.parse(savedUser);
    } else {
        // Redirigir a login si no hay usuario logueado
        window.location.href = 'login.html';
        return;
    }
    
    // Cargar progreso de temas desde localStorage
    const savedTopics = localStorage.getItem('webpublish_pro_topics_progress');
    if (savedTopics) {
        DashboardState.topics = JSON.parse(savedTopics);
    }
    
    // Generar actividad reciente
    generateRecentActivity();
    
    // Actualizar UI
    updateAuthUI();
}

// Configurar event listeners del dashboard
function setupDashboardEventListeners() {
    // Logout button
    const logoutDashboardBtn = document.getElementById('logoutDashboardBtn');
    const logoutFooterLink = document.getElementById('logoutFooterLink');
    
    if (logoutDashboardBtn) {
        logoutDashboardBtn.addEventListener('click', handleLogout);
    }
    
    if (logoutFooterLink) {
        logoutFooterLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Profile and settings links
    const profileLink = document.getElementById('profileLink');
    const settingsLink = document.getElementById('settingsLink');
    
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('info', 'Perfil', 'Funcionalidad de perfil en desarrollo');
        });
    }
    
    if (settingsLink) {
        settingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('info', 'Configuración', 'Funcionalidad de configuración en desarrollo');
        });
    }
}

// Actualizar dashboard
function updateDashboard() {
    if (!DashboardState.currentUser) return;
    
    // Actualizar nombre de usuario
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = DashboardState.currentUser.name;
    }
    
    // Calcular estadísticas
    const completedTopics = DashboardState.topics.filter(topic => topic.completed).length;
    const totalTopics = DashboardState.topics.length;
    const progressPercent = Math.round((completedTopics / totalTopics) * 100);
    
    // Calcular días activo
    const registrationDate = new Date(DashboardState.currentUser.registrationDate);
    const today = new Date();
    const diffTime = Math.abs(today - registrationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calcular puntos de aprendizaje
    const learningPoints = DashboardState.topics
        .filter(topic => topic.completed)
        .reduce((total, topic) => total + topic.points, 0);
    
    // Actualizar UI del dashboard
    const completedTopicsElement = document.getElementById('completedTopics');
    const progressPercentElement = document.getElementById('progressPercent');
    const activeDaysElement = document.getElementById('activeDays');
    const learningPointsElement = document.getElementById('learningPoints');
    
    if (completedTopicsElement) {
        completedTopicsElement.textContent = `${completedTopics}/${totalTopics}`;
    }
    
    if (progressPercentElement) {
        progressPercentElement.textContent = `${progressPercent}%`;
    }
    
    if (activeDaysElement) {
        activeDaysElement.textContent = diffDays;
    }
    
    if (learningPointsElement) {
        learningPointsElement.textContent = learningPoints;
    }
    
    // Actualizar barras de progreso
    const progressBar = document.getElementById('progressBar');
    const topicsBar = document.getElementById('topicsBar');
    const pointsBar = document.getElementById('pointsBar');
    
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }
    
    if (topicsBar) {
        topicsBar.style.width = `${(completedTopics / totalTopics) * 100}%`;
    }
    
    if (pointsBar) {
        pointsBar.style.width = `${Math.min((learningPoints / 750) * 100, 100)}%`;
    }
    
    // Actualizar tarjetas de temas en el dashboard
    updateDashboardTopics();
    
    // Actualizar actividad reciente
    updateRecentActivity();
}

// Actualizar temas en el dashboard
function updateDashboardTopics() {
    const dashboardTopics = document.getElementById('dashboardTopics');
    if (!dashboardTopics) return;
    
    dashboardTopics.innerHTML = '';
    
    DashboardState.topics.forEach(topic => {
        const topicCard = document.createElement('div');
        topicCard.className = 'topic-card fade-in-up';
        topicCard.id = `dashboard-${topic.id}`;
        
        const levelClass = `level-${topic.level}`;
        const levelText = topic.level === 'beginner' ? 'Principiante' : 
                         topic.level === 'intermediate' ? 'Intermedio' : 'Avanzado';
        
        topicCard.innerHTML = `
            <div class="topic-header">
                <div class="topic-icon">
                    <i class="fas ${getTopicIcon(topic.id)}"></i>
                </div>
                <h3 class="topic-title">${topic.name}</h3>
            </div>
            <p class="topic-description">${topic.description}</p>
            
            <div class="topic-details">
                <div class="detail-item">
                    <div class="detail-icon"><i class="fas ${topic.completed ? 'fa-check-circle' : 'fa-circle'}"></i></div>
                    <div class="detail-content">
                        <div class="detail-title">Estado</div>
                        <div class="detail-text">${topic.completed ? 'Completado' : 'En progreso'}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon"><i class="fas fa-star"></i></div>
                    <div class="detail-content">
                        <div class="detail-title">Puntos</div>
                        <div class="detail-text">${topic.points} puntos disponibles</div>
                    </div>
                </div>
            </div>
            
            <div class="topic-progress">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 0.9rem; color: var(--gray);">Progreso</span>
                    <span style="font-weight: 600; color: var(--primary);">${topic.progress}%</span>
                </div>
                <div style="height: 8px; background-color: var(--gray-light); border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; width: ${topic.progress}%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 4px; transition: width 0.5s ease;"></div>
                </div>
            </div>
            
            <div class="topic-footer">
                <div class="topic-level">
                    <div class="level-dot ${levelClass}"></div>
                    <span>Nivel: ${levelText}</span>
                </div>
                <div class="topic-duration">
                    <i class="far fa-clock"></i>
                    <span>${topic.duration}</span>
                </div>
            </div>
        `;
        
        // Añadir funcionalidad de clic a la tarjeta
        topicCard.addEventListener('click', () => {
            if (!topic.completed) {
                // Incrementar progreso
                const increment = 20;
                topic.progress = Math.min(topic.progress + increment, 100);
                
                // Si el progreso alcanza 100, marcar como completado
                if (topic.progress >= 100 && !topic.completed) {
                    topic.completed = true;
                    showToast('success', '¡Módulo completado!', `Has completado el módulo "${topic.name}". ¡Felicidades!`);
                    
                    // Añadir actividad
                    addRecentActivity({
                        type: 'completed',
                        title: 'Módulo Completado',
                        description: `Completaste el módulo "${topic.name}"`,
                        time: 'Hace unos momentos'
                    });
                } else {
                    showToast('info', 'Progreso actualizado', `Avanzaste en el módulo "${topic.name}"`);
                    
                    // Añadir actividad
                    addRecentActivity({
                        type: 'progress',
                        title: 'Progreso de Aprendizaje',
                        description: `Avanzaste en el módulo "${topic.name}" (${topic.progress}%)`,
                        time: 'Hace unos momentos'
                    });
                }
                
                // Guardar cambios
                localStorage.setItem('webpublish_pro_topics_progress', JSON.stringify(DashboardState.topics));
                
                // Actualizar dashboard
                updateDashboard();
            } else {
                showToast('info', 'Módulo completado', `El módulo "${topic.name}" ya está completado.`);
            }
        });
        
        dashboardTopics.appendChild(topicCard);
    });
}

// Generar actividad reciente
function generateRecentActivity() {
    const activities = [
        {
            type: 'joined',
            title: 'Te uniste a WebPublish Pro',
            description: 'Bienvenido a la plataforma de aprendizaje',
            time: DashboardState.currentUser.joinedDate || 'Hoy'
        },
        {
            type: 'login',
            title: 'Inicio de sesión',
            description: 'Accediste a tu cuenta',
            time: 'Hoy'
        }
    ];
    
    // Añadir actividades de módulos completados
    DashboardState.topics.forEach(topic => {
        if (topic.completed) {
            activities.push({
                type: 'completed',
                title: 'Módulo Completado',
                description: `Completaste el módulo "${topic.name}"`,
                time: 'Recientemente'
            });
        } else if (topic.progress > 0) {
            activities.push({
                type: 'progress',
                title: 'Progreso de Aprendizaje',
                description: `Avanzaste en el módulo "${topic.name}" (${topic.progress}%)`,
                time: 'Recientemente'
            });
        }
    });
    
    DashboardState.recentActivity = activities;
}

// Actualizar actividad reciente en la UI
function updateRecentActivity() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    DashboardState.recentActivity.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const icon = getActivityIcon(activity.type);
        
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title-small">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
            </div>
            <div class="activity-time">${activity.time}</div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Añadir nueva actividad
function addRecentActivity(activity) {
    DashboardState.recentActivity.unshift(activity);
    
    // Mantener solo las 5 actividades más recientes
    if (DashboardState.recentActivity.length > 5) {
        DashboardState.recentActivity.pop();
    }
    
    updateRecentActivity();
}

// Obtener icono para actividad
function getActivityIcon(type) {
    const icons = {
        'joined': 'fa-user-plus',
        'login': 'fa-sign-in-alt',
        'completed': 'fa-check-circle',
        'progress': 'fa-chart-line',
        'certificate': 'fa-award'
    };
    
    return icons[type] || 'fa-bell';
}

// Obtener icono para tema
function getTopicIcon(topicId) {
    const icons = {
        'publicador': 'fa-upload',
        'servidor': 'fa-server',
        'dominio': 'fa-globe',
        'alojamiento': 'fa-hdd',
        'solucion': 'fa-puzzle-piece',
        'plataforma': 'fa-desktop'
    };
    return icons[topicId] || 'fa-file-alt';
}

// Actualizar UI de autenticación
function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    const userStatusInfo = document.getElementById('userStatusInfo');
    
    if (authSection && DashboardState.currentUser) {
        authSection.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">${DashboardState.currentUser.name.charAt(0).toUpperCase()}</div>
                <div class="user-info">
                    <div class="user-name">${DashboardState.currentUser.name}</div>
                    <div class="user-role">${DashboardState.currentUser.role}</div>
                </div>
            </div>
            <button id="logoutBtn" class="btn btn-logout">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
        `;
        
        // Añadir event listener al botón de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
    
    if (userStatusInfo) {
        userStatusInfo.textContent = `Conectado como: ${DashboardState.currentUser?.email || 'Usuario'}`;
        userStatusInfo.style.color = '#4cc9f0';
    }
}

// Manejar logout
function handleLogout() {
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

// Simular progreso automático en el dashboard
setInterval(() => {
    if (DashboardState.topics && DashboardState.currentUser) {
        let updated = false;
        
        DashboardState.topics.forEach(topic => {
            if (!topic.completed && Math.random() > 0.7) {
                // Incrementar progreso aleatoriamente
                const increment = Math.floor(Math.random() * 10);
                const oldProgress = topic.progress;
                topic.progress = Math.min(topic.progress + increment, 100);
                
                // Si el progreso alcanza 100, marcar como completado
                if (topic.progress >= 100 && !topic.completed) {
                    topic.completed = true;
                    showToast('success', '¡Progreso automático!', `Has completado automáticamente el módulo "${topic.name}"`);
                    
                    // Añadir actividad
                    addRecentActivity({
                        type: 'completed',
                        title: 'Módulo Completado',
                        description: `Completaste el módulo "${topic.name}" (progreso automático)`,
                        time: 'Justo ahora'
                    });
                } else if (topic.progress > oldProgress) {
                    // Añadir actividad de progreso
                    addRecentActivity({
                        type: 'progress',
                        title: 'Progreso Automático',
                        description: `Avanzaste en el módulo "${topic.name}" (${topic.progress}%)`,
                        time: 'Justo ahora'
                    });
                }
                
                updated = true;
            }
        });
        
        if (updated) {
            // Guardar cambios
            localStorage.setItem('webpublish_pro_topics_progress', JSON.stringify(DashboardState.topics));
            
            // Actualizar dashboard
            updateDashboard();
        }
    }
}, 30000); // Cada 30 segundos