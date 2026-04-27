// 모든 외부/내부 링크 새 탭 — tel:/mailto:/앵커는 제외
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('#')) return;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });

  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.addEventListener('click', () => {
      try {
        if (window.gtag) gtag('event', 'click_call', { phone: a.getAttribute('href') });
      } catch (_) {}
    });
  });
});
