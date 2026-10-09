(function () {
  'use strict';
  var menu = document.getElementById('mobileNav');
  var trigger = document.querySelector('.burger');
  if (!menu || !trigger) return;
  var previousOverflow = '';
  var mobile = window.matchMedia('(max-width: 768px)');
  trigger.setAttribute('aria-controls', 'mobileNav');
  trigger.setAttribute('aria-expanded', 'false');
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-modal', 'true');
  menu.setAttribute('aria-label', 'Навигация по сайту');
  menu.setAttribute('aria-hidden', 'true');

  function setOpen(open, restoreFocus) {
    if (menu.classList.contains('open') === open) return;
    menu.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      menu.scrollTop = 0;
      menu.querySelector('.close-nav').focus();
    } else {
      document.body.style.overflow = previousOverflow;
      if (restoreFocus !== false) trigger.focus();
    }
  }
  window.toggleMobileNav = function () { setOpen(!menu.classList.contains('open')); };
  document.addEventListener('keydown', function (event) {
    if (!menu.classList.contains('open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Tab') {
      var items = menu.querySelectorAll('button, a[href]');
      var first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
  mobile.addEventListener('change', function (event) {
    if (!event.matches) setOpen(false, false);
  });
})();
