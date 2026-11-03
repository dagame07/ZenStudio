/* store.js · datos (localStorage), sesión, permisos y reglas de negocio.
   TODA regla de permisos vive aquí (need('admin') / need('alumna')); las vistas solo ocultan botones. */
const Zen=(()=>{
 const KEY='zen_data_v2',SKEY='zen_session_v2',INS=['Mariana','Sofía','Lupita'],CAP_TARDE=12,CAP_MANANA=15,PKG=10;
 // Credenciales fijas de prueba (spec 2.A). Sustituir por backend real en producción.
 const USERS=[
  {email:'admin@zenstudio.com',pass:'admin123',role:'admin',name:'Andrea'},
  {email:'alumna@zenstudio.com',pass:'alumna123',role:'alumna',name:'Alumna Prueba',sid:'s0'}];
 const pad=n=>String(n).padStart(2,'0'),iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
 const T=new Date();T.setHours(12,0,0,0);const TODAY=iso(T);
 const rnd=n=>{n=Math.sin(n*9301+49297)*233280;return n-Math.floor(n)};
 function seed(){
  const names=['Alumna Prueba','Bruna Reyes','Carla Mena','Diana Ortiz','Elena Ruiz','Fer Salazar','Gaby Torres','Hilda Vega','Irma Soto','Julia Pérez','Karla Díaz','Laura Cruz','Mónica Gil','Nadia Franco'];
  const students=names.map((n,i)=>{const u=i===3?9:i===0?0:(i*3)%9,st=[];for(let j=0;j<u;j++){const d=new Date(T);d.setDate(T.getDate()-1-j*3);st.push(iso(d))}return{id:'s'+i,name:n,stamps:st.reverse(),pkgs:1}});
  const classes=[];let k=0,full=false;
  for(let o=-14;o<=75;o++){const d=new Date(T);d.setDate(T.getDate()+o);const w=d.getDay();if(!w)continue;
   (w===6?[['09:00','m']]:[['07:30','m'],['18:30','t']]).forEach(([t,tp])=>{k++;
    const cap=tp==='t'?CAP_TARDE:CAP_MANANA,c={id:'c'+k,date:iso(d),time:t,tp,cap,inst:INS[k%3],st:'ok',enr:[],wait:[],att:[]};
    if(o>=0){if(tp==='t'&&!full){full=true;c.enr=students.slice(0,12).map(s=>s.id);c.wait=['s12','s13']}
     else{const n=2+Math.floor(rnd(k)*cap*.6),r=k%13;for(let i=0;i<n;i++)c.enr.push('s'+(1+(r+i)%13))}}
    classes.push(c)})}
  return{students,classes,notes:[{id:1,ts:Date.now(),to:'all',kind:'info',readBy:[],text:'¡Bienvenidas a ZenStudio! Aquí verás tu tarjeta, el calendario y los avisos del estudio.'}],nid:2};
 }
 const persist=d=>{try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}};
 function load(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.classes)return d}catch(e){}const d=seed();persist(d);return d}
 let S=load();
 const save=()=>{persist(S);window.dispatchEvent(new Event('zen:change'))};
 const reload=()=>{S=load()};
 // ---- sesión ----
 const session=()=>{try{return JSON.parse(localStorage.getItem(SKEY))}catch(e){return null}};
 function login(email,pass){const u=USERS.find(x=>x.email===String(email).trim().toLowerCase()&&x.pass===pass);if(!u)return false;
  try{localStorage.setItem(SKEY,JSON.stringify({email:u.email,role:u.role,name:u.name,sid:u.sid||null}))}catch(e){return false}return true}
 const logout=()=>{try{localStorage.removeItem(SKEY)}catch(e){}};
 function need(role){const s=session();if(!s||s.role!==role)throw new Error('Acción no autorizada para tu cuenta');return s}
 // ---- consultas ----
 const st=id=>S.students.find(s=>s.id===id),cl=id=>S.classes.find(c=>c.id===id);
 const reserved=sid=>S.classes.filter(c=>c.date>=TODAY&&c.st==='ok'&&c.enr.includes(sid));
 const key=()=>{const s=session();return s?(s.role==='admin'?'admin':s.sid):null};
 const mine=n=>n.to==='all'||(Array.isArray(n.to)&&n.to.includes(key()));
 const notesFor=()=>session()&&session().role==='admin'?S.notes:S.notes.filter(mine);
 const pending=()=>S.notes.filter(n=>mine(n)&&n.kind==='alert'&&!n.readBy.includes(key()));
 const unread=()=>S.notes.filter(n=>mine(n)&&!n.readBy.includes(key())).length;
 const markRead=()=>{S.notes.forEach(n=>{if(mine(n)&&!n.readBy.includes(key()))n.readBy.push(key())});persist(S)}; // silencioso (sin re-render)
 const dismiss=id=>{const n=S.notes.find(x=>x.id===id);if(n&&mine(n)&&!n.readBy.includes(key()))n.readBy.push(key());save()};
 const notify=(to,text,kind,cid)=>S.notes.unshift({id:S.nid++,ts:Date.now(),to,text,kind:kind||'info',readBy:[],cid:cid||null,moved:{}});
 const cdesc=c=>new Date(c.date+'T12:00').toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'})+' '+c.time+' con '+c.inst;
 // ---- cupos y lista de espera (FIFO) ----
 function join(cid,sid){const c=cl(cid),s=st(sid);
  if(c.st!=='ok')throw new Error('La clase está cancelada');
  if(c.enr.includes(sid)||c.wait.includes(sid))throw new Error('Ya estás en esta clase');
  if(s.stamps.length>=PKG)throw new Error('Paquete Agotado (10/10 sellos): reservas bloqueadas hasta renovar');
  if(s.stamps.length+reserved(sid).length>=PKG)throw new Error('Ya apartaste todas las clases de tu paquete');
  if(c.enr.length<c.cap){c.enr.push(sid);return'Lugar reservado'}
  c.wait.push(sid);return'Clase llena: quedaste en lista de espera #'+c.wait.length}
 function fill(c){while(c.wait.length&&c.enr.length<c.cap){const p=c.wait.shift();if(st(p).stamps.length>=PKG)continue;c.enr.push(p);notify([p],'¡Se liberó un lugar! Ya estás inscrita en la clase del '+cdesc(c)+'.','ok')}}
 function leave(cid,sid){const c=cl(cid);c.enr=c.enr.filter(x=>x!==sid);c.wait=c.wait.filter(x=>x!==sid);fill(c)}
 function addStamp(s,from){if(s.stamps.length>=PKG)throw new Error('La tarjeta ya está completa: renueva el paquete');s.stamps.push(from);
  if(s.stamps.length>=PKG)notify(['admin'],'Paquete Agotado: la tarjeta de '+s.name+' llegó a 10/10 sellos. Hay que renovar su paquete.','alert')}
 // ---- acciones de ALUMNA (solo sobre su propia cuenta) ----
 const reserve=cid=>{const s=need('alumna'),m=join(cid,s.sid);save();return m};
 const cancelMine=cid=>{const s=need('alumna');leave(cid,s.sid);save()};
 // ---- reagendar en 1-clic: mueve a la alumna de una clase cancelada a otra con cupo; los sellos no se tocan ----
 const nowKey=()=>{const d=new Date();return iso(d)+' '+pad(d.getHours())+':'+pad(d.getMinutes())};
 const rescheduleNote=nid=>{const s=session(),n=S.notes.find(x=>x.id===nid);if(n&&!n.moved)n.moved={};const c=n&&n.cid?cl(n.cid):null;
  return s&&s.role==='alumna'&&n&&mine(n)&&c&&c.st==='cx'&&!(n.moved&&n.moved[s.sid])?{n,c,s}:null};
 function alternatives(nid){const r=rescheduleNote(nid);if(!r)return[];const lim=new Date(T);lim.setDate(T.getDate()+7);const to=iso(lim),now=nowKey(),sid=r.s.sid;
  const sc=c=>(c.tp===r.c.tp?0:2)+(c.inst===r.c.inst?0:1);
  return S.classes.filter(c=>c.st==='ok'&&c.enr.length<c.cap&&!c.enr.includes(sid)&&!c.wait.includes(sid)&&c.date+' '+c.time>now&&c.date<=to)
   .sort((a,b)=>sc(a)-sc(b)||(a.date+a.time).localeCompare(b.date+b.time))}
 function reschedule(nid,cid){const r=rescheduleNote(nid);if(!r)throw new Error('Esta clase ya no se puede reagendar');
  if(!alternatives(nid).some(x=>x.id===cid))throw new Error('Esa clase ya no tiene lugar disponible: elige otra');
  const c=cl(cid);join(cid,r.s.sid);r.n.moved[r.s.sid]=cid;if(!r.n.readBy.includes(r.s.sid))r.n.readBy.push(r.s.sid);save();return'Clase reagendada: '+cdesc(c)}
 // ---- acciones de ADMINISTRADORA ----
 const A=fn=>(...a)=>{need('admin');const r=fn(...a);save();return r};
 return{INS,TODAY,PKG,session,login,logout,reload,data:()=>S,st,cl,reserved,notesFor,pending,unread,markRead,dismiss,cdesc,reserve,cancelMine,canReschedule:nid=>!!rescheduleNote(nid),alternatives,reschedule,
  adminEnroll:A((cid,sid)=>join(cid,sid)),adminLeave:A((cid,sid)=>leave(cid,sid)),
  stamp:A((cid,sid)=>{const c=cl(cid);if(c.att.includes(sid))throw new Error('Ya tiene sello en esta clase');addStamp(st(sid),c.date);c.att.push(sid)}),
  manualStamp:A((sid,d)=>{const s=st(sid);if(d>0)addStamp(s,TODAY);else if(s.stamps.length){const last=s.stamps.pop();S.classes.forEach(c=>{if(c.date===last)c.att=c.att.filter(x=>x!==sid)})}}),
  renew:A(sid=>{const s=st(sid);s.stamps=[];s.pkgs++}),
  addStudent:A(n=>{if(n)S.students.push({id:'s'+Date.now(),name:n,stamps:[],pkgs:1})}),
  setCap:A((cid,d)=>{const c=cl(cid);c.cap=Math.max(1,c.cap+d);fill(c)}),
  setInst:A((cid,i)=>{const c=cl(cid),o=c.inst;c.inst=i;if(c.enr.length)notify(c.enr,'Cambio de instructora en la clase del '+cdesc(c)+' (antes '+o+').','alert')}),
  addClass:A((date,time,tp,inst)=>{if(!date||!time)throw new Error('Indica fecha y hora');S.classes.push({id:'c'+Date.now(),date,time,tp,cap:tp==='t'?CAP_TARDE:CAP_MANANA,inst,st:'ok',enr:[],wait:[],att:[]});S.classes.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))}),
  cancelClass:A((cid,why)=>{const c=cl(cid),to=[...c.enr,...c.wait];c.st='cx';
   if(to.length)notify(to,'Clase cancelada - Favor de reagendar: '+cdesc(c)+' ('+why+'). No se descuenta de tu paquete.','alert',c.id);c.enr=[];c.wait=[];return to.length}),
  sendNote:A((target,text)=>{if(!text)throw new Error('Escribe el mensaje');const c=target==='all'?null:cl(target);notify(c?[...c.enr,...c.wait]:'all',text,'info')})};
})();
