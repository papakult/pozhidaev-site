/* Preserve the existing links and handlers, without duplicate controls. */
(() => {
  const header = document.querySelector('.header');
  const controls = document.querySelector('.quick-actions');
  const row = document.querySelector('.header-inner');
  const menu = document.querySelector('.mobile-nav');
  const privacy = controls?.querySelector('.safe-mode-btn');
  const mobile = matchMedia('(max-width: 768px)');
  if (!header || !controls || !row || !menu) return;
  const place = () => {
    if (mobile.matches) {
      row.insertBefore(controls, row.querySelector('.burger'));
      if (privacy) menu.append(privacy);
    } else {
      if (privacy) controls.append(privacy);
      header.append(controls);
    }
  };
  place();
  mobile.addEventListener('change', place);
})();
