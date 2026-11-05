/* Koleshwar Tour and Travels: small, dependency-free behaviour. */
(function(){
var PHONE='917744073607';
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var hdr=$('#hdr'),nav=$('#nav'),menu=$('#menu'),bg=$('#heroBg');
/* sticky header + hero parallax */
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches,tick=false;
function onScroll(){hdr.classList.toggle('is-solid',window.scrollY>40);if(!reduce&&bg&&window.scrollY<window.innerHeight*1.2){bg.style.transform='translate3d(0,'+(window.scrollY*0.18)+'px,0)'}tick=false}
window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
/* mobile menu */
function setMenu(o){nav.classList.toggle('open',o);menu.setAttribute('aria-expanded',o);menu.setAttribute('aria-label',o?'Close menu':'Open menu');hdr.classList.toggle('is-solid',o||window.scrollY>40)}
menu.addEventListener('click',function(){setMenu(!nav.classList.contains('open'))});
nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
/* marquee: duplicate content for a seamless loop */
var mq=$('#mq');if(mq){mq.innerHTML+=mq.innerHTML}
/* reveal on scroll */
var rv=$$('.rv');
if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});rv.forEach(function(el,i){el.style.transitionDelay=(i%3)*70+'ms';io.observe(el)})}else{rv.forEach(function(el){el.classList.add('in')})}
/* region filter */
$$('#chips .chip').forEach(function(c){c.addEventListener('click',function(){$$('#chips .chip').forEach(function(x){x.setAttribute('aria-pressed',x===c)});var f=c.dataset.f;$('#grid').classList.toggle('flt',f!=='all');$$('#grid .card').forEach(function(k){var show=f==='all'||k.dataset.reg.split(' ').indexOf(f)>-1;k.classList.toggle('hide',!show);if(show)k.classList.add('in')})})});
/* dates: no past dates */
var today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());var iso=today.toISOString().slice(0,10);
$$('input[type=date]').forEach(function(d){d.min=iso});
$('#yr').textContent=new Date().getFullYear();
/* helpers */
var eTo=$('#eTo'),ePpl=$('#ePpl'),eDate=$('#eDate'),eAc=$('#eAc'),eNote=$('#eNote'),eName=$('#eName');
function setSel(sel,val){if(!val)return;var ok=Array.prototype.some.call(sel.options,function(o){if(o.value===val||o.text===val){sel.value=o.value;return true}});return ok}
function goEnquiry(){var t=$('#enquire');t.scrollIntoView({behavior:reduce?'auto':'smooth'});setTimeout(function(){eName.focus({preventScroll:true})},reduce?0:700)}
/* destination card -> prefill enquiry */
$$('#grid .card').forEach(function(c){c.addEventListener('click',function(){setSel(eTo,c.dataset.dest);goEnquiry()})});
/* route buttons -> notes */
$$('[data-route]').forEach(function(a){a.addEventListener('click',function(){var r=a.dataset.route;eNote.value=(eNote.value?eNote.value+'\n':'')+'Interested in: '+r+' (suggested route).'})});
/* hero search -> prefill + scroll */
$('#search').addEventListener('submit',function(e){e.preventDefault();setSel(eTo,$('#sWhere').value);if($('#sPpl').value)ePpl.value=Math.min(50,Math.max(1,parseInt($('#sPpl').value,10)||1));if($('#sDate').value)eDate.value=$('#sDate').value;setSel($('#eVeh'),$('#sAc').value);goEnquiry()});
/* enquiry validation + WhatsApp hand-off */
var form=$('#enq'),ok=$('#ok'),okLink=$('#okLink');
function bad(el,msg){var f=el.closest('.fld');f.classList.add('bad');f.querySelector('.err').textContent=msg;el.setAttribute('aria-invalid','true')}
function clear(){$$('.fld',form).forEach(function(f){f.classList.remove('bad');var e=f.querySelector('.err');if(e)e.textContent=''});$$('[aria-invalid]',form).forEach(function(i){i.removeAttribute('aria-invalid')})}
form.addEventListener('submit',function(e){
 e.preventDefault();clear();var first=null,v={};
 function chk(c,el,m){if(!c){bad(el,m);first=first||el}}
 v.name=eName.value.trim();chk(v.name.length>=2,eName,'Please enter your name');
 var ph=$('#ePhone').value.replace(/[\s\-]/g,'').replace(/^(\+?91|0)/,'');v.phone=ph;chk(/^[6-9]\d{9}$/.test(ph),$('#ePhone'),'Enter a valid 10-digit mobile number');
 v.from=$('#eFrom').value.trim();chk(v.from.length>=2,$('#eFrom'),'Where should we pick you up?');
 v.to=eTo.value;chk(!!v.to,eTo,'Choose a destination');
 v.date=eDate.value;chk(!!v.date&&v.date>=iso,eDate,'Choose a travel date');
 v.ppl=parseInt(ePpl.value,10);chk(v.ppl>=1&&v.ppl<=50,ePpl,'Between 1 and 50 people');
 if(first){first.focus();return}
 var d=v.date.split('-').reverse().join('-');
 var lines=['Hello Koleshwar Tour and Travels, I would like a quote.','Name: '+v.name,'Mobile: '+v.phone,'Pick-up city: '+v.from,'Destination: '+v.to,'Travel date: '+d,'People: '+v.ppl,'Vehicle: '+$('#eVeh').value+' ('+eAc.value+')'];
 if($('#eDays').value)lines.push('Days: '+$('#eDays').value);if(eNote.value.trim())lines.push('Notes: '+eNote.value.trim());
 var url='https://wa.me/'+PHONE+'?text='+encodeURIComponent(lines.join('\n'));
 okLink.href=url;ok.classList.add('show');ok.scrollIntoView({block:'nearest'});
 window.open(url,'_blank','noopener');
});
$$('input,select',form).forEach(function(i){i.addEventListener('input',function(){var f=i.closest('.fld');if(f&&f.classList.contains('bad')){f.classList.remove('bad');f.querySelector('.err').textContent='';i.removeAttribute('aria-invalid')}})});
})();
