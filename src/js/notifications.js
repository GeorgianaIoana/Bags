function createNotificationContainer() {
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
}

export function showNotification(message, type = 'success', duration = 3000) {
    createNotificationContainer();
    const container = document.getElementById('notification-container');
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type] || icons.success}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close">&times;</button>
        </div>
        <div class="notification-progress"></div>
    `;
    
    container.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    const progressBar = notification.querySelector('.notification-progress');
    if (progressBar) {
        progressBar.style.animation = `notification-progress ${duration}ms linear forwards`;
    }
    
    const autoDismiss = setTimeout(() => {
        dismissNotification(notification);
    }, duration);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoDismiss);
        dismissNotification(notification);
    });
    
    notification.addEventListener('click', (e) => {
        if (e.target !== closeBtn && !closeBtn.contains(e.target)) {
            clearTimeout(autoDismiss);
            dismissNotification(notification);
        }
    });
}

function dismissNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

export function showSuccess(message, duration) {
    showNotification(message, 'success', duration);
}

export function showError(message, duration) {
    showNotification(message, 'error', duration || 4000);
}

export function showWarning(message, duration) {
    showNotification(message, 'warning', duration || 3500);
}

export function showInfo(message, duration) {
    showNotification(message, 'info', duration);
}
