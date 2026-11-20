(()=>{
'use strict';
document.documentElement.classList.add('js');
const TG='Amirshoev_2010'; // Номи корбари Telegram-и худро бе @ нависед
const $=id=>document.getElementById(id);
const fmt=n=>Math.round(n).toLocaleString('ru-RU');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const validTG=/^[A-Za-z0-9_]{5,32}$/.test(TG);
if(validTG){$('tg').href='https://t.me/'+TG;$('tg2').href='https://t.me/'+TG;$('tg2').target='_blank';$('tg2').rel='noopener noreferrer';}

// Пайдошавӣ ҳангоми скрол
const rv=[...document.querySelectorAll('.rv')];
rv.forEach(el=>{
  const i=[...el.parentElement.children].filter(c=>c.classList.contains('rv')).indexOf(el);
  el.style.setProperty('--d',(i*0.09)+'s');
});
if(reduce||!('IntersectionObserver' in window)){rv.forEach(e=>e.classList.add('in'));}
else{
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  rv.forEach(e=>io.observe(e));
}

// Навор ва параллакс
const bar=document.querySelector('.progress'),root=document.documentElement;
let tick=false;
addEventListener('scroll',()=>{
  if(tick)return;tick=true;
  requestAnimationFrame(()=>{
    const max=root.scrollHeight-innerHeight,y=scrollY;
    bar.style.transform='scaleX('+(max>0?y/max:0)+')';
    if(!reduce)root.style.setProperty('--sy',Math.min(y,900));
    tick=false;
  });
},{passive:true});

// Нури нишондиҳанда дар ҳиро ва ҷунбиши корт (танҳо компютер)
if(matchMedia('(hover:hover)').matches&&!reduce){
  const hero=document.querySelector('.hero');
  hero.addEventListener('pointermove',e=>{
    const r=hero.getBoundingClientRect();
    hero.style.setProperty('--mx',(e.clientX-r.left)+'px');
    hero.style.setProperty('--my',(e.clientY-r.top)+'px');
  });
  document.querySelectorAll('.tilt').forEach(c=>{
    c.addEventListener('pointermove',e=>{
      const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.setProperty('--ry',(x*8)+'deg');c.style.setProperty('--rx',(-y*8)+'deg');
    });
    c.addEventListener('pointerleave',()=>{c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg');});
  });
}

// Панели поёнӣ дар мобилӣ пинҳон мешавад, вақте форма намоён аст
const cta=$('tamos');
if('IntersectionObserver' in window)new IntersectionObserver(es=>es.forEach(e=>document.body.classList.toggle('at-cta',e.isIntersecting)),{threshold:.25}).observe(cta);

// Ҳисоб бо анимасияи рақам
let shown=18000,raf=0;
function total(){return (+$('v').value)*(+$('c').value)/100*(+$('a').value);}
function tween(to){
  cancelAnimationFrame(raf);
  if(reduce){shown=to;$('res').textContent=fmt(to);return;}
  const from=shown,t0=performance.now(),dur=550;
  const step=t=>{
    const k=Math.min((t-t0)/dur,1),e=1-Math.pow(1-k,3);
    shown=from+(to-from)*e;$('res').textContent=fmt(shown);
    if(k<1)raf=requestAnimationFrame(step);
  };
  raf=requestAnimationFrame(step);
}
function calc(){
  $('vv').textContent=fmt(+$('v').value);$('cv').textContent=$('c').value+'%';$('av').textContent=fmt(+$('a').value);
  tween(total());
}
['v','c','a'].forEach(i=>{
  $(i).addEventListener('input',calc);
  $(i).addEventListener('change',()=>{$('sr').textContent='Ҳисоби намунавӣ: '+fmt(total())+' сомонӣ дар як моҳ.';});
});
calc();

// Боздоштани лента
const band=document.querySelector('.band'),pb=$('pause');
pb.addEventListener('click',()=>{
  const on=band.classList.toggle('paused');
  pb.setAttribute('aria-pressed',on);
  pb.textContent=on?'Идома додани ҳаракат':'Боздоштани ҳаракат';
});

// Форма
let last=0;
const clean=s=>s.replace(/[\u0000-\u001F\u007F<>]/g,'').trim();
$('f').addEventListener('submit',e=>{
  e.preventDefault();
  const err=$('err'),ok=$('ok');
  err.textContent='';ok.textContent='';
  if($('w').value)return;
  if(Date.now()-last<5000){err.textContent='Лутфан каме интизор шавед.';return;}
  const name=clean($('n').value),tel=clean($('t').value);
  if(name.length<2){err.textContent='Номи худро нависед (на камтар аз 2 ҳарф).';$('n').focus();return;}
  if(!/^\+?[0-9\s()-]{7,18}$/.test(tel)){err.textContent='Рақами телефонро дуруст нависед, масалан +992 900 00 00 00.';$('t').focus();return;}
  if(!validTG){err.textContent='Формаи тамос ҳоло танзим нашудааст.';return;}
  last=Date.now();
  const text=encodeURIComponent('Салом! Ном: '+name+', телефон: '+tel);
  window.open('https://t.me/'+TG+'?text='+text,'_blank','noopener,noreferrer');
  ok.textContent='Ташаккур! Telegram кушода мешавад, паёмро фиристед.';
  e.target.reset();
});
})();
