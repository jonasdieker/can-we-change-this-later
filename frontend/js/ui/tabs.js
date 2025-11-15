// Bottom navigation tab handling.

export function initTabs() {
  const buttons = Array.from(document.querySelectorAll('.nav-circle-btn'));
  const panels = Array.from(document.querySelectorAll('.tab-panel'));

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab-target');
      if (!target) return;

      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === `tab-${target}`);
      });
    });
  });
}
