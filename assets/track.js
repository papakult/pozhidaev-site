(function () {
  'use strict';

  var CID = 112201052; // счётчик Яндекс.Метрики pozhidaev-sexolog.ru

  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    for (var j = 0; j < e.scripts.length; j++) { if (e.scripts[j].src === r) { return; } }
    k = e.createElement(t); a = e.getElementsByTagName(t)[0];
    k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  ym(CID, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    trackLinks: true,
    accurateTrackBounce: true
  });

  // noscript-пиксель: считает посетителей с отключённым JS
  document.addEventListener('DOMContentLoaded', function () {
    var ns = document.createElement('noscript');
    ns.innerHTML = '<div><img src="https://mc.yandex.ru/watch/' + CID +
      '" style="position:absolute;left:-9999px" alt="" /></div>';
    document.body.insertBefore(ns, document.body.firstChild);
  });

  // ===== Цели =====
  function goal(name) { try { ym(CID, 'reachGoal', name); } catch (e) {} }

  function lead(goalName) {
    goal(goalName);
    goal('lead_any');
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';

    if (href.indexOf('tel:') === 0) {
      lead('phone_click');
    } else if (/(^|\/\/)(t|telegram)\.me\//i.test(href)) {
      lead('tg_click');
    } else if (href.indexOf('max.ru') > -1) {
      lead('max_click');
    } else if (href.indexOf('wa.me') > -1 || href.indexOf('whatsapp') > -1) {
      lead('wa_click');
    } else if (href.indexOf('mailto:') === 0) {
      lead('mail_click');
    }
  }, true);

  // Доскроллил до услуг/цен — глубина интереса
  document.addEventListener('DOMContentLoaded', function () {
    var sec = document.getElementById('services') || document.getElementById('prices');
    if (sec && 'IntersectionObserver' in window) {
      var fired = false;
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !fired) { fired = true; goal('view_prices'); }
      }, { threshold: 0.3 }).observe(sec);
    }
  });
})();
