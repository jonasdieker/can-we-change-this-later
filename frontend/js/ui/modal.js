// Reusable text modal.

let currentResolver = null;

const backdrop = document.getElementById('modal-backdrop');
const titleEl = document.getElementById('modal-title');
const labelEl = document.getElementById('modal-label');
const textareaEl = document.getElementById('modal-textarea');
const btnClose = document.getElementById('modal-close');
const btnCancel = document.getElementById('modal-cancel');
const btnSend = document.getElementById('modal-send');

function ensure() {
  if (!backdrop || !titleEl || !labelEl || !textareaEl || !btnClose || !btnCancel || !btnSend) {
    throw new Error('Modal DOM elements missing.');
  }
}

function reset() {
  textareaEl.value = '';
}

export function openTextModal({ title, label, placeholder, sendLabel = 'Send' }) {
  ensure();
  reset();

  titleEl.textContent = title;
  labelEl.textContent = label;
  textareaEl.placeholder = placeholder || '';
  btnSend.textContent = sendLabel;

  backdrop.classList.remove('hidden');

  if (currentResolver) {
    currentResolver({ action: 'cancel' });
  }

  return new Promise((resolve) => {
    currentResolver = resolve;
    textareaEl.focus();
  });
}

function close(action, text) {
  backdrop.classList.add('hidden');
  if (currentResolver) {
    currentResolver({ action, text });
    currentResolver = null;
  }
}

btnClose.addEventListener('click', () => close('cancel'));
btnCancel.addEventListener('click', () => close('cancel'));
btnSend.addEventListener('click', () => {
  const text = textareaEl.value.trim();
  close('send', text);
});

backdrop.addEventListener('click', (event) => {
  if (event.target === backdrop) {
    close('cancel');
  }
});

textareaEl.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    close('cancel');
  } else if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
    const text = textareaEl.value.trim();
    close('send', text);
  }
});
