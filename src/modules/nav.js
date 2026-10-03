export function initNav() {
  const menu = document.getElementById('mobile-menu');
  const menuBtn = document.getElementById('menu-btn');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (!menu || !menuBtn) return;

  const setOpen = (open) => {
    menu.classList.toggle('hidden', !open);
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  menuBtn.addEventListener('click', () => {
    setOpen(menu.classList.contains('hidden'));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  setOpen(false);
}
