/*! WORD ME UP · Let's Practice · (c) English-Me-Up Hybrid Education Co., Ltd. All Rights Reserved.
 *  เลขเวอร์ชัน: มาจาก ?v= ตอนโหลดไฟล์นี้ (ตั้งที่เดียวใน libs/practice-version.js)
 *  ใช้: window.LetsPractice.mount(rootElement, cfg) → { destroy(), pending(), flush() }
 *  cfg = {
 *    mode: 'app' | 'demo',
 *    set: { no, total, label, words:[{w,p,th,syn,s}], form:[{w,s,o,a,tip}], avail? },
 *    progress: { xp, toured, seen:{s1:true..}, stars:{s1:0-3..}, got:['abduct',..] },   (app เท่านั้น)
 *    sets: [{ no, first, last, stars, maxStars, passed, unlocked }],                    (app: ปุ่ม "เปลี่ยนชุด")
 *    loadSet: function(no) → Promise<{ set, progress }>,
 *    onSave:  function(payload) → Promise<{ xp }>,   payload = { no, stars, got, seen, xg:[{id,g}], toured? }  (xg = XP ที่ได้เพิ่ม)
 *    storeKey: 'lp_pending_<userId>'  (เก็บผลที่ยังส่งไม่สำเร็จไว้ในเครื่อง ส่งต่อให้เองครั้งหน้า)
 *    onAuthLost: function(code)       (หมดเวลาเข้าสู่ระบบระหว่างเล่น → พาไปหน้า login)
 *    loggedIn: bool  (เดโม: ผู้ที่ login อยู่แล้วไม่ต้องเห็นกล่องขายของ)
 *    isAdmin: bool  (แสดงสวิตช์ "เปิดทุกด่าน"),
 *    assetBase: '/practice/img/', lineUrl, showLogo: true, showCopyright: true, autoTour: false,
 *    history: true   (ปุ่ม Back ของเบราว์เซอร์/มือถือ ระหว่างเล่น = กลับแผนที่ด่าน ไม่หลุดออกจากหน้า)
 *  }
 */
(function(){
var DIMS={"boy_conf":[163,300],"boyb":[156,300],"boyg":[156,300],"girl_a":[163,300],"girl_b":[163,300],"girl_conf":[181,300],"joe_arms":[162,300],"joe_phone":[101,214],"kick_boy":[209,300],"logo":[262,100],"ring":[720,476],"rope_girl":[246,300],"study_boy":[193,300],"train":[720,402]};
var BODY="\n<svg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\">\n <defs>\n  <filter id=\"sh\" x=\"-20%\" y=\"-30%\" width=\"140%\" height=\"180%\"><feDropShadow dx=\"0\" dy=\"3\" stdDeviation=\"3\" flood-color=\"#0E1A3A\" flood-opacity=\".16\"/></filter>\n  <marker id=\"ah\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto\"><path d=\"M0 0 10 5 0 10z\" fill=\"#D1417D\"/></marker>\n </defs>\n <symbol id=\"i-back\" viewBox=\"0 0 24 24\"><path d=\"m12 19-7-7 7-7M19 12H5\"/></symbol>\n <symbol id=\"i-next\" viewBox=\"0 0 24 24\"><path d=\"M5 12h14M12 5l7 7-7 7\"/></symbol>\n <symbol id=\"i-star\" viewBox=\"0 0 24 24\"><path d=\"M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z\"/></symbol>\n <symbol id=\"i-bolt\" viewBox=\"0 0 24 24\"><path d=\"M13.2 2 4 13.6h7l-1.2 8.4L20 10.4h-7z\"/></symbol>\n <symbol id=\"i-flame\" viewBox=\"0 0 24 24\"><path d=\"M12 22c4.1 0 7-2.8 7-6.8 0-3.3-2-5.6-3.6-7.4-.4 1.7-1.3 2.9-2.6 3.4.3-3.3-1-6.5-3.8-9.2.1 3.8-1.8 5.9-3.4 7.8C4.3 11.3 5 12.9 5 15.2 5 19.2 7.9 22 12 22z\"/></symbol>\n <symbol id=\"i-sound\" viewBox=\"0 0 24 24\"><path d=\"M11 5 6 9H2v6h4l5 4z\"/><path d=\"M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14\"/></symbol>\n <symbol id=\"i-lock\" viewBox=\"0 0 24 24\"><rect x=\"4.5\" y=\"11\" width=\"15\" height=\"10\" rx=\"2.5\"/><path d=\"M8 11V7.5a4 4 0 0 1 8 0V11\"/></symbol>\n <symbol id=\"i-check\" viewBox=\"0 0 24 24\"><path d=\"M20 6 9 17l-5-5\"/></symbol>\n <symbol id=\"i-x\" viewBox=\"0 0 24 24\"><path d=\"M18 6 6 18M6 6l12 12\"/></symbol>\n <symbol id=\"i-bulb\" viewBox=\"0 0 24 24\"><path d=\"M9 18h6M10 21.5h4M15 14.5c.2-1 .7-1.8 1.5-2.6A5.3 5.3 0 0 0 18 8.2a6 6 0 0 0-12 0c0 1.1.3 2.4 1.5 3.7.8.8 1.3 1.6 1.5 2.6\"/></symbol>\n <symbol id=\"i-crown\" viewBox=\"0 0 24 24\"><path d=\"m3 7 4.5 4L12 4l4.5 7L21 7l-2 11H5z\"/><path d=\"M5 21h14\"/></symbol>\n <symbol id=\"i-medal\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"15\" r=\"6\"/><path d=\"M8.5 10 6 3h4l2 4 2-4h4l-2.5 7\"/><path d=\"m12 12.2.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2-1.45-1.4 2-.3z\"/></symbol>\n <symbol id=\"i-help\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9.5\"/><path d=\"M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6M12 17.3h.01\"/></symbol>\n <symbol id=\"i-book\" viewBox=\"0 0 24 24\"><path d=\"M2 4.5h6a4 4 0 0 1 4 4V21a3 3 0 0 0-3-3H2zM22 4.5h-6a4 4 0 0 0-4 4V21a3 3 0 0 1 3-3h7z\"/></symbol>\n</svg>\n<div class=\"app\">\n  <header class=\"top\">\n    <a class=\"sr\" id=\"skip\" href=\"#view\">ข้ามไปเนื้อหา</a>\n    <button class=\"back\" id=\"back\" type=\"button\" aria-label=\"กลับไปแผนที่ด่าน\" hidden><svg class=\"i\"><use href=\"#i-back\"/></svg></button>\n    <div class=\"brand\"><img id=\"logo\" alt=\"WORD ME UP\" width=\"95\" height=\"36\"><span class=\"lp\">Let's Practice</span></div>\n    <button class=\"help\" id=\"help\" type=\"button\" aria-haspopup=\"dialog\"><svg class=\"i\" aria-hidden=\"true\"><use href=\"#i-help\"/></svg><span>วิธีใช้</span></button><div class=\"chips\"><span class=\"chip st\" title=\"ดาวที่สะสม\"><svg class=\"i f\" aria-hidden=\"true\"><use href=\"#i-star\"/></svg><span class=\"sr\">ดาว</span><span id=\"starN\">0</span></span><span class=\"chip xp\" title=\"คะแนนประสบการณ์\"><svg class=\"i f\" aria-hidden=\"true\"><use href=\"#i-bolt\"/></svg><span class=\"sr\">XP</span><span id=\"xpN\">0</span></span></div>\n  </header>\n  <div class=\"savewarn\" id=\"savewarn\" role=\"status\" hidden></div>\n  <main id=\"view\" tabindex=\"-1\"></main>\n  <p class=\"sr\" id=\"say\" aria-live=\"polite\"></p>\n  <div class=\"foot\" role=\"region\" aria-label=\"เกี่ยวกับ Let's Practice\">\n    <p class=\"ver\">Let's Practice <span id=\"ver\"></span></p>\n    <p class=\"cr\">Copyright &copy; 2012–<span id=\"yr\">2026</span> English-Me-Up Hybrid Education Co., Ltd. All Rights Reserved.</p>\n    <p>เนื้อหา แบบฝึก คำอธิบาย และภาพการ์ตูนใน WORD ME UP เป็นลิขสิทธิ์ของ ENG ME UP ห้ามคัดลอก ดัดแปลง หรือเผยแพร่ ไม่ว่าทั้งหมดหรือบางส่วน โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร</p>\n  </div>\n</div>\n<div class=\"fb\" id=\"fb\" role=\"dialog\" aria-modal=\"false\" aria-labelledby=\"fbh\" aria-describedby=\"fbp fbt\"><div class=\"in\"><img class=\"fa\" id=\"fba\" alt=\"\" width=\"104\" height=\"190\"><h3 id=\"fbh\"></h3><p id=\"fbp\"></p><div class=\"tip\" id=\"fbt\" hidden></div><div class=\"acts\"><button class=\"btn\" id=\"fbn\" type=\"button\">ไปต่อ <svg class=\"i\" aria-hidden=\"true\"><use href=\"#i-next\"/></svg></button></div></div></div>\n<div class=\"man\" id=\"man\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"manh\" hidden><div class=\"box\" id=\"manbox\"><button class=\"x\" id=\"manx\" type=\"button\" aria-label=\"ปิดคู่มือ\"><svg class=\"i\" aria-hidden=\"true\"><use href=\"#i-x\"/></svg></button><div id=\"manc\"></div></div></div>\n<div class=\"tour\" id=\"tour\" hidden><div class=\"thl\" id=\"thl\"></div><div class=\"ttip\" id=\"ttip\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"tth\" aria-describedby=\"ttx\"><img id=\"tji\" alt=\"\" width=\"60\" height=\"127\"><div class=\"tbody\"><p class=\"tc\" id=\"tc\"></p><h3 id=\"tth\"></h3><p id=\"ttx\"></p><div class=\"tb\"><button type=\"button\" class=\"tskip\" id=\"tskip\">ข้ามทัวร์</button><button type=\"button\" class=\"tprev\" id=\"tprev\">ย้อน</button><button type=\"button\" class=\"btn tnext\" id=\"tnext\">ถัดไป</button></div></div></div></div>\n<div class=\"conf\" id=\"conf\" aria-hidden=\"true\"></div>\n\n";
var POS={n:['คำนาม','noun'],v:['คำกริยา','verb'],adj:['คุณศัพท์','adjective'],adv:['กริยาวิเศษณ์','adverb']};
var STAGES=[
 {id:'s1',img:'boyb',t:'จับคู่',d:'แตะจับคู่คำกับความหมาย'},
 {id:'s2',img:'girl_a',t:'แยกกลุ่ม',d:'คำนี้เป็นคำชนิดไหน'},
 {id:'s3',img:'boyg',t:'หาเพื่อน',d:'เลือกคำที่ความหมายเหมือนกัน'},
 {id:'s4',img:'study_boy',wide:1,t:'เติมให้ลงล็อก',d:'เติมคำในประโยคสั้นๆ'},
 {id:'s5',img:'rope_girl',wide:1,t:'แปลงร่าง',d:'รูปคำ + คำที่มาคู่กัน'},
 {id:'boss',img:'kick_boy',wide:1,t:'บอสท้ายชุด',d:'ถาม-ตอบเร็ว 10 ข้อ คละคำเหมือน เติมประโยค รูปคำ ความหมาย ชก TEST ให้ร่วง!',boss:1}
];
var COACH={idle:['อ่านโจทย์ให้จบก่อนตอบนะ','ไม่ต้องรีบ ค่อยๆ คิด','ลองเดาจากบริบทในประโยคดู'],
 good:['ใช่เลย! ไปต่อ','เยี่ยม จำได้แม่น','แบบนี้แหละ เก่งมาก'],
 bad:['ไม่เป็นไร คำนี้จะวนกลับมาอีก','ผิดตอนฝึกดีกว่าผิดในห้องสอบ','จำเฉลยไว้ เดี๋ยวเจออีกรอบ']};
var HOW={
 s1:{steps:['แตะคำศัพท์ภาษาอังกฤษ 1 คำ (จะได้ยินเสียงอ่านด้วย)','แตะความหมายภาษาไทยที่คู่กัน ถ้าถูก การ์ดทั้งคู่จะจางหายไป','มีหลายรอบ รอบละ 5 คู่ จับคู่ผิดน้อยเท่าไหร่ ยิ่งได้ดาวมาก'],tip:'อ่านให้ครบทั้งสองฝั่งก่อนแตะ อย่าเดาเร็ว'},
 s2:{steps:['ดูคำศัพท์กับความหมายภาษาไทย','เลือกว่าเป็นคำชนิดไหน: noun · verb · adjective · adverb','มี 10 ข้อ ตอบผิดได้ ข้อนั้นจะวนกลับมาให้ลองใหม่ท้ายด่าน'],tip:'ความหมายไทยช่วยได้ เช่น ขึ้นต้นด้วย "การ…" "ความ…" มักเป็นคำนาม'},
 s3:{steps:['อ่านคำโจทย์ กดปุ่มลำโพงเพื่อฟังเสียงได้','เลือกคำที่ความหมายใกล้เคียงที่สุด (synonym)','มี 10 ข้อ ทุกข้อมีเฉลยพร้อมความหมาย'],tip:'จำเป็นคู่คำเหมือน เวลาเจอในบทอ่านจะเดาความหมายได้เร็วขึ้น'},
 s4:{steps:['อ่านประโยคให้จบก่อน แล้วดูช่องว่าง','เลือกคำที่เติมแล้วประโยคมีความหมายลงตัวที่สุด','มี 10 ข้อ ตอบผิดได้ ข้อนั้นจะวนกลับมาอีกครั้ง'],tip:'ดูคำรอบๆ ช่องว่าง จะบอกได้ว่าต้องการคำชนิดไหน'},
 s5:{steps:['อ่านประโยคแล้วดูตำแหน่งของช่องว่าง','เลือกรูปคำที่ถูก (n. / v. / adj. / adv.) หรือคำบุพบทที่มาคู่กัน เช่น absorbed in','มี 10 ข้อ ทุกข้อมีเทคนิคสั้นๆ ให้จำ'],tip:'หลัง a / an / the ตามด้วยคำนาม หรือ คำคุณศัพท์ + คำนาม · ขยายกริยาใช้คำที่ลงท้าย -ly'},
 boss:{steps:['ถาม-ตอบ 10 ข้อ คละคำเหมือน เติมประโยค รูปคำ และความหมาย จากคำในชุดนี้','ตอบถูกติดกัน 3 ข้อขึ้นไป ได้ XP โบนัส','ผ่านบอส = ได้ตรา "ผ่านชุดที่ {no}" และเปิดชุดถัดไป'],tip:'เปิดสมุดคำศัพท์ทวนก่อนเข้าบอส'}
};
var STAR_RULE='ดาวนับจากข้อที่ตอบถูกตั้งแต่ครั้งแรก: 60% ขึ้นไป = 1 ดาว · 80% = 2 ดาว · 100% = 3 ดาว';
var live=null;
// เลขเวอร์ชันมาจาก ?v= ของไฟล์นี้ (host ใส่ให้จาก libs/practice-version.js) → แสดงท้ายเกม + window.LetsPractice.version
var VERSION=(function(){try{var c=document.currentScript,m=c&&String(c.src).match(/[?&]v=([0-9A-Za-z._-]+)/);return m?m[1]:''}catch(e){return ''}})();

/* ---------- คิวบันทึกผล (อยู่ระดับไฟล์ ไม่ผูกกับหน้าจอ) ----------
   - เน็ตช้า/หลุด = ลองส่งใหม่เอง (หน่วงเวลาเพิ่มขึ้นเรื่อยๆ) + แจ้งเตือนบนจอ
   - เก็บไว้ใน localStorage แยกตามผู้ใช้ (cfg.storeKey): รีเฟรช/ปิดหน้า/กดเมนูอื่น/หมดเวลา login → ครั้งหน้าที่เปิดจะส่งต่อให้เอง
   - กดเมนูอื่นระหว่างที่ยังส่งไม่เสร็จ → คิวยังส่งต่อเบื้องหลัง
   - XP ส่งเป็นก้อน { id, g } · server บวกแต่ละ id ครั้งเดียว (ส่งซ้ำไม่บวกซ้ำ) */
var Q={key:'',send:null,items:{},busy:false,tries:0,timer:0,stop:'',code:'',gen:0,waiters:[],ui:null};
function qRead(key){try{var j=JSON.parse(localStorage.getItem(key)||'null');return j&&j.items&&typeof j.items==='object'?j.items:{}}catch(e){return {}}}
function qWrite(){if(!Q.key)return;try{if(Object.keys(Q.items).length)localStorage.setItem(Q.key,JSON.stringify({v:1,items:Q.items}));else localStorage.removeItem(Q.key)}catch(e){}}
function qDone(){var w=Q.waiters;Q.waiters=[];w.forEach(function(f){f()})}
function qIdle(){return !Q.busy&&!Object.keys(Q.items).length}
function qUse(key,send){
  if(Q.key!==key){clearTimeout(Q.timer);Q.gen++;Q.busy=false;Q.tries=0;Q.items=key?qRead(key):{};Q.key=key;qDone()}
  Q.send=send||null;if(Q.stop){Q.stop='';Q.code='';Q.tries=0}
}
function xgUnion(a,b){var ids={},r=[];(a||[]).concat(b||[]).forEach(function(x){if(x&&!ids[x.id]){ids[x.id]=1;r.push(x)}});return r}
function qPut(k,p){
  var old=Q.items[k];
  if(old){p.xg=xgUnion(old.xg,p.xg);if(old.toured)p.toured=true;if(old.seen){p.seen=p.seen||{};for(var j in old.seen)if(old.seen[j])p.seen[j]=1}}
  Q.items[k]=p;qWrite();
}
function qAdd(p){qPut(p.no?String(p.no):'0',p);qPump()}
function qXp(){var n=0;for(var k in Q.items)(Q.items[k].xg||[]).forEach(function(x){n+=x.g||0});return n}
function qKeys(){return Object.keys(Q.items).sort(function(a,b){return a-b})}
function qUi(st,r){if(Q.ui)try{Q.ui(st,r)}catch(e){}}
function qPump(){
  if(Q.busy||!Q.send||Q.stop)return;
  var ks=qKeys();if(!ks.length){qUi('ok');qDone();return}
  var k=ks[0],p=Q.items[k],gen=Q.gen;Q.busy=true;
  Promise.resolve().then(function(){return Q.send(p)}).then(function(r){
    if(gen!==Q.gen)return;Q.busy=false;Q.tries=0;
    var cur=Q.items[k];
    if(cur===p)delete Q.items[k];
    else if(cur){var sent={};(p.xg||[]).forEach(function(x){sent[x.id]=1});cur.xg=(cur.xg||[]).filter(function(x){return !sent[x.id]})} // มีผลใหม่ของชุดเดียวกันเข้ามาระหว่างส่ง ส่งต่อเฉพาะส่วนที่ยังไม่ได้ส่ง
    qWrite();qUi('sent',r);qPump();
  },function(e){
    if(gen!==Q.gen)return;Q.busy=false;
    var st=e&&e.response&&e.response.status;
    if(e&&e.lpUserChanged){Q.stop='user';qDone();return} // เปลี่ยนบัญชีแล้ว: เก็บไว้ในเครื่อง ไม่ส่งไปบัญชีอื่น
    if(st===401){Q.stop='auth';Q.code=(e.response.data&&e.response.data.code)||'';qUi('auth');qDone();return} // หมดเวลา login: เก็บไว้ ส่งหลัง login ใหม่
    if(st>=400&&st<500){ // ข้อมูลไม่ผ่าน (เช่นชุดยังล็อก) ส่งซ้ำก็ไม่ผ่าน → ตัดผลชุดนั้นทิ้ง แต่ XP ยังส่งต่อ
      if(Q.items[k]===p){delete Q.items[k];if(k!=='0'&&p.xg&&p.xg.length)qPut('0',{xg:p.xg,seen:p.seen,toured:p.toured})}
      Q.tries=0;qWrite();qPump();return}
    Q.tries++;qUi('retry');clearTimeout(Q.timer);Q.timer=setTimeout(qPump,Math.min(15000,1500*Q.tries));
  });
}
function qFlush(){if(Q.stop||Q.busy)return;clearTimeout(Q.timer);qPump()}
function qWait(ms){return new Promise(function(res){if(qIdle()||Q.stop||!Q.send)return res();Q.waiters.push(res);setTimeout(res,ms||8000)})}
// host เรียกก่อนโหลดรายการชุด: ส่งผลที่ค้างจากครั้งก่อนให้เสร็จ (หรือจนหมดเวลา ms)
function flushStored(key,send,ms){qUse(key,send);qPump();return qWait(ms||5000)}
if(typeof window!=='undefined')window.addEventListener('online',function(){qFlush()});

function availability(W){var ok=W.length>=4;return {s1:W.length>=2,s2:ok,s3:ok,s4:ok,s5:ok,boss:ok}}  // ทุกด่านเล่นได้เสมอ (ขาดเนื้อหา = ใช้ข้อสำรอง)

function mount(root,cfg){
if(live)live.destroy();
cfg=cfg||{};
var DEMO=cfg.mode==='demo';
var BASE=cfg.assetBase||'/practice/img/';
var LINE_URL=cfg.lineUrl||'https://line.me/R/ti/p/@englishmeup';
var IMG={};for(var k in DIMS)IMG[k]={src:BASE+k+'.webp',w:DIMS[k][0],h:DIMS[k][1]};
var SETS=cfg.sets||null,SET,W,FORM,AV;
var S={stars:{},xp:0,demo:false,got:{},seen:{},toured:false,askTour:0};
var host=document.createElement('div');host.id='lp';
host.className=(cfg.showLogo===false?'nologo ':'')+(cfg.showCopyright===false?'nocopy ':'')+(cfg.embedded?'emb':'');
host.innerHTML=BODY;root.appendChild(host);
var view=$('view'),offs=[],timers=[],dead=false;
function $(id){return host.querySelector('#'+id)}
function q1(sel){return host.querySelector(sel)}
function on(t,ty,fn,o){t.addEventListener(ty,fn,o);offs.push(function(){t.removeEventListener(ty,fn,o)})}
function later(fn,ms){var id=setTimeout(function(){var i=timers.indexOf(id);if(i>=0)timers.splice(i,1);if(!dead)fn()},ms);timers.push(id);return id}
// เปลี่ยนหน้าจอผ่านฟังก์ชันนี้ · กันแตะเบิ้ล (แตะครั้งที่ 2 ภายใน 0.3 วิ ไปโดนปุ่มของหน้าจอใหม่)
var swapAt=0;
function render(h){view.innerHTML=h;swapAt=Date.now()}
function focusEl(el){if(!el)return;try{el.focus({preventScroll:true})}catch(e){try{el.focus()}catch(e2){}}}
function announce(t){var a=$('say');if(!a)return;a.textContent='';later(function(){a.textContent=t},60)}
// ปุ่ม Back ของเบราว์เซอร์/มือถือระหว่างเล่น = กลับแผนที่ด่าน (ไม่หลุดออกจาก Let's Practice)
var HIST=cfg.history!==false&&!!(window.history&&history.pushState),pushed=false,ignorePop=0;
function inStage(){if(!HIST||pushed)return;try{history.pushState(Object.assign({},history.state||{},{lpStage:1}),'');pushed=true}catch(e){}}
function leaveStage(){if(!pushed)return;pushed=false;ignorePop++;try{history.back()}catch(e){ignorePop--}}

// ผลที่ยังค้างส่งของชุดนี้ (จากครั้งก่อน) รวมเข้ากับที่ server ส่งมา → ดาว/สมุดคำศัพท์บนจอไม่ถอยหลัง
function useSet(set,prog){
  SET=set;W=set.words||[];FORM=set.form||[];AV=availability(W);
  prog=prog||{};S.stars={};var st=prog.stars||{};for(var k in st)S.stars[k]=st[k];
  S.got={};(prog.got||[]).forEach(function(w){S.got[w]=1});
  if(prog.seen)for(var j in prog.seen)if(prog.seen[j])S.seen[j]=1;
  if(prog.toured)S.toured=true;
  if(!DEMO){
    for(var q in Q.items){var it=Q.items[q];
      if(it.seen)for(var j2 in it.seen)if(it.seen[j2])S.seen[j2]=1;
      if(it.toured)S.toured=true;
      if(+q===SET.no){for(var s2 in it.stars||{})if((it.stars[s2]||0)>(S.stars[s2]||0))S.stars[s2]=it.stars[s2];(it.got||[]).forEach(function(w){S.got[w]=1})}}
    if(typeof prog.xp==='number')S.xp=prog.xp+qXp();
  }else if(typeof prog.xp==='number')S.xp=prog.xp;
  xpQ=S.xp;
}
// บันทึกผลเข้าคิว (ดูคิวด้านบน) · XP ที่ได้ตั้งแต่บันทึกครั้งก่อน = 1 ก้อน (รหัสไม่ซ้ำ)
var xpQ=0;
function rid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,10)}
function save(extra){
  if(DEMO||!Q.send)return;
  var p={no:SET.no,stars:Object.assign({},S.stars),got:Object.keys(S.got),seen:Object.assign({},S.seen),xg:[]};
  var g=S.xp-xpQ;while(g>0){var c=Math.min(g,400);p.xg.push({id:rid(),g:c});g-=c}xpQ=S.xp;
  if(extra)for(var k in extra)p[k]=extra[k];
  qAdd(p);
}
function saved(ms){return qWait(ms)}
function inPlay(){return !!view.querySelector('.play')}
var authTimer=0;
// หมดเวลา login (401) ระหว่างเล่น: เล่นด่านนั้นต่อให้จบได้ ผลเก็บในเครื่อง → พอจบด่าน/กลับแผนที่ แจ้งเตือนแล้วพาไปหน้า login
function authCheck(){if(!DEMO&&Q.stop==='auth'){saveWarn('auth');authGo()}}
function authGo(){if(dead||Q.stop!=='auth'||authTimer||inPlay())return;authTimer=later(function(){authTimer=0;if(typeof cfg.onAuthLost==='function')cfg.onAuthLost(Q.code)},2500)}
function onQueue(st,r){
  if(dead)return;
  if(st==='sent'&&r&&typeof r.xp==='number'){var extra=S.xp-xpQ;xpQ=r.xp+qXp();S.xp=xpQ+extra;chips()}
  if(st==='retry')saveWarn('net');
  else if(st==='auth'){saveWarn('auth');authGo()}
  else if(qIdle())saveWarn('');
}
function saveWarn(kind){var el=$('savewarn');if(!el)return;
  if(!kind){el.hidden=true;el.innerHTML='';return}
  var per=Q.code==='period';
  el.innerHTML=kind==='auth'
    ?'<span>'+(per?'บัญชีนี้หมดช่วงเวลาเรียนแล้ว ผลที่ยังไม่ได้บันทึกเก็บไว้ในเครื่องนี้ ติดต่อ LINE @englishmeup ได้เลยครับ':'หมดเวลาเข้าสู่ระบบแล้ว ผลที่ยังไม่ได้บันทึกเก็บไว้ในเครื่องนี้ เข้าสู่ระบบใหม่แล้วระบบจะส่งให้เองครับ')+'</span> <button type="button" class="swbtn" id="relogin">'+(per?'ตกลง':'เข้าสู่ระบบใหม่')+'</button>'
    :'<span>ยังบันทึกผลไม่สำเร็จ (เน็ตช้าหรือหลุด) ระบบกำลังลองใหม่เอง ผลเก็บไว้ในเครื่องนี้แล้ว ไม่หายครับ</span>';
  el.hidden=false;
  var b=$('relogin');if(b)b.onclick=function(){if(typeof cfg.onAuthLost==='function')cfg.onAuthLost(Q.code)};
}

// เดโม: คนที่ login อยู่แล้ว (นักเรียน) ไม่ต้องเห็นกล่องชวนสมัคร → ชวนไปเล่นชุดจริงแทน
function lineHTML(){
  if(cfg.loggedIn)return '<section class="lineca"><div><b>คุณเข้าสู่ระบบอยู่แล้ว</b><p>ไปฝึกชุดจริงของคุณต่อได้เลย ดาว XP และสมุดคำศัพท์จะบันทึกไว้ในบัญชีครับ</p></div><a class="lbtn" href="/practice">ไปที่ Let\'s Practice</a></section>';
  return '<section class="lineca"><div><b>สนใจใช้ WORD ME UP ตัวเต็ม?</b><p>ฝึกครบทุกคำของ '+esc(SET.label||'CU-TEP')+(SET.total>1?' ทั้งหมด '+SET.total+' ชุด':'')+' ชุดละประมาณ 20 คำ คู่กับการ์ดท่องศัพท์ · สอบถามได้ที่ LINE <b>@englishmeup</b></p></div><a class="lbtn" href="'+LINE_URL+'" target="_blank" rel="noopener">ติดต่อทาง LINE</a></section>'}
function ic(n,f){return '<svg class="i'+(f?' f':'')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function uniq(a){var o={},r=[];a.forEach(function(x){var k=String(x).toLowerCase();if(x&&!o[k]){o[k]=1;r.push(x)}});return r}
function pick(a,n,ex){var e=ex.map(function(x){return String(x).toLowerCase()});return shuf(uniq(a).filter(function(x){return e.indexOf(String(x).toLowerCase())<0})).slice(0,n)}
function rnd(a){return a[Math.floor(Math.random()*a.length)]}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
// คำอธิบายข้อแปลงร่าง (tip) ใส่ตัวหนาได้ แต่ไม่รันโค้ด: เหลือแค่ <b> <i> <br> <span> ไม่มี attribute (server ก็ตัดให้แล้ว นี่คือชั้นที่ 2)
var TIPOK={b:1,i:1,br:1,span:1};
function cleanTip(h){var s=String(h==null?'':h),re=/<\s*(\/?)\s*([a-zA-Z0-9]*)[^>]*>/g,out='',last=0,m;
  function tx(t){return t.replace(/&(?!(?:[a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  while((m=re.exec(s))){out+=tx(s.slice(last,m.index));var t=m[2].toLowerCase();if(TIPOK[t])out+=t==='br'?'<br>':'<'+m[1]+t+'>';last=re.lastIndex}
  return out+tx(s.slice(last))}
function img(n,cls,alt,lazy){var d=IMG[n];return '<img src="'+d.src+'" width="'+d.w+'" height="'+d.h+'" alt="'+(alt||'')+'"'+(cls?' class="'+cls+'"':'')+(lazy?' loading="lazy"':'')+' decoding="async">'}
function say(t){try{if(!('speechSynthesis' in window))return;speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.9;speechSynthesis.speak(u)}catch(e){}}
function sayBtn(w){return '<button class="say" type="button" data-say="'+esc(w)+'" aria-label="ฟังเสียง '+esc(w)+'">'+ic('sound')+'</button>'}
function av(i){return !!AV[STAGES[i].id]}
function availCount(){return STAGES.filter(function(s,i){return av(i)}).length}
function maxStars(){return availCount()*3}
function totStars(){var n=0;STAGES.forEach(function(s,i){if(av(i))n+=S.stars[s.id]||0});return n}
function chips(){$('starN').textContent=totStars();$('xpN').textContent=S.xp}
function unlocked(i){if(!av(i))return false;if(S.demo)return true;var j=i-1;while(j>=0&&!av(j))j--;return j<0||(S.stars[STAGES[j].id]||0)>0}
function nextStage(i){for(var j=i+1;j<STAGES.length;j++)if(av(j))return j;return -1}
function starHTML(n){var h='';for(var i=0;i<3;i++)h+='<span class="'+(i<n?'on':'')+'">'+ic('star',1)+'</span>';return h}

/* ---------- ภาพฉากของแต่ละด่าน (SVG + การ์ตูนเซต ENG ME UP) ---------- */
var C={navy:'#0E1A3A',pink:'#D1417D',ink:'#B8336F',soft:'#FFE6F0',gold:'#F2AE1C',goldD:'#C98A00',ok:'#157A43',mut:'#6E7180'};
function ch(n,x,y,h,flip){var d=IMG[n],w=Math.round(h*d.w/d.h);return '<image href="'+d.src+'" x="'+(flip?-(x+w):x)+'" y="'+y+'" width="'+w+'" height="'+h+'"'+(flip?' transform="scale(-1,1)"':'')+'/>'}
function card(x,y,w,h,t,o){o=o||{};var fs=o.fs||13;return '<g'+(o.rot?' transform="rotate('+o.rot+' '+(x+w/2)+' '+(y+h/2)+')"':'')+'><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(o.rx||10)+'" fill="'+(o.fill||'#fff')+'"'+(o.stroke?' stroke="'+o.stroke+'" stroke-width="'+(o.sw||1.6)+'"':'')+(o.dash?' stroke-dasharray="'+o.dash+'"':'')+(o.flat?'':' filter="url(#sh)"')+'/>'+(t?'<text x="'+(x+w/2)+'" y="'+(y+h/2+fs*.36)+'" text-anchor="middle" font-size="'+fs+'" font-weight="'+(o.fw||600)+'" fill="'+(o.col||C.navy)+'">'+t+'</text>':'')+'</g>'}
function lbl(x,y,t,c){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="10.5" font-weight="500" fill="'+(c||C.mut)+'">'+t+'</text>'}
function spark(x,y,r){return '<path d="M'+x+' '+(y-r)+'Q'+x+' '+y+' '+(x+r)+' '+y+'Q'+x+' '+y+' '+x+' '+(y+r)+'Q'+x+' '+y+' '+(x-r)+' '+y+'Q'+x+' '+y+' '+x+' '+(y-r)+'Z" fill="'+C.gold+'"/>'}
function tick(cx,cy){return '<circle cx="'+cx+'" cy="'+cy+'" r="8" fill="'+C.ok+'"/><path d="M'+(cx-3.6)+' '+cy+'l2.4 2.6 4.6-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'}
function svg(inner){return '<svg class="scene" viewBox="0 0 320 170" preserveAspectRatio="xMidYMax meet">'+inner+'</svg>'}
var SCN={
 s1:function(){
  var L=function(y1,y2,d){return '<path d="M172 '+y1+'C200 '+y1+' 198 '+y2+' 226 '+y2+'" fill="none" stroke="'+C.pink+'" stroke-width="2.5" stroke-linecap="round"'+(d?' stroke-dasharray="4 5" opacity=".6"':'')+'/>'};
  return svg(ch('boyb',4,22,146)+L(39,85)+L(85,39)+L(131,131,1)
   +card(90,24,84,30,'abrupt',{stroke:C.pink})+card(90,70,84,30,'accurate',{stroke:C.pink})+card(90,116,84,30,'abstain')
   +card(224,24,90,30,'แม่นยำ',{fill:C.soft,col:C.ink,fw:500})+card(224,70,90,30,'กะทันหัน',{fill:C.soft,col:C.ink,fw:500})+card(224,116,90,30,'งดเว้น',{fill:'#fff',col:C.mut,fw:500,stroke:C.pink,dash:'4 3',flat:1})
   +tick(312,26)+tick(312,72))},
 s2:function(){
  var B=function(x,t,c){var y=114,w=64,h=48;return '<g filter="url(#sh)"><path d="M'+x+' '+y+'H'+(x+w)+'L'+(x+w-7)+' '+(y+h)+'H'+(x+7)+'Z" fill="#fff" stroke="'+c+'" stroke-width="2.5" stroke-linejoin="round"/><rect x="'+(x-3)+'" y="'+(y-5)+'" width="'+(w+6)+'" height="9" rx="4.5" fill="'+c+'"/></g><text x="'+(x+w/2)+'" y="'+(y+31)+'" text-anchor="middle" font-size="16" font-weight="700" fill="'+c+'">'+t+'</text>'};
  var A=function(x,y1,y2){return '<path d="M'+x+' '+y1+'V'+y2+'" stroke="'+C.pink+'" stroke-width="2" stroke-dasharray="3 4" marker-end="url(#ah)"/>'};
  return svg(ch('girl_a',2,20,148)+A(132,90,104)+A(204,62,104)+A(276,96,104)
   +B(100,'n.',C.navy)+B(172,'v.',C.pink)+B(244,'adj.',C.goldD)
   +card(96,60,72,26,'acclaim',{rot:-8,fs:12.5})+card(168,32,72,26,'abduct',{rot:6,fs:12.5})+card(240,66,72,26,'abrupt',{rot:-5,fs:12.5}))},
 s3:function(){
  return svg(ch('boyg',2,24,144)+ch('girl_b',238,24,144,1)
   +'<path d="M120 70Q160 40 200 70" fill="none" stroke="'+C.pink+'" stroke-width="2" stroke-dasharray="3 4"/>'
   +card(74,58,70,30,'abrupt',{stroke:C.pink})+card(176,58,72,30,'sudden',{stroke:C.pink})
   +'<circle cx="160" cy="73" r="15" fill="'+C.gold+'" filter="url(#sh)"/><text x="160" y="80" text-anchor="middle" font-size="20" font-weight="700" fill="'+C.navy+'">≈</text>'
   +card(106,104,108,24,'ความหมายเหมือนกัน',{fill:C.soft,col:C.ink,fw:500,fs:11,rx:12,flat:1})
   +spark(160,30,7)+spark(132,40,4)+spark(190,38,4))},
 s4:function(){
  return svg(ch('study_boy',0,20,148)
   +card(100,104,214,44,'',{rx:12})
   +'<text x="180" y="131" text-anchor="end" font-size="13.5" fill="'+C.navy+'">came to an</text>'
   +'<rect x="186" y="113" width="64" height="26" rx="7" fill="'+C.soft+'" stroke="'+C.pink+'" stroke-width="1.8" stroke-dasharray="4 3"/>'
   +'<text x="256" y="131" font-size="13.5" fill="'+C.navy+'">end.</text>'
   +'<path d="M222 66Q232 86 220 104" fill="none" stroke="'+C.pink+'" stroke-width="2" stroke-dasharray="3 4" marker-end="url(#ah)"/>'
   +card(186,34,68,30,'abrupt',{fill:C.pink,col:'#fff',rot:-7})+spark(262,30,6)+spark(176,26,4))},
 s5:function(){
  return svg(ch('rope_girl',0,28,140)
   +'<path d="M210 36Q262 30 262 58" fill="none" stroke="'+C.pink+'" stroke-width="2" marker-end="url(#ah)"/>'
   +'<path d="M236 93Q240 122 224 124" fill="none" stroke="'+C.pink+'" stroke-width="2" marker-end="url(#ah)"/>'
   +card(124,20,86,28,'accurate',{fs:12.5})+lbl(167,60,'adj.')
   +card(206,62,104,28,'accurately',{fs:12.5,stroke:C.pink})+lbl(290,104,'adv.')
   +card(132,110,88,28,'accuracy',{fs:12.5,fill:C.soft,col:C.ink})+lbl(176,152,'n.')
   +spark(300,22,6)+spark(122,82,5)+spark(298,140,4))}
};

/* ---------- คู่มือการใช้งาน (ในตัวแอป) ---------- */
var MAN=[
 {t:'เลือกด่านจากแผนที่',d:'1 ชุดมีประมาณ 20 คำ 6 ด่าน ไล่จากง่ายไปยาก ผ่านด่านก่อนหน้า (ได้อย่างน้อย 1 ดาว) ด่านถัดไปจะเปิดเอง',v:function(){return '<div class="mv art">'+SCN.s1()+'</div>'}},
 {t:'อ่านวิธีเล่น แล้วกด "เริ่มเลย"',d:'เข้าแต่ละด่านครั้งแรกจะมีหน้าวิธีเล่น 3 ขั้น + เทคนิคจากครูโจ ระหว่างเล่นกด "วิธีเล่น" ใต้ชื่อด่านเพื่อดูซ้ำได้',v:function(){return '<div class="mv mlist"><span><i>1</i>อ่านโจทย์</span><span><i>2</i>เลือกคำตอบ</span><span><i>3</i>ดูเฉลย</span></div>'}},
 {t:'ตอบ แล้วดูเฉลยทันที',d:'ตอบถูกขึ้นสีเขียว ตอบผิดขึ้นสีแดงพร้อมคำตอบที่ถูกและคำอธิบายสั้นๆ ข้อที่ผิดจะวนกลับมาให้ลองอีกครั้งท้ายด่าน ไม่ต้องกลัวผิด',v:function(){return '<div class="mv mopts"><span class="ok">'+ic('check')+'accurate</span><span class="no">'+ic('x')+'abrupt</span></div>'}},
 {t:'เก็บดาวและ XP',d:'ดาวนับจากข้อที่ตอบถูกตั้งแต่ครั้งแรก: 60% = 1 ดาว · 80% = 2 ดาว · 100% = 3 ดาว · ตอบถูกติดกัน 3 ข้อขึ้นไปได้ XP โบนัส · เล่นซ้ำเพื่อเก็บดาวเพิ่มได้',v:function(){return '<div class="mv mstars"><span>'+ic('star',1)+ic('star',1)+ic('star',1)+'</span><em>'+ic('flame',1)+' x3</em></div>'}},
 {t:'สมุดคำศัพท์',d:'คำที่ตอบถูกแล้วจะเข้าสมุดพร้อมความหมายและปุ่มฟังเสียง ระหว่างเล่นจะไม่เห็นเฉลย ใช้ทวนก่อนเข้าด่านบอสหรือก่อนสอบ',v:function(){return '<div class="mv mbook"><span class="got"><b>abduct</b><small>ลักพาตัว</small></span><span><b>abrupt</b><small>'+ic('lock')+' ยังไม่เปิด</small></span></div>'}},
 {t:'ด่านบอส',d:'10 ข้อ คละคำเหมือน เติมประโยค รูปคำ และความหมาย ผ่านแล้วได้ตรา "ผ่านชุด" และเปิดชุดถัดไป',v:function(){return '<div class="mv mboss">'+img('ring','','',1)+'</div>'}},
 {t:'ใช้ได้ทุกเครื่อง',d:'มือถือ iPad และคอม · ปุ่มลำโพงใช้เสียงอ่านของเครื่อง ถ้าไม่ได้ยินให้เปิดเสียงและปิดโหมดเงียบ',v:function(){return '<div class="mv mdev"><span></span><span></span><span></span></div>'}}
];
var lastFocus=null;
function openDlg(h,label){
  lastFocus=document.activeElement;$('manc').innerHTML=h;var m=$('man');m.setAttribute('aria-labelledby',label);m.hidden=false;document.body.style.overflow='hidden';$('manx').focus();
}
function openMan(){
  var h='<h2 id="manh">'+ic('help')+'วิธีใช้ Let\'s Practice</h2><p class="mlead">'+(DEMO?'ลองเล่นได้ทันที ไม่ต้องสมัคร · ใช้เวลาด่านละ 2-4 นาที':'ฝึกใช้คำศัพท์ต่อจากการ์ดท่องศัพท์ · วันละด่านก็พอ')+'</p><button class="btn tourbtn" type="button" id="mtour">'+ic('next')+'ให้ครูโจพาทัวร์ 1 นาที</button><p class="mlead" style="margin-top:10px">หรืออ่านทีละขั้นด้านล่าง</p><ol class="mansteps">';
  MAN.forEach(function(m,i){h+='<li><div class="mvw">'+m.v()+'</div><div><b><i>'+(i+1)+'</i>'+m.t+'</b><p>'+m.d+'</p></div></li>'});
  h+='</ol>';
  if(DEMO)h+='<div class="diff"><b>เดโมนี้ต่างจากแอปจริงยังไง</b><ul><li>เดโมมี 1 ชุด (ชุดที่ 1 ของแอปจริง) · แอปจริงมีครบทุกคำของ '+esc(SET.label||'CU-TEP')+' แบ่งเป็นชุดละประมาณ 20 คำ'+(SET.total>1?' ทั้งหมด '+SET.total+' ชุด':'')+'</li><li>เดโมไม่บันทึกผล รีเฟรชแล้วเริ่มใหม่ · แอปจริงบันทึกดาว XP และสมุดคำศัพท์ไว้ในบัญชี</li><li>แอปจริงใช้คู่กับการ์ดท่องศัพท์ (Main) และหน้าคำที่จำได้แล้ว (My Completed Words)</li></ul>'+lineHTML()+'</div>';
  h+='<button class="btn" id="manok" type="button">เข้าใจแล้ว เริ่มเล่น</button>';
  openDlg(h,'manh');$('manok').onclick=closeMan;$('mtour').onclick=startTour;
}
function closeMan(){var m=$('man');if(m.hidden)return;m.hidden=true;document.body.style.overflow='';var f=lastFocus&&host.contains(lastFocus)?lastFocus:$('help');try{f.focus()}catch(e){}}

/* ---------- เลือกชุด (แอปจริง) ---------- */
function openSets(){
  if(!SETS)return;
  var h='<h2 id="seth">'+ic('book')+'เลือกชุดคำศัพท์</h2><p class="mlead">ชุดละประมาณ 20 คำ · ผ่านบอสของชุดก่อนหน้า ชุดถัดไปจะเปิดเอง</p><ul class="setgrid">';
  SETS.forEach(function(s){var cur=s.no===SET.no,lk=(!s.unlocked&&!S.demo)||!s.count;
    h+='<li><button type="button" class="setc'+(cur?' cur':'')+(lk?' lock':'')+(s.passed?' passed':'')+'" data-no="'+s.no+'"'+(lk?' aria-disabled="true"':'')+(cur?' aria-current="true"':'')+'><span class="n">ชุด '+s.no+'</span><span class="r">'+(s.count?esc(s.first)+' → '+esc(s.last):'ไม่มีคำในชุดนี้')+'</span><span class="s">'+(!s.count?'':lk?ic('lock')+' ยังล็อก':ic('star',1)+' '+(s.stars||0)+'/'+(s.maxStars||18)+(s.passed?' · '+ic('medal')+'ผ่าน':''))+'</span></button></li>'});
  h+='</ul>';
  openDlg(h,'seth');
  [].forEach.call(host.querySelectorAll('.setc'),function(b){b.onclick=function(){
    if(b.classList.contains('lock')){b.animate&&b.animate([{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'none'}],{duration:240});return}
    closeMan();var no=+b.dataset.no;if(no!==SET.no)pickSet(no)}});
}
function pickSet(no){
  if(typeof cfg.loadSet!=='function')return;
  $('back').hidden=true;closeFb();leaveStage();render('<p class="loading">กำลังโหลดชุดที่ '+no+'…</p>');
  saved(8000).then(function(){return cfg.loadSet(no)}).then(function(r){if(dead)return;useSet(r.set,r.progress);map()}).catch(function(){
    if(dead)return;render('<section class="res"><h2>โหลดชุดที่ '+no+' ไม่สำเร็จ</h2><p>ลองใหม่อีกครั้ง หรือรีเฟรชหน้า</p><div class="acts"><button class="btn ghost" id="tomap" type="button">กลับแผนที่ด่าน</button></div></section>');$('tomap').onclick=map});
}
function syncSets(){
  if(!SETS)return;var me=SETS[SET.no-1];if(!me)return;
  me.stars=totStars();me.maxStars=maxStars();if((S.stars.boss||0)>0){me.passed=true;if(SETS[SET.no])SETS[SET.no].unlocked=true}
}

/* ---------- ทัวร์ 1 นาที ---------- */
var TOUR=[
 {t:'สวัสดีครับ ครูโจเองนะ',x:'ขอพาดู Let\'s Practice แป๊บเดียว ประมาณ 1 นาที กด "ถัดไป" ไปเรื่อยๆ ได้เลย'},
 {sel:'.hero',t:'นี่คือชุดคำศัพท์ที่กำลังฝึก',x:'ชุดละประมาณ 20 คำ แถบด้านล่างบอกว่าผ่านไปกี่ด่าน และเก็บดาวได้กี่ดวงแล้ว'},
 {sel:'.node[data-i="0"]',t:'เริ่มที่ด่าน 1 เสมอ',x:'ภาพบนการ์ดบอกวิธีเล่นของด่านนั้น กดแล้วจะเจอหน้าวิธีเล่นสั้นๆ ก่อนเริ่มทุกด่าน'},
 {lock:1,sel:'.node[data-i="1"]',t:'ด่านที่มีแม่กุญแจ ยังล็อกอยู่',x:'ผ่านด่านก่อนหน้าได้อย่างน้อย 1 ดาว ด่านถัดไปจะเปิดเอง ไล่จากง่ายไปยาก'},
 {sel:'.node.boss',t:'ด่านบอส',x:'10 ข้อ คละคำเหมือน เติมประโยค รูปคำ และความหมาย ผ่านแล้วได้ตรา "ผ่านชุด" และเปิดชุดถัดไป ตอบผิดได้ ข้อนั้นจะวนกลับมาให้ลองใหม่'},
 {sel:'.book',t:'สมุดคำศัพท์',x:'คำที่ตอบถูกจะเข้าสมุดพร้อมความหมายและเสียงอ่าน ระหว่างเล่นจะไม่เห็นเฉลย ใช้ทวนก่อนเข้าบอสหรือก่อนสอบ'},
 {sel:'.top .chips',t:'ดาวและ XP',x:'ดาวนับจากข้อที่ตอบถูกตั้งแต่ครั้งแรก ตอบถูกติดกัน 3 ข้อขึ้นไปได้ XP โบนัส'},
 {sel:'#help',t:'ลืมวิธีเล่น กดตรงนี้',x:'เปิดคู่มือ หรือเริ่มทัวร์นี้ใหม่ได้ทุกเมื่อ'},
 {sel:'.node[data-i="0"]',t:'พร้อมแล้ว ลุยกันเลย!',x:'วันละด่านก็พอ ไม่ต้องรีบ ครูโจเชียร์อยู่',last:1}
];
var T={i:0,on:false};
function tourAsk(){return '<section class="tourask"><img src="'+IMG.joe_phone.src+'" alt="" width="'+IMG.joe_phone.w+'" height="'+IMG.joe_phone.h+'"><div class="tt"><b>ใช้ครั้งแรกใช่ไหม?</b><p>ให้ครูโจพาทัวร์ 1 นาที รู้ครบว่าเล่นยังไง</p></div><div class="ta"><button class="btn" type="button" id="tgo">เริ่มทัวร์</button><button class="btn ghost" type="button" id="tno">ไม่เป็นไร</button></div></section>'}
function startTour(){closeMan();if(!view.querySelector('.map'))map();S.askTour=1;var a=view.querySelector('.tourask');if(a)a.remove();T.i=0;T.on=true;$('tour').hidden=false;document.body.style.overflow='hidden';showStep()}
function endTour(){if(!T.on)return;T.on=false;$('tour').hidden=true;document.body.style.overflow='';if(!S.toured){S.toured=true;save({toured:true})}}
// จอเตี้ย (มือถือแนวนอน) หรือแคบ → คำอธิบายทัวร์เป็นแผ่นด้านล่าง ไม่บังจุดที่กำลังอธิบาย
function tourMob(){return innerWidth<700||innerHeight<500}
// ขั้น "ด่านที่ล็อก": ชี้ด่านแรกที่ยังล็อกอยู่จริง · ถ้าเปิดครบแล้ว (ผู้เล่นเก่า) อธิบายกติกาแทน
function tourStep(st){
  if(!st.lock)return st;
  var k=-1;for(var i=1;i<STAGES.length;i++)if(av(i)&&!unlocked(i)){k=i;break}
  if(k>0)return {sel:'.node[data-i="'+k+'"]',t:'ด่านที่มีแม่กุญแจ ยังล็อกอยู่',x:'ผ่านด่านก่อนหน้าได้อย่างน้อย 1 ดาว ด่านถัดไปจะเปิดเอง ไล่จากง่ายไปยาก'};
  return {sel:'.node[data-i="1"]',t:'ด่านเปิดตามลำดับ',x:'ด่านถัดไปจะเปิดเมื่อผ่านด่านก่อนหน้า (ได้อย่างน้อย 1 ดาว) ตอนนี้ชุดนี้เปิดครบทุกด่านแล้ว เล่นซ้ำเพื่อเก็บดาวเพิ่มได้เลยครับ'};
}
function showStep(){
  var st=tourStep(TOUR[T.i]),el=st.sel?q1(st.sel):null;
  $('tc').textContent=(T.i+1)+' / '+TOUR.length;$('tth').textContent=st.t;$('ttx').textContent=st.x;
  $('tprev').hidden=T.i===0;$('tnext').innerHTML=st.last?'เริ่มด่าน 1 '+ic('next'):'ถัดไป '+ic('next');
  var j=st.last?'joe_phone':(T.i===0?'joe_arms':(T.i%2?'joe_phone':'joe_arms'));$('tji').src=IMG[j].src;
  if(el){var r=el.getBoundingClientRect(),mob=tourMob(),y=r.top+scrollY;
    var to=mob?y-(innerHeight<500?12:84):(r.height<innerHeight-160?y-(innerHeight-r.height)/2:y-90);window.scrollTo(0,Math.max(0,to))}
  requestAnimationFrame(placeTour);later(function(){$('tnext').focus()},30);
}
function placeTour(){
  if(!T.on||dead)return;var st=tourStep(TOUR[T.i]),el=st.sel?q1(st.sel):null,hl=$('thl'),tip=$('ttip'),mob=tourMob();
  if(el){var r=el.getBoundingClientRect(),p=8,top=Math.max(r.top-p,6),bot=Math.min(r.bottom+p,mob?innerHeight-tip.offsetHeight-12:innerHeight-6);
    hl.style.left=(r.left-p)+'px';hl.style.top=top+'px';hl.style.width=(r.width+p*2)+'px';hl.style.height=Math.max(bot-top,44)+'px';hl.style.opacity=1}
  else{hl.style.left='50%';hl.style.top='45%';hl.style.width='0px';hl.style.height='0px';hl.style.opacity=1}
  if(mob){tip.classList.add('sheet');tip.style.left='';tip.style.top='';return}
  tip.classList.remove('sheet');var tw=tip.offsetWidth,th=tip.offsetHeight,x,y;
  if(!el){x=(innerWidth-tw)/2;y=(innerHeight-th)/2}
  else{var r2=el.getBoundingClientRect();y=r2.bottom+18;
    if(y+th>innerHeight-10){y=r2.top-th-18}
    if(y<10){y=Math.min(Math.max(r2.top,10),innerHeight-th-10);x=r2.right+18;if(x+tw>innerWidth-10)x=r2.left-tw-18}
    else x=Math.min(Math.max(r2.left,12),innerWidth-tw-12);
    if(x<10)x=10}
  tip.style.left=x+'px';tip.style.top=y+'px';
}

/* ---------- MAP ---------- */
function map(){
  $('back').hidden=true;closeFb();
  var nAv=availCount(),done=STAGES.filter(function(s,i){return av(i)&&S.stars[s.id]}).length,mx=maxStars();
  var h=(!S.toured&&!S.askTour?tourAsk():'')+'<div class="map"><div class="hero-w"><section class="hero"><div class="txt"><small>'+(DEMO?'ชุดตัวอย่างฟรี · ไม่ต้องสมัคร · '+esc(SET.label||''):'ชุดที่ '+SET.no+' / '+SET.total+' · '+esc(SET.label||''))+'</small><h1>ศัพท์ '+W.length+' คำ<br>'+esc(W[0].w)+' → '+esc(W[W.length-1].w)+'</h1><p>ผ่านทีละด่าน เก็บดาวให้ครบ '+mx+' ดวง</p>'+(SETS&&SETS.length>1?'<button class="setbtn" type="button" id="sets">'+ic('book')+'เปลี่ยนชุด</button>':'')+'</div>'
   +'<div class="stage-art">'+img('train','','',0)+'</div>'
   +'<div class="txt"><div class="bar"><b style="width:'+Math.round(done/(nAv||1)*100)+'%"></b></div><div class="bar-l"><span>ผ่านแล้ว '+done+'/'+nAv+' ด่าน</span><span>'+ic('star',1)+' '+totStars()+'/'+mx+'</span></div></div></section>'
   +'<p class="hint">'+ic('bulb')+'<span>วันละด่านก็พอ ไม่ต้องรีบ ตอบผิดได้ เดี๋ยวคำนั้นวนกลับมาให้ลองใหม่</span></p></div><ol class="path">';
  STAGES.forEach(function(s,i){var lk=!unlocked(i),st=S.stars[s.id]||0;
    h+='<li'+(s.boss?' class="bossli"':(i===3?' class="w3"':i===4?' class="w3 wide2"':''))+'><button type="button" class="node'+(s.boss?' boss':'')+(lk?' lock':'')+(st?' done':'')+'" data-i="'+i+'" '+(lk?'aria-disabled="true"':'')+'>'
     +'<span class="art" aria-hidden="true">'+(s.boss?img('ring','','',1):SCN[s.id]())+(lk?'<span class="lk">'+ic('lock')+'</span>':'')+'</span>'
     +'<span class="num" aria-hidden="true">'+(st?ic('check'):(s.boss?ic('crown'):(i+1)))+'</span>'
     +'<span class="meta"><span class="t"><b>'+'ด่าน '+(s.boss?'บอส':(i+1))+' · '+s.t+'</b><small>'+(lk?'ผ่านด่านก่อนหน้าเพื่อเปิด':s.d)+'</small></span>'+'<span class="stars" role="img" aria-label="'+st+' จาก 3 ดาว">'+starHTML(st)+'</span>'+'</span></button></li>'});
  h+='</ol><div class="extra">'+(DEMO?lineHTML():(cfg.isAdmin?'<label class="demo"><input type="checkbox" id="demo" '+(S.demo?'checked':'')+'> เปิดทุกด่าน (โหมดแอดมิน)</label>':''));
  var gotN=W.filter(function(x){return S.got[x.w]}).length;
  h+='<section class="book" aria-labelledby="bkh"><h2 id="bkh">'+ic('book')+'สมุดคำศัพท์<span>'+gotN+'/'+W.length+'</span></h2><p>ตอบถูกคำไหน คำนั้นจะเข้าสมุดพร้อมความหมาย ไว้ทวนก่อนสอบ (ระหว่างเล่นจะไม่เห็นเฉลย)</p><div class="pb"><b style="width:'+Math.round(gotN/(W.length||1)*100)+'%"></b></div><ul class="wl">'
   +W.map(function(x){return S.got[x.w]?'<li class="got"><span><b>'+esc(x.w)+'</b><small>'+esc(x.th)+'</small></span>'+sayBtn(x.w)+'</li>':'<li><span><b>'+esc(x.w)+'</b><span class="hid">'+ic('lock')+'ยังไม่เปิด</span></span></li>'}).join('')+'</ul></section></div></div>';
  leaveStage();render(h);window.scrollTo(0,0);chips();authCheck();
  [].forEach.call(view.querySelectorAll('.node'),function(b){b.addEventListener('click',function(){var i=+b.dataset.i;if(!unlocked(i)){b.animate&&b.animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'none'}],{duration:250});return}start(i)})});
  if($('tgo')){$('tgo').onclick=startTour;$('tno').onclick=function(){S.askTour=1;var a=view.querySelector('.tourask');if(a)a.remove();if(!S.toured){S.toured=true;save({toured:true})}}}
  if($('sets'))$('sets').onclick=openSets;
  [].forEach.call(view.querySelectorAll('.book [data-say]'),function(b){b.addEventListener('click',function(){say(b.dataset.say)})});
  if($('demo'))$('demo').addEventListener('change',function(){S.demo=this.checked;map()});
}

/* ---------- สร้างโจทย์แต่ละด่าน ---------- */
// คำที่ความหมายใกล้กันมาก (set.avoid) จะไม่ถูกใช้เป็นตัวหลอกของกันและกัน
function thKey(t){return String(t||'').replace(/\s+/g,' ').trim()}
function near(x){var r=[];(SET.avoid||[]).forEach(function(g){if(g.indexOf(x.w)>=0)g.forEach(function(w){if(w!==x.w)r.push(w)})});
  W.forEach(function(y){if(y!==x&&thKey(x.th)&&thKey(y.th)===thKey(x.th)&&r.indexOf(y.w)<0)r.push(y.w)});return r} // คำที่คำแปลไทยเหมือนกัน (เช่น comprise/consist) ไม่ใช้เป็นตัวหลอกของกัน
function nearSyn(x){var n=near(x);return W.filter(function(y){return n.indexOf(y.w)>=0&&y.syn}).map(function(y){return y.syn})}
// ข้อสำรอง (ใช้เมื่อคำไหนยังไม่มีประโยค/คำเหมือน/ชนิดคำ) — ทำให้ทุกด่านมีครบ 10 ข้อเสมอ
function qEnTh(x){var o=shuf([x.th].concat(pick(W.map(function(y){return y.th}),3,[x.th])));return {kind:'mc',stem:'<div class="w">'+esc(x.w)+sayBtn(x.w)+'</div><div class="pos">แปลว่าอะไร</div>',o:o,a:o.indexOf(x.th),x:x,tip:'<b>'+esc(x.w)+'</b> = '+esc(x.th)}}
function qThEn(x){var nx=near(x),same=W.filter(function(y){return y.p===x.p&&y!==x&&nx.indexOf(y.w)<0}).map(function(y){return y.w});var o=shuf([x.w].concat(pick(same.length>=3?same:W.map(function(y){return y.w}),3,[x.w].concat(nx))));return {kind:'mc',stem:'<div class="pos">คำไหนแปลว่า</div><div class="w">'+esc(x.th)+'</div>',o:o,a:o.indexOf(x.w),x:x,tip:'<b>'+esc(x.w)+'</b>'+(x.p?' ('+x.p+')':'')+' = '+esc(x.th)}}
function fill(q,used,make){var rest=shuf(W.filter(function(x){return used.indexOf(x)<0&&x.th}));for(var i=0;q.length<10&&i<rest.length;i++)q.push(make(rest[i]));return q}
function build(id){
  var q=[],used=[];
  if(id==='s2'){shuf(W.filter(function(x){return POS[x.p]})).slice(0,10).forEach(function(x){used.push(x);q.push({kind:'pos',x:x})});fill(q,used,qEnTh)}
  if(id==='s3'){var sw=W.filter(function(x){return x.syn}),synAll=sw.map(function(y){return y.syn});
    if(uniq(synAll).length>=4)shuf(sw).slice(0,10).forEach(function(x){var ex=[x.syn].concat(nearSyn(x)),ds=pick(synAll,3,ex);if(ds.length<3)return;used.push(x);var o=shuf([x.syn].concat(ds));q.push({kind:'mc',stem:'<div class="w">'+esc(x.w)+sayBtn(x.w)+'</div><div class="pos">ความหมายใกล้เคียงที่สุดคือ…</div>',o:o,a:o.indexOf(x.syn),x:x,tip:'<b>'+esc(x.w)+'</b> ≈ <b>'+esc(x.syn)+'</b> = '+esc(x.th)})});
    fill(q,used,qEnTh)}
  if(id==='s4'){shuf(W.filter(function(x){return x.s&&x.s.indexOf('___')>=0})).slice(0,10).forEach(function(x){used.push(x);var b=qThEn(x);b.stem='<div class="sent">'+esc(x.s).replace('___','<span class="gap">?</span>')+'</div>';q.push(b)});fill(q,used,qThEn)}
  if(id==='s5'){shuf(FORM).slice(0,10).forEach(function(f){var o=shuf(f.o.map(function(t,i){return {t:t,c:i===f.a}}));q.push({kind:'mc',stem:'<div class="sent">'+esc(f.s).replace('___','<span class="gap">?</span>')+'</div>',o:o.map(function(z){return z.t}),a:o.findIndex(function(z){return z.c}),tip:f.tip?cleanTip(f.tip):''})});fill(q,used,qThEn)}
  if(id==='boss'){var pool=[];
    ['s3','s4','s5'].forEach(function(k){build(k).slice(0,2).forEach(function(z){pool.push(z)})});
    var have=pool.map(function(z){return z.x}).filter(Boolean);
    shuf(W.filter(function(x){return have.indexOf(x)<0})).slice(0,Math.max(0,10-pool.length)).forEach(function(x){pool.push(qEnTh(x))});
    q=shuf(pool)}
  return q;
}

/* ---------- coach (จอกว้าง) ---------- */
function coachHTML(){return '<aside class="coach" id="coach" aria-hidden="true"><div class="bub" id="cbub">'+rnd(COACH.idle)+'</div><div class="fig">'+img('joe_arms','','',0).replace('<img','<img id="cimg"')+'</div></aside>'}
function coach(mood){var c=$('coach');if(!c)return;var m={good:'joe_phone',bad:Math.random()<.5?'girl_conf':'boy_conf',idle:'joe_arms'}[mood];
  var im=$('cimg');im.src=IMG[m].src;im.width=IMG[m].w;im.height=IMG[m].h;$('cbub').textContent=rnd(COACH[mood]);c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump')}

/* ---------- วิธีเล่นแต่ละด่าน ---------- */
function howHTML(id){var H=HOW[id];return '<ol class="steps">'+H.steps.map(function(t){return '<li>'+t.replace('{no}',SET.no)+'</li>'}).join('')+'</ol><p class="ktip">'+ic('bulb')+'<span><b>ครูโจแนะ:</b> '+H.tip+'</span></p>'}
function howBox(id){return '<details class="howto"><summary>'+ic('bulb')+'วิธีเล่น</summary>'+howHTML(id)+'</details>'}
function intro(i){
  var s=STAGES[i];$('back').hidden=false;closeFb();
  var h='<section class="intro"><div class="art'+(s.boss?' bossart':'')+'" aria-hidden="true">'+(s.boss?img('ring','','',0):SCN[s.id]())+'</div><div class="ib"><p class="stage-t">ด่าน '+(s.boss?'บอส':(i+1))+'</p><h2>'+s.t+'</h2><p class="lead">'+s.d+'</p><h3>วิธีเล่น</h3>'+howHTML(s.id)+'<p class="srule">'+ic('star',1)+'<span>'+STAR_RULE+'</span></p><button class="btn" id="go" type="button">เริ่มเลย '+ic('next')+'</button><button class="btn ghost" id="bk" type="button">กลับแผนที่ด่าน</button></div></section>';
  inStage();render(h);window.scrollTo(0,0);
  $('go').onclick=function(){S.seen[s.id]=1;save();start(i)};$('bk').onclick=map;later(function(){focusEl($('go'))},50);
}

/* ---------- PLAY ---------- */
var R;
function start(i){
  var s=STAGES[i];if(!av(i))return map();if(!S.seen[s.id])return intro(i);$('back').hidden=false;inStage();
  if(s.id==='s1')return matchStage(i);
  R={i:i,s:s,q:build(s.id),k:0,total:0,firstTry:{},combo:0,miss:{}};R.total=R.q.length;
  ask();
}
function head(){var pct=Math.round(Object.keys(R.firstTry).length/R.total*100);
  return '<div class="prog"><div class="pb"><b style="width:'+pct+'%"></b></div><span class="cnt">'+Math.min(Object.keys(R.firstTry).length+1,R.total)+'/'+R.total+'</span><span class="combo">'+(R.combo>=3?ic('flame',1)+' x'+R.combo:'')+'</span></div><p class="stage-t">ด่าน '+(R.s.boss?'บอส':(R.i+1))+' · '+R.s.t+'</p>'+howBox(R.s.id)}
// ข้อใหม่ = เลื่อนให้เห็นโจทย์ (ถ้าโจทย์อยู่เหนือจอ) + ย้ายโฟกัสไปที่โจทย์ (คีย์บอร์ด/โปรแกรมอ่านหน้าจอไม่หลง)
function qFocus(){var q=view.querySelector('.q')||view.querySelector('.match');if(!q)return;var r=view.getBoundingClientRect();if(r.top<0)window.scrollTo(0,Math.max(0,r.top+scrollY-8));focusEl(q)}
function ask(){
  if(R.k>=R.q.length)return result();
  var q=R.q[R.k];var h='<div class="play"><div class="qa">'+head();
  if(q.kind==='pos'){
    h+='<div class="q" tabindex="-1"><div class="w">'+esc(q.x.w)+sayBtn(q.x.w)+'</div><div class="pos">'+esc(q.x.th)+' · เป็นคำชนิดไหน</div></div><div class="buckets">';
    ['n','v','adj','adv'].forEach(function(k){h+='<button type="button" class="opt" data-v="'+k+'"><b>'+POS[k][1]+'</b><small>'+POS[k][0]+'</small></button>'});h+='</div>';
  }else{
    h+='<div class="q" tabindex="-1">'+q.stem+'</div><div class="opts">';
    q.o.forEach(function(t,j){h+='<button type="button" class="opt" data-j="'+j+'"><span class="k">'+'ABCD'[j]+'</span><span>'+esc(t)+'</span></button>'});h+='</div>';
  }
  h+='</div>'+coachHTML()+'</div>';
  render(h);qFocus();
  [].forEach.call(view.querySelectorAll('[data-say]'),function(b){b.addEventListener('click',function(e){e.stopPropagation();say(b.dataset.say)})});
  [].forEach.call(view.querySelectorAll('.opt'),function(b){b.addEventListener('click',function(){answer(b)})});
}
function answer(b){
  if(Date.now()-swapAt<300||$('fb').classList.contains('on'))return;
  var q=R.q[R.k],right,correctEl;
  if(q.kind==='pos'){right=b.dataset.v===q.x.p;correctEl=view.querySelector('[data-v="'+q.x.p+'"]')}
  else{right=+b.dataset.j===q.a;correctEl=view.querySelector('[data-j="'+q.a+'"]')}
  [].forEach.call(view.querySelectorAll('.opt'),function(x){x.disabled=true});
  var key=q.key||(q.key='q'+R.k+'_'+Math.random());
  var firstTime=!(key in R.firstTry);
  if(right){b.classList.add('ok');if(q.x)S.got[q.x.w]=1;if(firstTime)R.firstTry[key]=1;R.combo++;S.xp+=10+(R.combo>=3?5:0);
    if(q.kind==='pos')say(q.x.w);
    coach('good');
    fb(true,rnd(['เยี่ยม!','ถูกต้อง!','สุดยอด!','ใช่เลย!']),(R.combo>=3?'ต่อเนื่อง '+R.combo+' ข้อ +5 โบนัส':''),q.kind==='pos'?'<b>'+esc(q.x.w)+'</b> เป็น '+POS[q.x.p][1]+' ('+POS[q.x.p][0]+')':null);
  }else{b.classList.add('no');correctEl.classList.add('ok');if(firstTime)R.firstTry[key]=0;R.combo=0;
    if(q.x)R.miss[q.x.w]=q.x.th;
    R.q.push(q);
    coach('bad');
    fb(false,'ไม่เป็นไร ข้อนี้จะวนกลับมาอีกครั้ง','คำตอบคือ “'+(q.kind==='pos'?POS[q.x.p][1]:q.o[q.a])+'”',q.kind==='pos'?'<b>'+esc(q.x.w)+'</b> เป็น '+POS[q.x.p][1]+' ('+POS[q.x.p][0]+')':q.tip);
  }
  chips();
}
function fb(good,h,p,tip){var f=$('fb');f.className='fb on '+(good?'good':'bad');swapAt=Date.now();announce(h+(p?' '+p:''));
  var a=good?'joe_phone':rnd(['girl_conf','boy_conf']),fa=$('fba');fa.src=IMG[a].src;fa.width=IMG[a].w;fa.height=IMG[a].h;fa.style.animation='none';void fa.offsetWidth;fa.style.animation='';
  $('fbh').innerHTML=ic(good?'check':'x')+'<span>'+esc(h)+'</span>';$('fbp').textContent=p||'';$('fbp').hidden=!p;
  var t=$('fbt');if(tip){t.innerHTML=ic('bulb')+'<span>'+tip+'</span>';t.hidden=false}else t.hidden=true;
  $('fbn').onclick=function(){if(!$('fb').classList.contains('on')||Date.now()-swapAt<300)return;closeFb();R.k++;ask()};later(function(){if($('fb').classList.contains('on'))focusEl($('fbn'))},50)} // กดเบิ้ล/Enter ซ้ำ ไม่ข้ามข้อ
function closeFb(){$('fb').className='fb'}

/* ---------- ด่านจับคู่ ---------- */
function matchStage(i){
  var s=STAGES[i],rounds=[],MW=W.filter(function(x){return thKey(x.th)}),ws=shuf(MW.length>=2?MW:W);
  for(var r=0;r<ws.length;r+=5)rounds.push(ws.slice(r,r+5));
  if(rounds.length>1&&rounds[rounds.length-1].length<3){var tail=rounds.pop();rounds[rounds.length-1]=rounds[rounds.length-1].concat(tail)}
  var N=rounds.length,M={i:i,r:0,err:0,sel:null,left:0};
  function draw(){
    var set=rounds[M.r],L=shuf(set),Rr=shuf(set);M.left=set.length;
    var h='<div class="play"><div class="qa"><div class="prog"><div class="pb"><b style="width:'+Math.round(M.r/N*100)+'%"></b></div><span class="cnt">รอบ '+(M.r+1)+'/'+N+'</span><span class="combo"></span></div><p class="stage-t">ด่าน 1 · '+s.t+'</p>'+howBox('s1')+'<p class="q" tabindex="-1" style="font-size:17px;font-weight:500">แตะคำศัพท์ แล้วแตะความหมายที่คู่กัน</p><div class="match"><div class="col">';
    L.forEach(function(x){h+='<button type="button" class="tile en" aria-pressed="false" data-w="'+esc(x.w)+'">'+esc(x.w)+'</button>'});h+='</div><div class="col">';
    Rr.forEach(function(x){h+='<button type="button" class="tile th" aria-pressed="false" data-w="'+esc(x.w)+'" data-th="'+esc(thKey(x.th))+'">'+esc(x.th)+'</button>'});h+='</div></div></div>'+coachHTML()+'</div>';
    inStage();render(h);qFocus();
    [].forEach.call(view.querySelectorAll('.tile'),function(t){t.addEventListener('click',function(){tap(t)})});
  }
  function pick1(t,on){t.classList.toggle('sel',on);t.setAttribute('aria-pressed',on?'true':'false')}
  function thOf(w){for(var j=0;j<W.length;j++)if(W[j].w===w)return thKey(W[j].th);return ''}
  function tap(t){
    if(t.classList.contains('ok')||Date.now()-swapAt<300)return;
    if(!M.sel||M.sel.classList.contains(t.classList.contains('en')?'en':'th')){
      if(M.sel)pick1(M.sel,false);M.sel=t;pick1(t,true);if(t.classList.contains('en'))say(t.dataset.w);return}
    var a=M.sel,b=t;M.sel=null;pick1(a,false);
    var en=a.classList.contains('en')?a:b,th=en===a?b:a;
    // คำแปลเหมือนกัน 2 คำในรอบเดียวกัน (เช่น comprise/consist = ประกอบด้วย) แตะการ์ดไหนก็ถูก
    if(en.dataset.w!==th.dataset.w&&th.dataset.th&&th.dataset.th===thOf(en.dataset.w)){var tw=en.dataset.w,other=view.querySelector('.tile.th:not(.ok)[data-w="'+th.dataset.w.replace(/"/g,'\\"')+'"]'),mine=view.querySelector('.tile.th:not(.ok)[data-w="'+tw.replace(/"/g,'\\"')+'"]');
      if(mine&&other&&mine!==th){mine.dataset.w=th.dataset.w;th.dataset.w=tw}}
    if(a.dataset.w===b.dataset.w){a.classList.add('ok');S.got[a.dataset.w]=1;b.classList.add('ok');announce('ถูกต้อง '+en.dataset.w+' = '+th.textContent);S.xp+=5;chips();M.left--;coach('good');
      if(!M.left){M.r++;if(M.r<N)later(draw,350);else later(function(){var n=ws.length;R={i:i,s:s,total:n,firstTry:{},miss:{}};for(var k=0;k<n;k++)R.firstTry['m'+k]=k>=M.err?1:0;result()},350)}}
    else{M.err++;coach('bad');announce('ยังไม่ใช่ ลองใหม่');[a,b].forEach(function(x){x.classList.add('no');later(function(){x.classList.remove('no')},400)})}
  }
  draw();
}

/* ---------- ผลลัพธ์ ---------- */
function result(){
  closeFb();
  var vals=Object.keys(R.firstTry).map(function(k){return R.firstTry[k]});var ok=vals.filter(Boolean).length,n=vals.length||1,acc=ok/n;
  var st=acc>=1?3:acc>=.8?2:acc>=.6?1:0;var prev=S.stars[R.s.id]||0;if(st>prev)S.stars[R.s.id]=st;
  if(st)S.xp+=20*st;chips();syncSets();save();
  var kept=prev>st; // เล่นซ้ำแล้วได้น้อยกว่าเดิม: ดาวเดิมยังอยู่ (เก็บค่าสูงสุดเสมอ)
  var art=(R.s.boss&&st)?'<div class="res-art scene">'+img('ring','','นักเรียนชนะ TEST บนเวทีมวย ครูโจชูนิ้วโป้ง')+'</div>'
     :'<div class="res-art">'+img(st===3?'joe_phone':st?'joe_arms':rnd(['girl_conf','boy_conf']),'','')+'</div>';
  var h='<section class="res">'+art+'<div class="big" role="img" aria-label="รอบนี้ได้ '+st+' จาก 3 ดาว">';for(var i=0;i<3;i++)h+='<span class="'+(i<st?'on':'')+'">'+ic('star',1)+'</span>';h+='</div>';
  h+='<h2 tabindex="-1">'+(st===3?'ไร้ที่ติ!':kept?'รอบนี้พลาดไปหน่อย':st===2?'เก่งมาก!':st===1?'ผ่านด่านแล้ว!':'เกือบแล้ว ลองอีกรอบนะ')+'</h2><p>ตอบถูกตั้งแต่ครั้งแรก '+ok+'/'+n+' ข้อ'+(kept?' · ดาวเดิม '+prev+' ดวงยังอยู่ครับ':'')+'</p>';
  h+='<div class="gain"><span class="chip st">'+ic('star',1)+' +'+Math.max(0,st-prev)+'</span><span class="chip xp">'+ic('bolt',1)+' +'+(20*st)+'</span></div>';
  var miss=Object.keys(R.miss||{});if(miss.length){h+='<div class="miss"><b>คำที่ยังพลาด ทวนอีกนิด</b><ul>'+miss.map(function(w){return '<li><b>'+esc(w)+'</b> · '+esc(R.miss[w])+'</li>'}).join('')+'</ul></div>'}
  var hasNextSet=!DEMO&&SETS&&SETS[SET.no];
  if(R.s.boss&&st)h+='<div class="badge-pop">'+ic('medal')+'<span>ได้ตรา “ผ่านชุดที่ '+SET.no+'”'+(DEMO?' · ในแอปจริงมีชุดต่อไปรอให้ฝึกต่อ':hasNextSet?' · ชุดที่ '+(SET.no+1)+' เปิดแล้ว':(SET.no>=SET.total?' · ครบทุกชุดแล้ว สุดยอดมาก!':''))+'</span></div>';
  if(DEMO&&R.s.boss)h+=lineHTML();
  var ni=nextStage(R.i),nxt=ni>=0&&unlocked(ni),goSet=R.s.boss&&(st||prev)&&hasNextSet;
  h+='<div class="acts">'+(nxt?'<button class="btn" id="go2" type="button">ไปด่านต่อไป '+ic('next')+'</button>':'')+(goSet?'<button class="btn" id="goset" type="button">ไปชุดที่ '+(SET.no+1)+' '+ic('next')+'</button>':'')+'<button class="btn ghost" id="again" type="button">'+(Math.max(st,prev)===3?'เล่นอีกรอบ':'ลองอีกรอบเพื่อเก็บดาว')+'</button><button class="btn ghost" id="tomap" type="button">กลับแผนที่ด่าน</button></div></section>';
  render(h);window.scrollTo(0,0);if(st)confetti(st);focusEl(view.querySelector('.res h2'));authCheck();
  var RI=R.i;if(nxt)$('go2').onclick=function(){start(ni)};if(goSet)$('goset').onclick=function(){pickSet(SET.no+1)};$('again').onclick=function(){start(RI)};$('tomap').onclick=map;
}
function confetti(n){if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;var c=$('conf'),cols=['#D1417D','#FF7ABD','#F2AE1C','#0E1A3A','#157A43'];for(var i=0;i<18*n;i++){var e=document.createElement('i');e.style.left=Math.random()*100+'%';e.style.background=cols[i%cols.length];e.style.animationDelay=Math.random()*.4+'s';c.appendChild(e)}later(function(){c.innerHTML=''},2200)}

/* ---------- ต่อสาย ---------- */
$('logo').src=IMG.logo.src;$('yr').textContent=new Date().getFullYear();$('ver').textContent='v'+VERSION;
on($('back'),'click',map);
on($('help'),'click',openMan);on($('manx'),'click',closeMan);
on($('man'),'click',function(e){if(e.target===this)closeMan()});
on(document,'keydown',function(e){var m=$('man');if(m.hidden)return;if(e.key==='Escape'){e.stopImmediatePropagation();closeMan();return}
  if(e.key==='Tab'){var f=[].slice.call(m.querySelectorAll('button:not([aria-disabled]),a[href],summary,[tabindex]:not([tabindex="-1"])')),a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}},true);
on(document,'keydown',function(e){if(e.key!=='Escape'||$('back').hidden||!$('man').hidden||T.on)return;
  if($('fb').classList.contains('on')||document.querySelector('.modal.show'))return; // Esc ตอนดูเฉลย/ตอนเปิดหน้าต่าง How to Use ไม่ทิ้งด่านที่เล่นอยู่
  map()});
// ลิงก์ "ข้ามไปเนื้อหา" (คีย์บอร์ด/โปรแกรมอ่านหน้าจอ): ย้ายโฟกัสไปที่เนื้อหาเฉยๆ ไม่เปลี่ยน URL (ไม่หลุดออกจากด่าน)
on($('skip'),'click',function(e){e.preventDefault();focusEl(view)});
// ปุ่ม Back ระหว่างเล่น → กลับแผนที่ด่าน
on(window,'popstate',function(){if(ignorePop>0){ignorePop--;return}if(pushed&&!(history.state&&history.state.lpStage)){pushed=false;if(T.on)endTour();closeMan();map()}});
// ยังมีผลที่รอบันทึก → เตือนก่อนปิด/รีเฟรชหน้า (ผลเก็บไว้ในเครื่องแล้ว เปิดครั้งหน้าระบบส่งต่อให้เอง)
on(window,'beforeunload',function(e){if(!DEMO&&!qIdle()){e.preventDefault();e.returnValue=''}});
$('tnext').onclick=function(){if(TOUR[T.i].last){endTour();start(0);return}T.i++;showStep()};
$('tprev').onclick=function(){if(T.i>0){T.i--;showStep()}};
$('tskip').onclick=endTour;
on(window,'resize',function(){if(T.on)placeTour()});on(window,'scroll',function(){if(T.on)placeTour()},{passive:true});
on(document,'keydown',function(e){if(!T.on)return;if(e.key==='Escape'){e.stopImmediatePropagation();endTour();return}
  if(e.key==='ArrowRight'){$('tnext').click()}if(e.key==='ArrowLeft'){$('tprev').click()}
  if(e.key==='Tab'){var f=[].slice.call($('ttip').querySelectorAll('button')).filter(function(b){return !b.hidden}),a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}},true);

// แอปจริง: ต่อคิวบันทึกผลของผู้ใช้คนนี้ (รวมผลที่ค้างในเครื่องจากครั้งก่อน)
if(!DEMO){qUse(cfg.storeKey||'',typeof cfg.onSave==='function'?cfg.onSave:null);Q.ui=onQueue}
useSet(cfg.set||{no:1,total:1,label:'',words:[],form:[]},cfg.progress);
if(!W.length){view.innerHTML='<section class="res"><h2>ยังไม่มีคำศัพท์สำหรับคอร์สนี้</h2><p>ติดต่อแอดมินได้เลยครับ</p></section>'}
else{map();if(cfg.autoTour)later(startTour,400)}
if(!DEMO)qPump();

var api={version:VERSION,
 // ให้ host (Next.js) รู้ว่า popstate ครั้งนี้เกมจัดการเอง (ไม่ต้องเปลี่ยนหน้า)
 ownsPop:function(){return !dead&&(pushed||ignorePop>0)},
 // มีผลที่ยังส่งไม่สำเร็จไหม · ส่งทันที (host เรียกก่อนเปลี่ยนหน้า · คิวส่งต่อเองเบื้องหลังแม้ออกจากหน้านี้แล้ว)
 pending:function(){return !qIdle()},
 flush:function(){qFlush()},
 // อยู่ในด่าน (มี history entry ของด่านอยู่) · host ใช้ตอนกดเมนูอื่นระหว่างเล่น: แทนที่ entry นั้นแทนการเพิ่มใหม่ (Back ครั้งเดียวกลับมา)
 inStage:function(){return !dead&&pushed},
 dropStage:function(){pushed=false},
 destroy:function(){
  if(dead)return;dead=true;T.on=false;offs.forEach(function(f){f()});timers.forEach(clearTimeout);
  if(Q.ui===onQueue)Q.ui=null;
  try{speechSynthesis.cancel()}catch(e){}document.body.style.overflow='';if(host.parentNode)host.parentNode.removeChild(host);if(live===api)live=null}};
live=api;
return api;
}
window.LetsPractice={mount:mount,version:VERSION,flushStored:flushStored};
})();
