export const WHATSAPP_NUMBER = '5492944702059';

export function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const ICON = `<svg aria-hidden="true" viewBox="0 0 24 24" class="w-6 h-6 shrink-0" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.8h-.01a9.77 9.77 0 0 1-4.98-1.36l-.36-.21-3.7.97.99-3.6-.24-.37a9.75 9.75 0 0 1-1.5-5.2c0-5.39 4.39-9.78 9.8-9.78 2.61 0 5.07 1.02 6.92 2.87a9.72 9.72 0 0 1 2.86 6.92c0 5.4-4.39 9.78-9.78 9.78zm8.33-18.1A11.7 11.7 0 0 0 12.04.25C5.55.25.28 5.52.27 12a11.7 11.7 0 0 0 1.57 5.87L.17 24l6.27-1.64a11.72 11.72 0 0 0 5.6 1.43h.01c6.48 0 11.76-5.28 11.76-11.76 0-3.14-1.22-6.1-3.44-8.32z"/></svg>`;

/**
 * Botón flotante de WhatsApp. `label` se muestra desde sm; en mobile el botón
 * muestra `shortLabel` para no tapar contenido.
 */
export function mountWhatsAppButton({ message, label = 'Escribime por WhatsApp', shortLabel = 'WhatsApp' }) {
  const a = document.createElement('a');
  a.href = whatsappUrl(message);
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.className =
    'fixed bottom-4 right-4 z-[60] inline-flex items-center gap-2 min-h-[48px] pl-3.5 pr-4 rounded-full bg-[#15803d] text-white font-semibold text-sm shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]';
  a.innerHTML = `${ICON}<span class="sm:hidden">${shortLabel}</span><span class="hidden sm:inline">${label}</span><span class="sr-only"> (WhatsApp)</span>`;
  document.body.appendChild(a);
  return a;
}
