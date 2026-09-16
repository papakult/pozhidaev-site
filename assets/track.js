(function () {
  'use strict';

  // Счётчик Яндекс.Метрики, аккаунт pozhidaev.sexolog, сайт pozhidaev-sexolog.ru
  var CID = 112201052;

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

  document.addEventListener('DOMContentLoaded', function () {
    var ns = document.createElement('noscript');
    ns.innerHTML = '<div><img src="https://mc.yandex.ru/watch/' + CID +
      '" style="position:absolute;left:-9999px" alt="" /></div>';
    document.body.insertBefore(ns, document.body.firstChild);
  });

  function goal(name) { try { ym(CID, 'reachGoal', name); } catch (e) {} }

  // чтобы одно действие не засчиталось дважды: и по клику, и по window.open
  var lastName = '', lastTime = 0;
  function lead(name) {
    if (!name) return;
    var now = Date.now();
    if (name === lastName && now - lastTime < 1500) return;
    lastName = name; lastTime = now;
    goal(name);
    goal('lead_any');
  }

  // определяем канал по адресу
  function classify(url) {
    if (!url) return null;
    if (url.indexOf('tel:') === 0) return 'phone_click';
    if (url.indexOf('mailto:') === 0) return 'mail_click';
    if (/(^|\/\/|\.)(t|telegram)\.me\//i.test(url)) return 'tg_click';
    if (url.indexOf('max.ru') > -1) return 'max_click';
    if (url.indexOf('wa.me') > -1 || url.indexOf('whatsapp') > -1) return 'wa_click';
    return null;
  }

  // 1. обычные ссылки
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
    if (!a) return;
    lead(classify(a.getAttribute('href') || ''));
  }, true);

  // 2. кнопки сайта, они открывают мессенджер через window.open,
  //    а в href у них решётка либо это вообще не ссылка
  try {
    var nativeOpen = window.open;
    window.open = function (url) {
      lead(classify(typeof url === 'string' ? url : ''));
      return nativeOpen.apply(window, arguments);
    };
  } catch (e) {}

  // 3. долистал до блока услуг
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

/* Telegram Игоря переименован 13.09.2026: PRO_cekc -> Pozhidaev_igor, About_seks_is_easy -> Pozhidaev_sexolog.
   Страницы index/about/education ещё несут старый юзернейм в inline-скрипте, поэтому правим здесь:
   перебиваем bookTg и переписываем href у старых ссылок. Убрать после обновления самих страниц. */
(function () {
  'use strict';
  var OLD_IGOR = /t\.me\/PRO_cekc/g, OLD_CHAN = /t\.me\/About_seks_is_easy/g;
  var IGOR = 'https://t.me/Pozhidaev_igor', EVG = 'https://t.me/BOLMBOM';
  window.bookTg = function (msg, who) {
    var base = (who === 'evgenia') ? EVG : IGOR;
    window.open(base + '?text=' + encodeURIComponent(msg || ''), '_blank');
  };
  function fixLinks() {
    var links = document.querySelectorAll('a[href*="t.me/PRO_cekc"], a[href*="t.me/About_seks_is_easy"]');
    for (var i = 0; i < links.length; i++) {
      var h = links[i].getAttribute('href');
      links[i].setAttribute('href', h.replace(OLD_IGOR, 't.me/Pozhidaev_igor').replace(OLD_CHAN, 't.me/Pozhidaev_sexolog'));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fixLinks); else fixLinks();
})();
