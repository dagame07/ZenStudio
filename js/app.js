/* app.js · tema, enrutamiento con guardas por rol y manejo de eventos. */
const $=id=>document.getElementById(id);
let loginErr='';
// ---- tema claro/oscuro: sistema por defecto, botón para forzar (el <head> de index.html aplica la clase .dark antes del primer pintado) ----
const mq=window.matchMedia('(prefers-color-scheme: dark)');
function applyTheme(){let t=null;try{t=localStorage.getItem('zen_theme')}catch(e){}document.documentElement.classList.toggle('dark',(t||(mq.matches?'dark':'light'))==='dark')}
function toggleTheme(){const n=document.documentElement.classList.contains('dark')?'light':'dark';try{localStorage.setItem('zen_theme',n)}catch(e){}applyTheme();render()}
mq.addEventListener&&mq.addEventListener('change',()=>{applyTheme();render()});applyTheme();
function toast(m){const t=$('toast');t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',3000)}
// ---- rutas (hash plano). Alumna jamás llega a admin-*; admin no usa las rutas de alumna ----
const ROUTES={admin:['admin-calendar','admin-students','admin-notes'],alumna:['card','calendar','notes']};
function go(h){if(location.hash==='#'+h)render();else location.hash=h}
function render(){const s=Zen.session(),h=location.hash.slice(1),app=$('app');
 if(!s){if(h!=='login')return go('login');app.innerHTML=V.login(loginErr);return}
 const ok=ROUTES[s.role];if(!ok.includes(h))return go(ok[0]);
 if(h==='notes'||h==='admin-notes'){Zen.markRead()}
 const body={'card':()=>V.card(s.sid,false),'calendar':()=>V.calendar(s),'notes':()=>V.notes(s),
  'admin-calendar':()=>V.calendar(s),'admin-students':()=>V.students(),'admin-notes':()=>V.notes(s)}[h]();
 app.innerHTML=V.shell(s,h,body)}
window.addEventListener('hashchange',render);
window.addEventListener('zen:change',render);                       // reactividad en la misma pestaña
window.addEventListener('storage',e=>{if(/^zen_/.test(e.key||'')){Zen.reload();render()}}); // y entre pestañas/cuentas abiertas
document.addEventListener('submit',e=>{if(e.target.id!=='lf')return;e.preventDefault();const f=new FormData(e.target);
 if(Zen.login(f.get('email'),f.get('pass'))){loginErr='';go(ROUTES[Zen.session().role][0])}else{loginErr='Correo o contraseña incorrectos';render()}});
document.addEventListener('change',e=>{if(e.target.dataset.c==='inst'){try{Zen.setInst(e.target.dataset.v,e.target.value);toast('Instructora actualizada; alumnas avisadas')}catch(x){toast(x.message);render()}}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,v=b.dataset.v||'',[x,y]=v.split('|'),u=V.ui,val=id=>$(id)&&$(id).value;
 try{switch(a){
  case'logout':Zen.logout();return go('login');
  case'theme':return toggleTheme();
  case'go':return go(v);
  case'day':u.day=v;return render();
  case'mo':u.m=new Date(u.m.getFullYear(),u.m.getMonth()+ +v,1);return render();
  case'open':u.sel=v;return render();
  case'cxask':u.cx=v;u.why=val('rs'+v);return render();
  case'cxno':u.cx=null;return render();
  case'rsopen':u.rs=u.rs===+v?null:+v;return render();
  case'rsno':u.rs=null;return render();
  case'rsok':toast(Zen.reschedule(+v,val('rr'+v)));u.rs=null;break;
  case'res':toast(Zen.reserve(v));break;
  case'rel':Zen.cancelMine(v);toast('Listo');break;
  case'dismiss':Zen.dismiss(+v);break;
  // --- solo administradora (store.js lo vuelve a validar) ---
  case'stp':Zen.stamp(x,y);toast('Sello registrado');break;
  case'adrel':Zen.adminLeave(x,y);break;
  case'cap':Zen.setCap(x,+y);break;
  case'adres':if(val('ad'+v))toast(Zen.adminEnroll(v,val('ad'+v)));break;
  case'cxok':{const n=Zen.cancelClass(v,u.why);u.cx=null;toast('Clase cancelada: '+n+' alumnas avisadas');break}
  case'plus':Zen.manualStamp(v,1);break;
  case'minus':Zen.manualStamp(v,-1);break;
  case'renew':Zen.renew(v);toast('Nuevo paquete de 10 clases');break;
  case'addst':Zen.addStudent(val('nn').trim());break;
  case'addcls':Zen.addClass(val('nd'),val('nh'),val('ntp'),val('ni'));toast('Clase agregada');break;
  case'send':Zen.sendNote(val('nt'),val('nx').trim());toast('Aviso enviado');break;
 }}catch(err){toast(err.message)}});
render();
