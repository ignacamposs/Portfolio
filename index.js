function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');
    menu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden');
    iconClose.classList.toggle('hidden');
}

function toggleDetails() {
    const details = document.getElementById('details-zonaautos');
    const arrow = document.getElementById('arrow-icon');

    if (details.classList.contains('hidden')) {
        details.classList.remove('hidden');
        setTimeout(() => {
            details.classList.remove('opacity-0', 'translate-y-10');
            details.classList.add('opacity-100', 'translate-y-0');
        }, 10);
        arrow.style.transform = 'rotate(180deg)';
    } else {
        details.classList.add('opacity-0', 'translate-y-10');
        details.classList.remove('opacity-100', 'translate-y-0');
        setTimeout(() => {
            details.classList.add('hidden');
        }, 700);
        arrow.style.transform = 'rotate(0deg)';
    }
}
