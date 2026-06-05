(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`http://localhost:3000`,t=`workspaceReservationSession`,n=`min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100`,r=`rounded-lg border border-slate-200 bg-white/95 shadow-sm dark:border-slate-800 dark:bg-slate-900/90`,i=`inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-300`,a=`inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-extrabold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800`;async function o(t,n={}){let r=await fetch(`${e}${t}`,{headers:{"Content-Type":`application/json`,...n.headers??{}},...n});if(!r.ok)throw Error(`Error HTTP ${r.status}`);if(r.status===204)return null;let i=await r.text();return i?JSON.parse(i):null}async function s(e,t){let n=e.trim().toLowerCase(),r=(await o(`/users?email=${encodeURIComponent(n)}`)).find(e=>e.email.toLowerCase()===n);if(!r||r.password!==t)throw Error(`Correo o contrasena incorrectos.`);let{password:i,...a}=r;return c(a),a}function c(e){localStorage.setItem(t,JSON.stringify(e)),localStorage.setItem(`user`,JSON.stringify(e))}function l(){let e=localStorage.getItem(t)??localStorage.getItem(`user`);if(!e)return null;try{return JSON.parse(e)}catch{return u(),null}}function u(){localStorage.removeItem(t),localStorage.removeItem(`user`),localStorage.removeItem(`theme`)}function d(e){let t=l();return e.requiresAuth&&!t?{allowed:!1,redirectTo:`#/login`}:e.adminOnly&&t?.role!==`admin`?{allowed:!1,denied:!0}:{allowed:!0}}function f(){return`
    <main class="${n} grid place-items-center p-6">
      <section class="${r} max-w-xl p-8 text-center">
        <div class="mx-auto mb-5 grid size-14 place-items-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200">
          <span class="text-2xl font-black">!</span>
        </div>
        <h1 class="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100">Acceso denegado</h1>
        <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Tu rol actual no tiene permisos para entrar a este modulo administrativo.
        </p>
        <div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#/home" class="${i}">Volver al dashboard</a>
          <a href="#/reservas" class="${a}">Ver mis reservas</a>
        </div>
      </section>
    </main>
  `}var p={shell:`min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100`,surface:`rounded-lg border border-slate-200 bg-white/95 shadow-sm dark:border-slate-800 dark:bg-slate-900/90`,primary:`inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-300`,secondary:`inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-extrabold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800`,ghost:`inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-extrabold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60`},m={pending:`Pendientes`,approved:`Aprobadas`,rejected:`Rechazadas`};function h(e,t=`home`){let n=l();return`
    <div class="${p.shell} flex">
      <aside class="hidden min-h-screen w-72 border-r border-slate-200 bg-slate-950 p-6 text-white md:block dark:border-slate-800">
        <div class="mb-8">
          <p class="text-xs font-bold uppercase tracking-widest text-teal-300">Workspace</p>
          <h1 class="mt-2 text-2xl font-black">Reservas</h1>
          <p class="mt-1 text-sm text-slate-400">${n.name}</p>
        </div>
        <nav class="space-y-2">
          <a href="#/home" class="block rounded-lg px-4 py-3 text-sm font-bold ${t===`home`?`bg-white text-slate-950`:`text-slate-300 hover:bg-slate-800`}">Dashboard</a>
          <a href="#/reservas" class="block rounded-lg px-4 py-3 text-sm font-bold ${t===`reservas`?`bg-white text-slate-950`:`text-slate-300 hover:bg-slate-800`}">Reservas</a>
          ${n.role===`admin`?`<a href="#/admin" class="block rounded-lg px-4 py-3 text-sm font-bold ${t===`admin`?`bg-white text-slate-950`:`text-slate-300 hover:bg-slate-800`}">Administracion</a>`:``}
        </nav>
        <div class="mt-8 border-t border-slate-800 pt-5">
          <p class="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Sesion</p>
          <button id="logoutButton" class="${p.ghost} w-full">Cerrar sesion</button>
        </div>
      </aside>
      <div class="min-w-0 flex-1">
        <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 md:px-8">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">${n.role===`admin`?`Administrador`:`Usuario estandar`}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">${n.email}</p>
            </div>
            <div class="flex gap-2">
              <button id="themeToggle" class="${p.secondary}" title="Cambiar tema">Tema</button>
              <button id="mobileLogoutButton" class="${p.secondary} md:hidden">Salir</button>
            </div>
          </div>
        </header>
        ${e}
      </div>
    </div>
  `}function g(){document.querySelectorAll(`#logoutButton, #mobileLogoutButton`).forEach(e=>{e.addEventListener(`click`,()=>{u(),Q(`#/login`)})}),document.getElementById(`themeToggle`)?.addEventListener(`click`,()=>{let e=document.documentElement.classList.toggle(`dark`);localStorage.setItem(`theme`,e?`dark`:`light`)})}var _={amber:`text-amber-700 dark:text-amber-300`,emerald:`text-emerald-700 dark:text-emerald-300`,rose:`text-rose-700 dark:text-rose-300`};function v(e,t,n,r){return`
    <article class="${p.surface} p-5">
      <p class="text-sm font-bold text-slate-500 dark:text-slate-400">${e}</p>
      <strong class="mt-3 block text-4xl font-black text-slate-950 dark:text-slate-100">${t}</strong>
      <p class="mt-2 text-sm ${_[r]}">${n}</p>
    </article>
  `}async function y(){let e=l(),t=(await o(e.role===`admin`?`/reservas`:`/reservas?userId=${e.id}`)).reduce((e,t)=>({...e,[t.estado]:e[t.estado]+1}),{pending:0,approved:0,rejected:0}),n=e.role===`admin`?`
        <a href="#/admin" class="${p.surface} group p-5 transition hover:-translate-y-0.5 hover:border-teal-500">
          <p class="text-sm font-bold text-slate-500 dark:text-slate-400">Revision administrativa</p>
          <h3 class="mt-3 text-xl font-black text-slate-950 dark:text-white">Aprobar o rechazar reservas</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Gestiona todas las solicitudes del sistema con permisos completos de edicion y eliminacion.</p>
        </a>
      `:`
        <a href="#/reservas" class="${p.surface} group p-5 transition hover:-translate-y-0.5 hover:border-teal-500">
          <p class="text-sm font-bold text-slate-500 dark:text-slate-400">Mis solicitudes</p>
          <h3 class="mt-3 text-xl font-black text-slate-950 dark:text-white">Crear y seguir reservas</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Consulta el estado de tus reservas y crea nuevas solicitudes de espacios de trabajo.</p>
        </a>
      `;return{html:h(`
    <main class="px-4 py-8 md:px-8">
      <section class="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 class="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Hola, ${e.name}</h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Panel de control del sistema de reservas de oficinas, salas, coworking y auditorios.
          </p>
        </div>
        <a href="#/reservas" class="${p.primary}">Gestionar reservas</a>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        ${v(m.pending,t.pending,`Solicitudes por revisar`,`amber`)}
        ${v(m.approved,t.approved,`Reservas confirmadas`,`emerald`)}
        ${v(m.rejected,t.rejected,`Solicitudes rechazadas`,`rose`)}
      </section>

      <section class="mt-6 grid gap-4 lg:grid-cols-2">
        ${n}
        <article class="${p.surface} p-5">
          <p class="text-sm font-bold text-slate-500 dark:text-slate-400">Reglas activas</p>
          <h3 class="mt-3 text-xl font-black text-slate-950 dark:text-white">Control de acceso por rol</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            La sesion persiste al recargar, las rutas privadas estan protegidas y los usuarios no pueden ver reservas ajenas.
          </p>
        </article>
      </section>
    </main>
  `,`home`),afterRender:g}}var b=`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100`,x=`mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-200`,S=`inline-flex min-h-10 items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60`,C=`inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60`,ee=`inline-flex min-h-10 items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60`,w=`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black uppercase`,T=[{nombre:`Oficina Ejecutiva 1`,tipo:`Oficina`},{nombre:`Oficina Privada 2`,tipo:`Oficina`},{nombre:`Sala de reuniones A`,tipo:`Sala de reuniones`},{nombre:`Sala de reuniones B`,tipo:`Sala de reuniones`},{nombre:`Coworking Norte`,tipo:`Coworking`},{nombre:`Coworking Sur`,tipo:`Coworking`},{nombre:`Auditorio Principal`,tipo:`Auditorio`},{nombre:`Auditorio Creativo`,tipo:`Auditorio`}],E={pending:`Pendiente`,approved:`Aprobada`,rejected:`Rechazada`,cancelled:`Cancelada`},D={pending:`bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200`,approved:`bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200`,rejected:`bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200`,cancelled:`bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200`},O={reservas:[],filtroTexto:``,filtroEstado:`all`,editingId:null};function k(e=``){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function A(e){let[t,n]=e.split(`:`).map(Number);return t*60+n}function j(e,t,n,r){return A(e)<A(r)&&A(t)>A(n)}async function M(){let e=l();return(await o(e.role===`admin`?`/reservas`:`/reservas?userId=${e.id}`)).sort((e,t)=>`${t.fecha} ${t.horaInicio}`.localeCompare(`${e.fecha} ${e.horaInicio}`))}async function N(e,t=null){return(await o(`/reservas?espacio=${encodeURIComponent(e.espacio)}&fecha=${encodeURIComponent(e.fecha)}`)).some(n=>String(n.id)===String(t)||[`rejected`,`cancelled`].includes(n.estado)?!1:j(e.horaInicio,e.horaFin,n.horaInicio,n.horaFin))}function P(){let e=O.filtroTexto.trim().toLowerCase();return O.reservas.filter(t=>{let n=!e||[t.espacio,t.tipoEspacio,t.motivo,t.userName,t.fecha].filter(Boolean).some(t=>t.toLowerCase().includes(e)),r=O.filtroEstado===`all`||t.estado===O.filtroEstado;return n&&r})}function F(e,t){return t.role===`admin`||e.userId===t.id&&e.estado===`pending`}function I(e,t){return t.role===`admin`||e.userId===t.id&&[`pending`,`approved`].includes(e.estado)}function L(){let e=l(),t=O.reservas.find(e=>String(e.id)===String(O.editingId)),n=new Date().toISOString().slice(0,10);return`
    <section class="${p.surface} p-5">
      <div class="mb-5">
        <p class="text-sm font-bold text-teal-700 dark:text-teal-300">${t?`Edicion`:`Nueva reserva`}</p>
        <h3 class="mt-1 text-xl font-black text-slate-950 dark:text-white">${t?`Actualizar reserva`:`Reservar un espacio`}</h3>
      </div>
      <form id="reservaForm" class="grid gap-4">
        <input type="hidden" id="reservaId" value="${t?.id??``}">
        <div>
          <label class="${x}" for="espacio">Espacio</label>
          <select id="espacio" class="${b}" required>
            <option value="">Selecciona un espacio</option>
            ${T.map(e=>`
                  <option value="${e.nombre}" data-tipo="${e.tipo}" ${t?.espacio===e.nombre?`selected`:``}>
                    ${e.nombre} - ${e.tipo}
                  </option>
                `).join(``)}
          </select>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class="${x}" for="fecha">Fecha</label>
            <input id="fecha" class="${b}" type="date" min="${n}" value="${t?.fecha??``}" required>
          </div>
          <div>
            <label class="${x}" for="horaInicio">Inicio</label>
            <input id="horaInicio" class="${b}" type="time" value="${t?.horaInicio??``}" required>
          </div>
          <div>
            <label class="${x}" for="horaFin">Fin</label>
            <input id="horaFin" class="${b}" type="time" value="${t?.horaFin??``}" required>
          </div>
        </div>
        <div>
          <label class="${x}" for="motivo">Motivo</label>
          <textarea id="motivo" class="${b} min-h-24 resize-y" required placeholder="Describe el proposito de la reserva">${k(t?.motivo??``)}</textarea>
        </div>
        ${e.role===`admin`?`
              <div>
                <label class="${x}" for="userId">Asignar a usuario</label>
                <select id="userId" class="${b}" required></select>
              </div>
            `:``}
        <div id="formAlert" class="hidden rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"></div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <button id="submitReserva" type="submit" class="${p.primary} flex-1">${t?`Guardar cambios`:`Crear reserva`}</button>
          ${t?`<button id="cancelEdit" type="button" class="${p.secondary} flex-1">Cancelar edicion</button>`:``}
        </div>
      </form>
    </section>
  `}function R(){return`
    <section class="${p.surface} p-4">
      <div class="grid gap-3 md:grid-cols-[1fr_220px]">
        <input id="searchReservas" class="${b}" type="search" placeholder="Buscar por espacio, usuario, fecha o motivo" value="${k(O.filtroTexto)}">
        <select id="statusFilter" class="${b}">
          <option value="all" ${O.filtroEstado===`all`?`selected`:``}>Todos los estados</option>
          <option value="pending" ${O.filtroEstado===`pending`?`selected`:``}>Pendientes</option>
          <option value="approved" ${O.filtroEstado===`approved`?`selected`:``}>Aprobadas</option>
          <option value="rejected" ${O.filtroEstado===`rejected`?`selected`:``}>Rechazadas</option>
          <option value="cancelled" ${O.filtroEstado===`cancelled`?`selected`:``}>Canceladas</option>
        </select>
      </div>
    </section>
  `}function z(e,t){return t.role===`admin`?`
      <button class="${C}" data-action="approve" data-id="${e.id}" ${e.estado===`approved`?`disabled`:``}>Aprobar</button>
      <button class="${ee}" data-action="reject" data-id="${e.id}" ${e.estado===`rejected`?`disabled`:``}>Rechazar</button>
      <button class="${p.secondary}" data-action="edit" data-id="${e.id}">Editar</button>
      <button class="${S}" data-action="delete" data-id="${e.id}">Eliminar</button>
    `:`
    ${F(e,t)?`<button class="${p.secondary}" data-action="edit" data-id="${e.id}">Editar</button>`:``}
    ${I(e,t)?`<button class="${S}" data-action="cancel" data-id="${e.id}">Cancelar</button>`:``}
    ${e.estado===`approved`?`<span class="text-xs font-bold text-slate-500 dark:text-slate-400">Aprobada: solo puedes cancelarla.</span>`:``}
    ${e.estado===`rejected`?`<span class="text-xs font-bold text-slate-500 dark:text-slate-400">Reserva rechazada y bloqueada.</span>`:``}
  `}function B(e){let t=l();return`
    <article class="${p.surface} p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-lg font-black text-slate-950 dark:text-white">${k(e.espacio)}</h3>
          <p class="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">${k(e.tipoEspacio)}</p>
        </div>
        <span class="${w} ${D[e.estado]??D.pending}">${E[e.estado]??e.estado}</span>
      </div>
      <dl class="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
        <div class="flex justify-between gap-4"><dt class="font-bold">Fecha</dt><dd>${k(e.fecha)}</dd></div>
        <div class="flex justify-between gap-4"><dt class="font-bold">Horario</dt><dd>${k(e.horaInicio)} - ${k(e.horaFin)}</dd></div>
        <div class="flex justify-between gap-4"><dt class="font-bold">Usuario</dt><dd>${k(e.userName??`Sin asignar`)}</dd></div>
      </dl>
      <p class="mt-4 rounded-lg bg-slate-100 p-3 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300">${k(e.motivo)}</p>
      <div class="mt-5 flex flex-wrap gap-2">
        ${z(e,t)}
      </div>
    </article>
  `}function V(){let e=P();return e.length?`<section id="reservasList" class="grid gap-4 xl:grid-cols-2">${e.map(B).join(``)}</section>`:`
      <section class="${p.surface} p-8 text-center">
        <h3 class="text-xl font-black text-slate-950 dark:text-white">No hay reservas para mostrar</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Ajusta los filtros o crea una nueva reserva.</p>
      </section>
    `}async function H(e=``){if(l().role!==`admin`)return;let t=document.getElementById(`userId`);t&&(t.innerHTML=(await o(`/users`)).filter(e=>e.role===`user`).map(t=>`<option value="${t.id}" ${String(t.id)===String(e)?`selected`:``}>${k(t.name)} - ${k(t.email)}</option>`).join(``))}function U(){document.getElementById(`reservaFormPanel`).innerHTML=L(),document.getElementById(`filtersPanel`).innerHTML=R(),document.getElementById(`reservasPanel`).innerHTML=V(),q()}function W(e){let t=document.getElementById(`formAlert`);t.textContent=e,t.classList.remove(`hidden`)}async function G(e){e.preventDefault();let t=l(),n=e.currentTarget,r=document.getElementById(`submitReserva`),i=document.getElementById(`reservaId`).value,a=document.getElementById(`espacio`).selectedOptions[0],s={userId:t.role===`admin`?document.getElementById(`userId`).value:t.id,userName:t.role===`admin`?document.getElementById(`userId`).selectedOptions[0]?.textContent.split(` - `)[0]:t.name,espacio:document.getElementById(`espacio`).value,tipoEspacio:a?.dataset.tipo??``,fecha:document.getElementById(`fecha`).value,horaInicio:document.getElementById(`horaInicio`).value,horaFin:document.getElementById(`horaFin`).value,motivo:document.getElementById(`motivo`).value.trim()};if(s.horaInicio>=s.horaFin){W(`La hora de fin debe ser posterior a la hora de inicio.`);return}r.disabled=!0,r.textContent=i?`Guardando...`:`Creando...`;try{if(await N(s,i||null))throw Error(`Ya existe una reserva activa para ese espacio, fecha y rango horario.`);if(i){let e=O.reservas.find(e=>String(e.id)===String(i));await o(`/reservas/${i}`,{method:`PATCH`,body:JSON.stringify({...s,estado:e.estado,updatedAt:new Date().toISOString()})})}else await o(`/reservas`,{method:`POST`,body:JSON.stringify({...s,estado:`pending`,createdAt:new Date().toISOString()})});O.editingId=null,n.reset(),O.reservas=await M(),U()}catch(e){W(e.message),r.disabled=!1,r.textContent=i?`Guardar cambios`:`Crear reserva`}}async function K(e){let t=e.target.closest(`[data-action]`);if(!t)return;let{action:n,id:r}=t.dataset,i=l(),a=O.reservas.find(e=>String(e.id)===String(r));if(a)try{if(n===`edit`){if(!F(a,i)){alert(`Solo puedes editar reservas pendientes propias.`);return}O.editingId=r,U(),await H(a.userId),document.getElementById(`reservaFormPanel`).scrollIntoView({behavior:`smooth`,block:`start`});return}if(n===`approve`&&await o(`/reservas/${r}`,{method:`PATCH`,body:JSON.stringify({estado:`approved`})}),n===`reject`&&await o(`/reservas/${r}`,{method:`PATCH`,body:JSON.stringify({estado:`rejected`})}),n===`cancel`){if(!I(a,i)){alert(`No tienes permisos para cancelar esta reserva.`);return}await o(`/reservas/${r}`,{method:`PATCH`,body:JSON.stringify({estado:`cancelled`})})}if(n===`delete`){if(!confirm(`Deseas eliminar definitivamente esta reserva?`))return;await o(`/reservas/${r}`,{method:`DELETE`})}O.reservas=await M(),U()}catch(e){alert(`Error: ${e.message}`)}}function q(){g(),document.getElementById(`reservaForm`)?.addEventListener(`submit`,G),document.getElementById(`cancelEdit`)?.addEventListener(`click`,()=>{O.editingId=null,U(),H()}),document.getElementById(`searchReservas`)?.addEventListener(`input`,e=>{O.filtroTexto=e.target.value,document.getElementById(`reservasPanel`).innerHTML=V()}),document.getElementById(`statusFilter`)?.addEventListener(`change`,e=>{O.filtroEstado=e.target.value,document.getElementById(`reservasPanel`).innerHTML=V()}),document.getElementById(`reservasPanel`)?.addEventListener(`click`,K),H(O.reservas.find(e=>String(e.id)===String(O.editingId))?.userId)}async function J({adminView:e=!1}={}){let t=l();return O.reservas=await M(),{html:h(`
    <main class="px-4 py-8 md:px-8">
      <section class="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">${t.role===`admin`?`Vista global`:`Vista personal`}</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">${e?`Administracion de reservas`:`Reservas`}</h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            ${t.role===`admin`?`Puedes aprobar, rechazar, editar y eliminar cualquier reserva.`:`Solo ves tus reservas. Las pendientes pueden editarse; las aprobadas pueden cancelarse.`}
          </p>
        </div>
      </section>

      <div class="grid gap-5 lg:grid-cols-[minmax(320px,420px)_1fr]">
        <div id="reservaFormPanel">${L()}</div>
        <div class="grid content-start gap-4">
          <div id="filtersPanel">${R()}</div>
          <div id="reservasPanel">${V()}</div>
        </div>
      </div>
    </main>
  `,e?`admin`:`reservas`),afterRender:q}}var Y={shell:`min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100`,surface:`rounded-lg border border-slate-200 bg-white/95 shadow-sm dark:border-slate-800 dark:bg-slate-900/90`,label:`mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-200`,input:`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100`,primary:`inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-300`,secondary:`inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-extrabold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800`},X={"/login":{requiresAuth:!1,render:ne},"/home":{requiresAuth:!0,render:y},"/reservas":{requiresAuth:!0,render:()=>J()},"/admin":{requiresAuth:!0,adminOnly:!0,render:()=>J({adminView:!0})}};function Z(){return window.location.hash.replace(`#`,``)||`/login`}function Q(e){let t=e.startsWith(`#`)?e:`#${e}`;if(window.location.hash===t){$();return}window.location.hash=t}function te(){let e=localStorage.getItem(`theme`),t=window.matchMedia?.(`(prefers-color-scheme: dark)`).matches;document.documentElement.classList.toggle(`dark`,e?e===`dark`:t)}function ne(){return{html:`
      <main class="${Y.shell} grid place-items-center p-5">
        <section class="${Y.surface} w-full max-w-md p-7">
          <div class="mb-7">
            <p class="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">Sistema de Reservas</p>
            <h1 class="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Iniciar sesion</h1>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Accede para gestionar espacios de trabajo.</p>
          </div>
          <form id="loginForm" class="grid gap-4">
            <div>
              <label class="${Y.label}" for="email">Correo electronico</label>
              <input id="email" name="email" class="${Y.input}" type="email" autocomplete="email" placeholder="admin@test.com" required>
            </div>
            <div>
              <label class="${Y.label}" for="password">Contrasena</label>
              <input id="password" name="password" class="${Y.input}" type="password" autocomplete="current-password" placeholder="admin123" required>
            </div>
            <div id="loginError" class="hidden rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"></div>
            <button id="loginButton" class="${Y.primary} w-full" type="submit">Ingresar</button>
          </form>
          <div class="mt-6 rounded-lg bg-slate-100 p-4 text-xs leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <p class="font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Credenciales</p>
            <p class="mt-2"><strong>Admin:</strong> admin@test.com / admin123</p>
            <p><strong>User 1:</strong> user1@test.com / user123</p>
            <p><strong>User 2:</strong> user2@test.com / user123</p>
          </div>
        </section>
      </main>
    `,afterRender(){let e=document.getElementById(`loginForm`),t=document.getElementById(`loginError`),n=document.getElementById(`loginButton`);e.addEventListener(`submit`,async r=>{r.preventDefault(),t.classList.add(`hidden`),n.disabled=!0,n.textContent=`Validando...`;try{await s(e.email.value,e.password.value),Q(`#/home`)}catch(e){t.textContent=e.message,t.classList.remove(`hidden`),n.disabled=!1,n.textContent=`Ingresar`}})}}}async function re(e){let t=document.getElementById(`app`),n=await e.render();t.innerHTML=n.html,n.afterRender?.()}async function $(){te();let e=Z(),t=l();if((e===`/`||e===`/login`)&&t){Q(`#/home`);return}let n=X[e],r=document.getElementById(`app`);if(!n){r.innerHTML=`
      <main class="${Y.shell} grid place-items-center p-6">
        <section class="${Y.surface} max-w-lg p-8 text-center">
          <h1 class="text-4xl font-black text-slate-950 dark:text-white">404</h1>
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">La ruta solicitada no existe.</p>
          <a href="#/home" class="${Y.primary} mt-6">Volver</a>
        </section>
      </main>
    `;return}let i=d(n);if(i.redirectTo){Q(i.redirectTo);return}if(i.denied){r.innerHTML=f();return}try{await re(n)}catch(e){r.innerHTML=`
      <main class="${Y.shell} grid place-items-center p-6">
        <section class="${Y.surface} max-w-lg p-8 text-center">
          <h1 class="text-2xl font-black text-rose-700 dark:text-rose-300">No se pudo cargar la vista</h1>
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${e.message}</p>
          <a href="#/login" class="${Y.secondary} mt-6">Ir al login</a>
        </section>
      </main>
    `}}window.addEventListener(`hashchange`,$),window.addEventListener(`DOMContentLoaded`,()=>{if(!window.location.hash){window.location.hash=`#/login`;return}$()});