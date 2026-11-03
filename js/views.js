/* views.js · plantillas HTML por vista. Los botones de administración SOLO se generan si rol === 'admin'
   (la autorización real se valida otra vez en store.js). */
const V=(()=>{
 const Z=Zen,pad=n=>String(n).padStart(2,'0'),N=new Date();
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const fd=s=>new Date(s+'T12:00').toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'}).replace(',','');
 const ui={m:new Date(N.getFullYear(),N.getMonth(),1),day:Z.TODAY,sel:null,cx:null,why:'instructora enferma'};
 const nm=id=>Z.st(id)?esc(Z.st(id).name):'?';
 const login=err=>`<main class="login"><div class="card"><h1>🪷 ZenStudio</h1><p class="mu">Inicia sesión para continuar</p>
  <form id="lf"><label>Correo<input name="email" type="email" required autocomplete="username"></label>
  <label>Contraseña<input name="pass" type="password" required autocomplete="current-password"></label>
  ${err?`<p class="err">${esc(err)}</p>`:''}<button class="p" type="submit">Entrar</button></form>
  <p class="mu">Pruebas: admin@zenstudio.com / admin123 · alumna@zenstudio.com / alumna123</p></div></main>`;
 function shell(s,tab,body){const adm=s.role==='admin',u=Z.unread();
  const tabs=adm?[['admin-calendar','Calendario'],['admin-students','Alumnas y paquetes'],['admin-notes','Avisos']]:[['card','Mi tarjeta'],['calendar','Calendario'],['notes','Avisos'+(u?' ('+u+')':'')]];
  const ban=Z.pending().map(n=>`<div class="banner">⚠️ <b>${adm?'Aviso':'Clase cancelada · Favor de reagendar'}</b><br>${esc(n.text)}
   <div class="row"><span></span><span>${adm?'':'<button class="k s" data-a="go" data-v="calendar">Reagendar</button> '}<button class="s" data-a="dismiss" data-v="${n.id}">Entendido</button></span></div></div>`).join('');
  return `<div class="w"><nav><h1>🪷 ZenStudio</h1><span class="row"><span class="mu">${esc(s.name)} · ${adm?'Administradora':'Alumna'}</span>
   <button class="s" data-a="theme" aria-label="Cambiar modo claro u oscuro">🌓 Modo</button><button class="s" data-a="logout">Salir</button></span></nav>
   <div class="tabs">${tabs.map(t=>`<button class="${tab===t[0]?'on':''}" data-a="go" data-v="${t[0]}">${t[1]}</button>`).join('')}</div>${ban}${body}</div>`}
 function card(sid,adm){const s=Z.st(sid),r=Z.reserved(sid).map(c=>c.date).sort(),u=s.stamps.length;let h='';
  for(let i=0;i<10;i++){const a=i<u?'st':i<u+r.length?'rs':'';
   h+=`<div class="sp ${a}"><i>${i+1}</i>${a==='st'?`<span>🪷</span>${fd(s.stamps[i])}`:a==='rs'?`apartada<br>${fd(r[i-u])}`:''}</div>`}
  return `<div class="card"><h2>${adm?esc(s.name):'Mi tarjeta'} · Paquete ${s.pkgs}</h2><div class="paper"><div class="stamps">${h}</div></div>
  <p><b>${u}</b> clases tomadas · <b>${10-u}</b> faltantes${r.length?` · ${r.length} apartadas`:''}</p>
  ${u>=10?'<p class="err">Paquete completo: las reservas están bloqueadas hasta renovar.</p>':''}
  ${adm?`<div class="row"><span><button class="s" data-a="plus" data-v="${sid}">+ Sello</button> <button class="s" data-a="minus" data-v="${sid}">− Sello</button></span><button class="k s" data-a="renew" data-v="${sid}">Renovar paquete</button></div>`
  :'<p class="mu">Solo lectura: los sellos los registra Andrea al tomar tu clase.</p>'}</div>`}
 function students(){const S=Z.data();return `<div class="card"><h2>Nueva alumna</h2><div class="row"><input id="nn" placeholder="Nombre completo" style="flex:1"><button class="p" data-a="addst">Agregar</button></div></div>
  <div class="card"><h2>Alumnas (${S.students.length})</h2>${S.students.map(s=>`<div class="row" style="border-bottom:1px solid var(--bd)"><span>${esc(s.name)}</span>
  <span class="mu">${s.stamps.length}/10${s.stamps.length>=10?' · <b class="err">renovar</b>':''}</span>
  <span><button class="s" data-a="open" data-v="${s.id}">Ver tarjeta</button> <button class="s" data-a="plus" data-v="${s.id}">+ Sello</button></span></div>`).join('')}</div>${ui.sel?card(ui.sel,true):''}`}
 function notes(s){const adm=s.role==='admin',ups=Z.data().classes.filter(c=>c.date>=Z.TODAY&&c.st==='ok').slice(0,40);
  const f=adm?`<div class="card"><h2>Enviar aviso</h2><select id="nt" style="width:100%;margin-bottom:6px"><option value="all">Todas las alumnas</option>${ups.map(c=>`<option value="${c.id}">Inscritas: ${Z.cdesc(c)} (${c.enr.length})</option>`).join('')}</select>
  <textarea id="nx" rows="3" style="width:100%" placeholder="Cambio de horario, clase especial, recordatorio…"></textarea><div class="row"><span class="mu">Avisa con tiempo para reagendar.</span><button class="p" data-a="send">Enviar</button></div></div>`:'';
  const l=Z.notesFor();return f+`<div class="card"><h2>${adm?'Historial de avisos':'Mis avisos'}</h2>${l.length?l.map(n=>`<div class="nt ${n.kind==='alert'?'u':''}"><div class="mu">${new Date(n.ts).toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short'})}</div>${n.kind==='alert'?'⚠️ ':''}${esc(n.text)}</div>`).join(''):'<p class="mu">Sin avisos.</p>'}</div>`}
 function calendar(s){const adm=s.role==='admin',S=Z.data(),m=ui.m,y=m.getFullYear(),mo=m.getMonth(),first=(new Date(y,mo,1).getDay()+6)%7,n=new Date(y,mo+1,0).getDate();
  let g=['L','M','M','J','V','S','D'].map(x=>`<div class="h">${x}</div>`).join('')+'<div></div>'.repeat(first);
  for(let d=1;d<=n;d++){const k=y+'-'+pad(mo+1)+'-'+pad(d),cs=S.classes.filter(c=>c.date===k);
   g+=`<div class="day ${k===ui.day?'sel':''} ${k===Z.TODAY?'td':''}" data-a="day" data-v="${k}"><b>${d}</b>${cs.map(c=>{const me=!adm&&(c.enr.includes(s.sid)||c.wait.includes(s.sid));
    return `<div class="chip"><span class="dot ${c.st==='cx'?'c':c.enr.length>=c.cap?'f':''} ${me?'m':''}"></span><em>${c.time} ${c.st==='cx'?'✕':c.enr.length+'/'+c.cap}</em></div>`}).join('')}</div>`}
  const cs=S.classes.filter(c=>c.date===ui.day);
  const add=adm?`<div class="card"><h2>Agregar clase</h2><div class="row"><input id="nd" type="date" value="${ui.day}"><input id="nh" type="time" value="18:30"><select id="ntp"><option value="t">Tarde (cupo 12)</option><option value="m">Mañana (cupo 15)</option></select>
   <select id="ni">${Z.INS.map(i=>`<option>${i}</option>`).join('')}</select><button class="p s" data-a="addcls">Agregar</button></div></div>`:'';
  return `<div class="card"><div class="row"><button data-a="mo" data-v="-1">‹</button><h2 style="margin:0;text-transform:capitalize">${m.toLocaleDateString('es-MX',{month:'long',year:'numeric'})}</h2><button data-a="mo" data-v="1">›</button></div>
  <div class="cal">${g}</div><p class="mu">● verde: hay lugar · ● rosa: llena (lista de espera) · gris: cancelada${adm?'':' · aro rosa: tu reserva'}</p></div>${add}
  <h2>${fd(ui.day)}</h2>${cs.length?cs.map(c=>cls(c,s)).join(''):'<div class="card mu">No hay clases este día.</div>'}`}
 function cls(c,s){const adm=s.role==='admin',f=c.enr.length>=c.cap,past=c.date<Z.TODAY,cx=c.st==='cx';let a='';
  if(cx)a='<span class="tag">Cancelada</span>';
  else if(!adm){const i=c.enr.includes(s.sid),w=c.wait.indexOf(s.sid);
   a=i?`<span class="tag">Inscrita ✓</span> ${past?'':`<button class="d s" data-a="rel" data-v="${c.id}">Cancelar mi lugar</button>`}`:
   w>=0?`<span class="tag">Lista de espera #${w+1}</span> <button class="d s" data-a="rel" data-v="${c.id}">Salir</button>`:
   past?'':`<button class="p s" data-a="res" data-v="${c.id}">${f?'Unirme a lista de espera':'Reservar'}</button>`}
  const L=(l,att)=>l.length?l.map(id=>`<div class="row"><span>${nm(id)}${c.att.includes(id)?' 🪷':''}</span>${adm&&!cx?`<span>${att&&!c.att.includes(id)?`<button class="s" data-a="stp" data-v="${c.id}|${id}">Sellar</button> `:''}<button class="d s" data-a="adrel" data-v="${c.id}|${id}">Quitar</button></span>`:''}</div>`).join(''):'<span class="mu">Nadie aún</span>';
  const ask=ui.cx===c.id?`<div class="banner">¿Cancelar la clase del ${Z.cdesc(c)}? Se avisará a ${c.enr.length+c.wait.length} alumnas para reagendar.<div class="row"><span></span><span><button class="s" data-a="cxno">Volver</button> <button class="d s" data-a="cxok" data-v="${c.id}">Confirmar cancelación</button></span></div></div>`:'';
  return `<div class="card"><div class="row"><div><b>${c.time}</b> · ${c.tp==='t'?'Tarde':'Mañana'} · ${adm?`<select data-c="inst" data-v="${c.id}">${Z.INS.map(i=>`<option ${i===c.inst?'selected':''}>${i}</option>`).join('')}</select>`:'con '+c.inst}</div><div>${a}</div></div>
  <div class="row"><span class="mu">Cupo ${c.enr.length}/${c.cap}${c.wait.length?' · '+c.wait.length+' en espera':''}</span>${adm&&!cx?`<span><button class="s" data-a="cap" data-v="${c.id}|-1">−</button> <button class="s" data-a="cap" data-v="${c.id}|1">+</button></span>`:''}</div>
  <div class="bar ${f?'f':''}"><div style="width:${Math.min(100,c.enr.length/c.cap*100)}%"></div></div>
  <div class="g2"><div><p class="mu" style="margin:8px 0 2px">Inscritas</p>${L(c.enr,true)}</div><div><p class="mu" style="margin:8px 0 2px">Lista de espera</p>${L(c.wait,false)}</div></div>
  ${adm&&!cx?`<div class="row" style="margin-top:6px"><span><select id="ad${c.id}"><option value="">+ Inscribir alumna…</option>${Z.data().students.filter(x=>!c.enr.includes(x.id)&&!c.wait.includes(x.id)).map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select> <button class="s" data-a="adres" data-v="${c.id}">Agregar</button></span>
  <span><select id="rs${c.id}"><option>instructora enferma</option><option>cambio de horario</option><option>causas de fuerza mayor</option></select> <button class="d s" data-a="cxask" data-v="${c.id}">Cancelar clase…</button></span></div>${ask}`:''}</div>`}
 return{ui,login,shell,card,students,notes,calendar};
})();
