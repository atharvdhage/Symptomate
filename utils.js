let toastContainer = null;

function initializeToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

function showToast(title, message, type = 'info', duration = 3000) {
  const container = initializeToastContainer();
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="closeToast(this)">×</button>
  `;
  
  container.appendChild(toast);
  
  if (duration > 0) {
    setTimeout(() => {
      closeToast(toast.querySelector('.toast-close'));
    }, duration);
  }
}

function closeToast(button) {
  const toast = button.closest('.toast');
  if (toast) {
    toast.classList.add('toast-removing');
    setTimeout(() => {
      toast.remove();
      if (toastContainer && toastContainer.children.length === 0) {
        toastContainer.remove();
        toastContainer = null;
      }
    }, 300);
  }
}

function navigateWithTransition(url) {
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.classList.add('page-fade-out');
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  } else {
    window.location.href = url;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.href && !this.classList.contains('active')) {
        e.preventDefault();
        navigateWithTransition(this.href);
      }
    });
  });
});
