export function initNav() {
  const menu = document.getElementById('mobile-menu');
  const menuBtn = document.getElementById('menu-btn');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (!menu || !menuBtn) return;

  const closeMenu = () => {
    menu.classList.add('hidden');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  };

  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden');
    iconClose.classList.toggle('hidden');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}
