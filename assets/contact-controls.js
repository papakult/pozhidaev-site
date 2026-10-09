/* Preserve the existing links and handlers, without duplicate controls. */
(() => {
  const header = document.querySelector('.header');
  const controls = document.querySelector('.quick-actions');
  if (header && controls) header.append(controls);
})();
