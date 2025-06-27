/*
 * SAE 2.04 - Dashboard JavaScript
 * Système de monitoring IoT
 */

// Variables globales
let autoRefreshInterval;
let isAutoRefresh = false;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard SAE 2.04 initialisé');
    initCharts();
    initEventListeners();
    checkAutoRefreshParam();
});

/**
 * Initialisation des graphiques Chart.js
 */
function initCharts() {
    // Graphique linéaire des températures
    const tempCtx = document.getElementById('temperatureChart');
    if (tempCtx) {
        new Chart(tempCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Température (°C)',
                    data: [18, 16, 22, 25, 28, 24],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Température (°C)'
                        }
                    }
                }
            }
        });
    }

    // Graphique en secteurs
    const sensorCtx = document.getElementById('sensorChart');
    if (sensorCtx) {
        new Chart(sensorCtx, {
            type: 'doughnut',
            data: {
                labels: ['Salon', 'Cuisine', 'Chambre'],
                datasets: [{
                    data: [30, 45, 25],
                    backgroundColor: ['#3498db', '#27ae60', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

/**
 * Initialisation des événements
 */
function initEventListeners() {
    // Soumettre le formulaire avec Enter
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.type !== 'submit') {
                e.preventDefault();
                filterForm.submit();
            }
        });
    }

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observer les sections pour l'animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Réinitialiser les filtres
 */
function resetFilters() {
    const form = document.getElementById('filterForm');
    if (form) {
        form.reset();
        // Rediriger vers la page sans paramètres
        window.location.href = window.location.pathname;
    }
}

/**
 * Exporter les données en CSV
 */
function exportCSV() {
    showNotification('Génération du fichier CSV en cours...', 'info');

    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = '/export-csv/';
    link.download = `donnees_capteurs_${new Date().toISOString().split('T')[0]}.csv`;

    // Simuler le clic pour télécharger
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        showNotification('Fichier CSV téléchargé avec succès!', 'success');
    }, 1000);
}

/**
 * Activer/désactiver le rafraîchissement automatique
 */
function toggleAutoRefresh() {
    const icon = document.getElementById('refresh-icon');

    if (!isAutoRefresh) {
        // Activer l'auto-refresh
        autoRefreshInterval = setInterval(() => {
            showNotification('Actualisation des données...', 'info');
            location.reload();
        }, 30000); // 30 secondes

        isAutoRefresh = true;
        icon.classList.add('fa-spin');
        showNotification('Auto-refresh activé (30s)', 'success');

        // Ajouter le paramètre à l'URL
        const url = new URL(window.location);
        url.searchParams.set('auto_refresh', 'true');
        window.history.replaceState({}, '', url);

    } else {
        // Désactiver l'auto-refresh
        clearInterval(autoRefreshInterval);
        isAutoRefresh = false;
        icon.classList.remove('fa-spin');
        showNotification('Auto-refresh désactivé', 'warning');

        // Retirer le paramètre de l'URL
        const url = new URL(window.location);
        url.searchParams.delete('auto_refresh');
        window.history.replaceState({}, '', url);
    }
}

/**
 * Vérifier si l'auto-refresh est activé dans l'URL
 */
function checkAutoRefreshParam() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auto_refresh') === 'true') {
        toggleAutoRefresh();
    }
}

/**
 * Éditer un capteur
 */
function editCapteur(capteurId) {
    const nom = prompt('Nouveau nom du capteur:');
    if (nom && nom.trim()) {
        // Simuler une requête AJAX
        showNotification('Modification en cours...', 'info');

        // Ici, vous devriez faire un appel AJAX réel vers Django
        setTimeout(() => {
            showNotification(`Capteur "${nom}" modifié avec succès!`, 'success');
            // Optionnel: recharger la page ou mettre à jour le DOM
        }, 1000);

        /* Exemple d'appel AJAX réel:
        fetch(`/capteur/${capteurId}/edit/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                nom: nom
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Capteur modifié avec succès!', 'success');
                location.reload();
            } else {
                showNotification('Erreur lors de la modification', 'error');
            }
        })
        .catch(error => {
            showNotification('Erreur de connexion', 'error');
        });
        */
    }
}

/**
 * Actions rapides
 */
function addCapteur() {
    showNotification('Fonctionnalité d\'ajout de capteur à implémenter', 'info');
    // Rediriger vers la page d'ajout ou ouvrir un modal
}

function viewReport() {
    showNotification('Génération de rapport détaillé...', 'info');
    // Rediriger vers la page de rapport
}

function manageAlerts() {
    showNotification('Ouverture de la gestion des alertes...', 'info');
    // Rediriger vers la page de gestion des alertes
}

function exportData() {
    exportCSV();
}

/**
 * Afficher une notification
 */
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Ajouter les styles si pas encore présents
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 1rem 1.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 1000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            .notification-info { border-left: 4px solid #3498db; }
            .notification-success { border-left: 4px solid #27ae60; }
            .notification-warning { border-left: 4px solid #f39c12; }
            .notification-error { border-left: 4px solid #e74c3c; }
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.7;
            }
            .notification-close:hover { opacity: 1; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    // Ajouter au DOM
    document.body.appendChild(notification);

    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Obtenir l'icône pour le type de notification
 */
function getNotificationIcon(type) {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Obtenir le token CSRF pour les requêtes AJAX
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * Formater une date
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

/**
 * Utilitaire pour débounce (éviter trop d'appels)
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}