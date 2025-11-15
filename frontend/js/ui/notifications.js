// Toast notifications.

const containerId = 'toast-container';

export function showToast(message, type = 'info', timeoutMs = 3500) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <p class="toast-message">${escapeHtml(message)}</p>
    <button class="toast-close" aria-label="Dismiss">&times;</button>
  `;

  const close = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    setTimeout(() => toast.remove(), 180);
  };

  toast.querySelector('.toast-close').addEventListener('click', close);
  container.appendChild(toast);

  toast.style.opacity = '0';
  toast.style.transform = 'translateY(6px)';
  requestAnimationFrame(() => {
    toast.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  if (timeoutMs > 0) {
    setTimeout(close, timeoutMs);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
