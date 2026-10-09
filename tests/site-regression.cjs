const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const recommendation = vm.runInNewContext('(' + html.match(/function getQuizRecommendation[\s\S]*?(?=\nfunction bookQuizResult)/)[0] + ')');
let combinations = 0;
for (const a of ['psy', 'body', 'psy'])
for (const b of ['psy', 'body', 'psy'])
for (const c of ['body', 'body', 'psy'])
for (const preference of ['psy', 'body', 'both'])
for (const format of ['solo', 'pair', 'edu']) {
  const scores = { psy: 0, body: 0 };
  for (const choice of [a, b, c, preference]) {
    if (choice === 'both') { scores.psy++; scores.body++; }
    else scores[choice]++;
  }
  const result = recommendation(format, preference, scores);
  assert(result.title && result.text && result.message);
  if (format === 'edu') {
    assert.equal(result.title, 'Обучение телесным практикам');
    assert(result.text.includes('Евгенией'));
    assert(result.message.includes('обучение'));
  } else if (format === 'pair') {
    assert.equal(result.title, 'Начните с парной консультации');
    assert(result.message.includes('парную'));
  } else if (preference === 'psy') {
    assert.equal(result.title, 'Начните с разговорной консультации');
  }
  if (format !== 'edu' && preference === 'psy') {
    assert(result.text.includes('без телесного контакта'));
    assert(!/йони|лингам/.test(result.text));
  }
  combinations++;
}
const pages = new Map(fs.readdirSync(root).filter(f => f.endsWith('.html')).map(f => [f, read(f)]));
let references = 0;
for (const [file, content] of pages) {
  for (const match of content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (match[1].includes('ld+json')) JSON.parse(match[2]);
    else if (!match[1].includes('src=')) new Function(match[2]);
  }
  for (const match of content.matchAll(/\b(?:href|src|poster)=["']([^"']+)["']/g)) {
    if (/^(data:|mailto:|tel:|javascript:)/.test(match[1])) continue;
    const url = new URL(match[1], 'https://pozhidaev-sexolog.ru/' + file);
    if (url.hostname !== 'pozhidaev-sexolog.ru') continue;
    const target = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    assert(fs.existsSync(path.join(root, target)), file + ': ' + target);
    if (url.hash && pages.has(target)) assert(new RegExp('\\bid=["\']' + url.hash.slice(1) + '["\']').test(pages.get(target)), file + ': ' + url.hash);
    references++;
  }
}
for (const file of ['index.html', 'about.html', 'education.html']) {
  assert(read(file).includes('/assets/mobile-nav.js?v=1'));
  assert(!read(file).includes('function toggleMobileNav('));
}
new Function(read('assets/mobile-nav.js'));
const article = read('lingam-massazh-dlya-muzhchin.html');
assert(!article.includes('на консультацию к Евгении'));
for (const match of article.matchAll(/href="(https:\/\/t.me\/BOLMBOM[^\"]+)"/g)) {
  assert(!new URL(match[1]).searchParams.get('text')?.includes('на консультацию'));
}
assert(read('privacy.html').includes('WhatsApp и Max'));
assert(read('privacy.html').includes('На сайте подключена Яндекс Метрика'));
assert(!read('privacy.html').includes('Если в сайте подключена'));
console.log(`PASS: ${combinations} quiz combinations, ${pages.size} HTML files, ${references} internal references`);
