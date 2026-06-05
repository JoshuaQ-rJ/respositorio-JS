# Sistema de Gestión de Reservas de Espacios - SPA

Una aplicación de página única moderna (SPA) construida con JavaScript vanilla, Vite, Tailwind CSS y JSON Server para gestionar reservas de espacios de trabajo con control de acceso basado en roles.

## 🎯 Características Principales

### Autenticación y Seguridad
- **Gestión Persistente de Sesión** - La sesión del usuario se guarda en localStorage y persiste al actualizar
- **Control de Acceso Basado en Roles** - Permisos diferenciados para administrador y usuario
- **Protección de Rutas** - Los guards interceptan la navegación y protegen rutas restringidas
- **Logout Limpio** - Borra completamente los datos de sesión de localStorage
- **Validación de Credenciales** - Autentica contra API simulada con manejo seguro de usuarios

### Gestión de Reservas
- **Panel del Usuario** - Ver solo sus propias reservas
- **Panel del Administrador** - Ver todas las reservas del sistema con flujo de aprobación
- **Seguimiento de Estado** - Las reservas pueden estar pendiente, aprobada o rechazada
- **Permisos de Acción** - Diferentes acciones disponibles según el rol y estado de la reserva

### Prevención de Conflictos
- **Detección Automática de Conflictos** - Valida franjas horarias antes de crear
- **Validación Inteligente** - Previene doble reserva verificando reservas existentes
- **Retroalimentación en Tiempo Real** - Muestra alertas cuando se detectan conflictos
- **Precisión Hora a Hora** - Detecta superposiciones usando cálculos basados en minutos

### Interfaz de Usuario
- **Diseño Responsive** - Funciona perfectamente en móvil, tablet y desktop
- **Estilos Modernos** - Construido con Tailwind CSS v4.3.0 enfoque utility-first
- **Soporte Modo Oscuro** - Incluye variantes dark: para temas oscuros
- **Navegación Intuitiva** - Barra lateral clara y botones contextuales

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js (v16 o superior)
- npm o yarn

### Instalación

```bash
# Navega a la carpeta del proyecto
cd workspace-reservation-system

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo (Vite + JSON Server)
npm run dev
```

La aplicación estará disponible en:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000

### Credenciales de Prueba

#### Administrador
```
Email: admin@test.com
Contraseña: admin123
Rol: admin
```

#### Usuarios Estándar
```
Email: user1@test.com
Contraseña: user123
Rol: user

Email: user2@test.com
Contraseña: user123
Rol: user
```

---

## 📁 Estructura del Proyecto

```
src/
├── api/
│   └── http.js                 # Cliente HTTP wrapper
├── components/
│   ├── ReservationCard.js      # Tarjeta de reserva reutilizable
│   └── Sidebar.js              # Barra lateral de navegación
├── controllers/
│   ├── home.controller.js      # Lógica página inicio
│   └── login.controller.js     # Manejador formulario login
├── modules/
│   ├── reservas.module.js      # Operaciones CRUD de reservas
│   └── nuevoForm.module.js     # Formulario nueva reserva con validación
├── router/
│   └── router.js               # Configuración del enrutador SPA
├── security/
│   ├── auth.guard.js           # Guards de autenticación
│   └── auth.service.js         # Servicio API de autenticación
├── services/
│   └── reservation.service.js  # Wrapper API de reservas
├── utils/
│   └── dom.js                  # Funciones utilidad DOM
├── views/
│   ├── homeView.js             # Plantilla página inicio
│   ├── loginView.js            # Plantilla página login
│   └── notFound.js             # Página error 404
├── main.js                     # Punto de entrada de la aplicación
├── utils.js                    # Utilidades de gestión de sesión
└── style.css                   # Estilos globales (import Tailwind)
```

---

## 🔐 Descripción General de la Arquitectura

### Capa de Seguridad (auth.guard.js + auth.service.js)

**Persistencia de Sesión**
- Las sesiones se guardan en localStorage bajo la clave `workspace_session`
- Se recuperan automáticamente al actualizar la página
- Se borran completamente al cerrar sesión

**Flujo de Autenticación**
```
Envío del Formulario de Login
    ↓
authenticate(email, password)
    ↓
GET /users → Validar credenciales
    ↓
Retornar usuario (sin contraseña)
    ↓
Guardar en localStorage
    ↓
Navegar a /home
```

**Guards de Rutas**
- Interceptan la navegación antes de renderizar
- Verifican estado de autenticación
- Validan roles de usuario
- Renderizan "Acceso Denegado" para acceso no autorizado

### Módulo de Reservas (reservas.module.js)

**Permisos del Usuario**
- Ver solo sus reservas personales (filtradas por userId)
- Crear nuevas reservas (estado: pendiente)
- Editar reservas pendientes
- Cancelar cualquiera de sus reservas

**Permisos del Administrador**
- Ver todas las reservas del sistema
- Aprobar reservas pendientes (PATCH → estado: aprobada)
- Rechazar reservas pendientes (PATCH → estado: rechazada)
- Eliminar cualquier reserva (DELETE)

**Endpoints de la API**
```
GET    /reservas              # Obtener todas las reservas
GET    /reservas?userId={id}  # Obtener reservas del usuario
POST   /reservas              # Crear nueva reserva
PATCH  /reservas/{id}         # Actualizar estado de reserva
DELETE /reservas/{id}         # Eliminar reserva
```

### Detección de Conflictos (nuevoForm.module.js)

**Algoritmo de Validación**
1. Obtiene todas las reservas existentes de la API
2. Convierte horas a minutos para comparación numérica
3. Filtra por: mismo espacio Y misma fecha
4. Excluye reservas rechazadas
5. Detecta superposición: `!(nuevoFin ≤ inicioExistente || nuevoInicio ≥ finExistente)`
6. Si hay conflicto: muestra alerta y previene POST
7. Si validación pasa: crea reserva con estado "pendiente"

**Validaciones Incluidas**
- La hora fin debe ser posterior a la hora inicio
- La fecha no puede estar en el pasado (mínimo: hoy)
- Todos los campos son obligatorios
- La descripción no puede estar vacía

---

## 📊 Estructura de Datos

### Base de Datos (db.json)

**Colección de Usuarios**
```json
{
  "id": 1,
  "name": "Ana García",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

**Colección de Reservas**
```json
{
  "id": 1,
  "userId": 2,
  "espacio": "Sala A",
  "fecha": "2026-06-10",
  "horaInicio": "08:00",
  "horaFin": "09:00",
  "motivo": "Sprint Planning",
  "estado": "pendiente"
}
```

**Estados Válidos**
- `pendiente` - Esperando aprobación del administrador
- `aprobada` - Aprobada por administrador
- `rechazada` - Rechazada por administrador

**Espacios de Trabajo Disponibles**
- Sala A, Sala B, Sala C
- Oficina Ejecutiva
- Auditorium Principal
- Coworking Zone 1, Coworking Zone 2
- Sala de Capacitación

---

## 🛣️ Rutas Disponibles

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/#/` | loginView | Login de usuario |
| `/#/home` | homeView | Dashboard (después de login) |
| `/#/reservas` | renderReservasView() | Ver reservas |
| `/#/reservas/nueva` | renderNuevoFormView() | Crear nueva reserva |

---

## 🎨 Sistema de Diseño

### Paleta de Colores
```
Primario:    indigo-600      # Botones de acción principal
Éxito:       green-600       # Acción de aprobación
Alerta:      amber-600       # Estado pendiente
Error:       rose-600        # Rechazo/Cancelación
Neutro:      slate-600       # Fondos y bordes
```

### Puntos de Quiebre Responsive
```
Móvil:       < 640px
Tablet:      640px - 1024px
Desktop:     > 1024px
```

### Componentes
- **Sidebar:** Navegación fija (w-64) en desktop
- **Tarjetas:** Grid layout responsive (1, 2, 3 columnas)
- **Formularios:** Inputs ancho completo con estados de enfoque
- **Alertas:** Mensajes de error/éxito inline

---

## 🧪 Escenarios de Prueba

### Prueba 1: Login
1. Ingresa credenciales inválidas → Muestra mensaje de error
2. Ingresa credenciales válidas → Redirige a /home
3. La sesión persiste al actualizar la página

### Prueba 2: Usuario Crea Reserva
1. Navega al formulario de nueva reserva
2. Selecciona espacio, fecha, horas y motivo
3. Intenta rango de horas inválido (fin ≤ inicio) → Muestra error
4. Intenta franja horaria conflictiva → Muestra alerta de conflicto
5. Envía formulario válido → Reserva creada con estado "pendiente"

### Prueba 3: Administrador Aprueba Reserva
1. Login como administrador
2. Navega a reservas
3. Ve todas las reservas del sistema
4. Hace clic en "Aprobar" en reserva pendiente
5. El estado cambia a "aprobada"
6. El usuario ve el estado actualizado en su próximo acceso

### Prueba 4: Seguridad
1. El usuario intenta una acción no autorizada → Mensaje "Acceso Denegado"
2. Logout → Sesión borrada, redirige a login
3. Accede a ruta protegida sin login → Redirige a login

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo (Vite + JSON Server)
npm run dev

# Solo frontend (Vite)
npm run client

# Solo backend (JSON Server)
npm run server

# Build de producción
npm run build

# Vista previa de build de producción
npm run preview
```

---

## 📦 Dependencias

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| vite | ^8.0.12 | Bundler de módulos y servidor de desarrollo |
| @tailwindcss/vite | ^4.3.0 | Integración de Tailwind CSS para Vite |
| tailwindcss | ^4.3.0 | Framework CSS utility-first |
| json-server | ^1.0.0-beta.15 | Servidor API REST simulado |
| concurrently | ^10.0.3 | Ejecutar múltiples procesos simultáneamente |

---

## 🏗️ Stack Tecnológico

- **Frontend:** JavaScript vanilla (ES6+)
- **Bundler:** Vite
- **Estilos:** Tailwind CSS v4.3.0
- **API Backend:** JSON Server
- **Almacenamiento:** localStorage
- **Arquitectura:** Aplicación de Página Única (SPA)

---

## 📝 Convenciones de Código

### Nomenclatura de Archivos
- Componentes: `PascalCase.js` (ej: `Sidebar.js`)
- Módulos: `kebab-case.module.js` (ej: `reservas.module.js`)
- Controladores: `kebab-case.controller.js` (ej: `login.controller.js`)
- Utilidades: `kebab-case.js` (ej: `auth.guard.js`)

### Documentación de Funciones
```javascript
/**
 * Descripción breve
 * @param {tipo} nombreParam - Descripción
 * @returns {tipo} Descripción
 */
export function nombreFuncion(param) {
  // implementación
}
```

### Clases CSS
- Botones interactivos: prefijo `.btn-*` (ej: `.btn-aprobar`)
- IDs funcionales: sufijo `#*-btn` (ej: `#logout-btn`)
- Tailwind inline para plantillas

---

## 🚀 Optimizaciones de Rendimiento

- ✅ Agrupación de módulos con Vite para tiempos de carga óptimos
- ✅ Delegación de eventos para manipulación eficiente del DOM
- ✅ Renderizado diferido con inyección de contenido dinámico
- ✅ CSS mínimo con clases utilidad de Tailwind
- ✅ localStorage para persistencia rápida de sesión

---

## 🛡️ Características de Seguridad

- ✅ Validación de sesión en rutas protegidas
- ✅ Verificaciones de permiso basadas en roles
- ✅ Contraseña excluida del almacenamiento de sesión
- ✅ Limpieza completa de sesión al cerrar sesión
- ✅ Validación de entrada en todos los formularios

**Nota:** Este es un proyecto de demostración. Para producción:
- Implementa autenticación JWT
- Usa HTTPS exclusivamente
- Usa bcrypt para hash de contraseñas
- Implementa CORS correctamente
- Usa variables de entorno para datos sensibles

---

## 🔄 Flujos de Trabajo del Usuario

### Flujo del Usuario Estándar
1. Login con credenciales de usuario
2. Ve panel personal
3. Navega a "Mis Reservas"
4. Ve solo sus reservas (filtradas por userId)
5. Crea nueva reserva a través del formulario
6. La reserva entra en estado "pendiente"
7. Espera aprobación del administrador
8. Ve el estado actualizado después de la aprobación

### Flujo del Administrador
1. Login con credenciales de administrador
2. Ve panel de administrador
3. Navega a "Todas las Reservas"
4. Ve todas las reservas del sistema
5. Aprueba reservas pendientes (PATCH)
6. Rechaza reservas si es necesario (PATCH)
7. Elimina reservas (DELETE)
8. Monitorea toda la actividad de reservas

---

## 🎓 Recursos de Aprendizaje

Este proyecto demuestra:
- **Arquitectura SPA** - Enrutamiento del lado del cliente sin recargas de página
- **Autenticación** - Gestión de sesión y validación de usuario
- **Autorización** - Control de acceso basado en roles
- **Gestión de Estado** - localStorage para estado persistente
- **Manejo de Formularios** - Validación y retroalimentación de errores
- **Integración de API** - Consumo de endpoints RESTful
- **Manipulación del DOM** - Renderizado dinámico de contenido
- **Diseño Responsive** - Tailwind CSS primero móvil

---

## 📚 Documentación Adicional

Para información más detallada, consulta:
- **GUÍA_RÁPIDA.md** - Guía de inicio rápido
- **DOCUMENTACIÓN_TÉCNICA.md** - Arquitectura técnica
- **CHECKLIST.md** - Lista de características y pruebas

---

## 🐛 Solución de Problemas

### JSON Server no inicia
```bash
# Verifica si el puerto 3000 está disponible
# O cambia el puerto en vite.config.js
```

### Vite no compila
```bash
# Limpia caché e reinstala
rm -rf node_modules
npm install
npm run dev
```

### La sesión no persiste
- Verifica localStorage del navegador (DevTools → Application → localStorage)
- Verifica la clave: `workspace_session`
- Comprueba restricciones de modo privado/incógnito del navegador

---

## 🔮 Mejoras Futuras

- Autenticación basada en JWT
- Búsqueda y filtrado avanzado
- Estadísticas e informes de administrador
- Notificaciones por email
- Gestión de espacios
- Soporte de zonas horarias
- Exportar a PDF/CSV
- Autenticación de dos factores
- Registros de actividad y auditoría

---

## 📄 Licencia

Este proyecto se proporciona tal cual para fines educativos y de demostración.

---

## 👨‍💻 Desarrollo

**Resumen del Stack:**
```
Frontend:    JavaScript ES6+ (Vanilla)
Bundler:     Vite
Estilos:     Tailwind CSS v4.3.0
API Backend: JSON Server (simulada)
Task Runner: Concurrently
```

**Arquitectura:**
- Estructura modular basada en componentes
- Separación de preocupaciones (controladores, servicios, vistas)
- CSS limpio con enfoque utility-first
- Consumo de API RESTful

---

**Construido con ❤️ usando JavaScript vanilla, Vite y Tailwind CSS**

*Listo para producción. ¡Feliz codificación! 🚀*
