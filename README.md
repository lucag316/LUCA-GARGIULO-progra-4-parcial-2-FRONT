

# Red Social - TP PARCIAL 2 - Frontend (Angular)

Aplicación web desarrollada con Angular que permite a usuarios registrados crear publicaciones, comentar, reaccionar y acceder a funcionalidades de administración y estadísticas si son administradores. Soporta instalación como aplicación PWA y cuenta con diseño responsivo y experiencia de usuario fluida.

---

## 📋 Indice
- [👨‍💻 Información del Proyecto](#-información-del-proyecto)
- [🔗 Links importantes](#-links-importantes)
- [🛠️ Tecnologías utilizadas](#-tecnologías-utilizadas)
- [ Estructura de Carpetas](#-estructura-de-carpetas)
- [🟢 Sprint 1](#-sprint-1)
- [🟢 Sprint 2](#-sprint-2)
- [🟢 Sprint 3](#-sprint-3)
- [🟢 Sprint 4](#-sprint-4)

---

## 👨‍💻 Información del Proyecto

- **Nombres**: Luca Franco
- **Apellidos**: Gargiulo Nicola
- **Materia**: Programación IV
- **Nivel**: 4° Cuatrimestre
- **Comisión**: 2025 C1
- **Docente:** Rodrigo Plazas  
- **Tipo de Examen**: Segundo Parcial

---

## 🔗 Links importantes

-🔗 **Repositorio GitHub**: *[https://github.com/lucag316/LUCA-GARGIULO-progra-4-parcial-2-FRONT]*

-🔗 **Deploy en Vercel**: *[https://parcial-2-front.vercel.app]*

-📱 **Instalable como PWA**: desde Chrome, aparece opción “Instalar app”

---

## 🛠️ Tecnologías utilizadas

### Frontend

- Angular 17+
- TypeScript
- RxJS
- Angular Material

### UI / UX

- Flex Layout y CSS responsive
- Angular Material Modals, Cards, Toolbars, Forms

### Herramientas

- Git / GitHub
- Vite / Angular CLI
- HTTP Interceptors + Guards
- JWT (validación y renovación)
- ng2-charts (gráficos)
- PWA Angular Service Worker

---

## 🌟 Características principales

- 🔐 **Login y Registro** con validaciones
- 📦 **Token JWT** almacenado y verificado al iniciar la app
- 🖼️ **Publicaciones con imágenes** y baja lógica
- ❤️ **Me gusta** y 💬 **comentarios paginados**
- 👤 **Perfil**, con foto e info personal
- 🛡️ **Rol de Administrador**: gestión de usuarios y estadísticas
- 📊 **Gráficos**: publicaciones y comentarios por usuario y tiempo
- 📱 **PWA instalada desde navegador**
- ⏱️ **Control de sesión y renovación automática del token**

---

## 🧑‍💼 Funcionalidades por Sprint

### 🟢 Sprint 1

#### Consigna (Entrega: 09/06): 
- Creación del proyecto front - Angular.
- Pantallas (Registro, Login, Publicaciones, Mi Perfil)
- Deploy en hosting
- Navegación entre componentes. Sin límites de accesibilidad.
- Implementar un favicon propio.
- Componente login:
    - Debe poseer un formulario con validaciones y mensajes acordes.
    - Puede ser por correo o por nombre de usuario, pero cualquiera que sea elegido debe ser único en la base de datos.
    - La contraseña debe poseer al menos 8 caracteres, una mayúscula y un número.
- Componente Registro:
    - Debe poseer un formulario con validaciones y mensajes acordes
    - Debe poseer los campos: nombre, apellido, correo, nombre de usuario, contraseña, repetir contraseña, fecha de nacimiento, descripción breve.
    - Debe poseer un campo de tipo file para la imagen de perfil.
    - Los usuarios deben poseer un atributo perfil. Por defecto poseen el perfil “usuario” pero se puede modificar para que su perfil sea “administrador”.

#### Resolución

Durante el Sprint 1 del proyecto frontend con Angular se implementaron y cumplieron todos los requisitos establecidos en la consigna, con los siguientes puntos destacados:

- Creación del proyecto Angular desde cero, estructurado con componentes standalone para mayor modularidad y mantenimiento.

- Pantallas desarrolladas:

    - Login: Formulario con validaciones completas para ingreso por correo o nombre de usuario y contraseña. Se garantiza que el identificador sea único (pendiente validación backend).
    - Registro: Formulario con los campos solicitados —> nombre, apellido, correo, usuario, contraseña, repetir contraseña, fecha de nacimiento, descripción breve, campo para subir imagen de perfil y tipo de perfil.

- Validaciones y mensajes:

    - Contraseña con al menos 8 caracteres, una mayúscula y un número, validada tanto en template como programáticamente.
    - Mensajes de error claros y amigables para cada campo obligatorio y condición de validación.
    - Confirmación de contraseña y restricción de edad mínima (13 años) en el registro.
    - Indicadores visuales (clases CSS) que muestran estado válido o inválido al tocar los campos.
    - Navegación entre componentes configurada sin restricciones de accesibilidad para facilitar pruebas y navegación simple entre Login, Registro, Publicaciones y Mi Perfil (hecho en un navbar y footer).
    - Carga y manejo de imagen de perfil en el formulario de registro mediante campo file, preparado para integrar con backend.
    - Implementación del favicon propio incluido en el proyecto.
    - Despliegue básico preparado, con instrucciones para ejecutar localmente y desplegado en el hosting (**vercel**).
    - Uso de Angular Material SnackBar para notificaciones rápidas y feedback al usuario.

Este Sprint sienta las bases fundamentales para el funcionamiento del frontend, con una estructura limpia y funcional, validaciones robustas y UX amigable, listo para integrarse con el backend en próximos sprints.

---

### 🟢 Sprint 2

#### Consigna (Entrega: 16/06):

- Implementar el listado de publicaciones.
- Cada publicación debe mostrar: foto del autor, nombre completo, fecha, texto, imagen adjunta, cantidad de likes, y cantidad de comentarios.
- Los likes deben poder activarse/desactivarse como botón (toggle).
- Ordenar las publicaciones por cantidad de likes o por fecha.
- Desde el perfil debe poder verse:
  - Información del usuario.
  - Sus últimas 3 publicaciones.
  - Comentarios que realizó.
- Implementar paginación para publicaciones.

#### Resolución:

En este sprint se integraron funcionalidades clave para la navegación y visualización del contenido generado por los usuarios, manteniendo la interacción fluida y el diseño responsivo.

- Se creó el componente `publicaciones` con soporte para:
  - Listado general de publicaciones.
  - Orden dinámico (likes o fecha), con botones con íconos visuales.
  - Vista de cada publicación incluye:
    - Avatar y nombre del autor.
    - Texto de la publicación, imagen (opcional), fecha formateada.
    - Cantidad de likes y comentarios.
    - Botón "Me gusta" toggleable, con estado sincronizado por usuario.
- Se creó el componente `perfil` que permite:
  - Mostrar sus últimas 3 publicaciones (fetch limitado).
  - Listar los comentarios que ha realizado.
- Se implementó paginación tanto en el listado general de publicaciones como en los comentarios (siguiente sprint).
- Toda la lógica está encapsulada en servicios reutilizables (`PublicacionesService`, `UsuariosService`, `AuhService`).
- Se utilizaron Angular Material para la estética de las publicaciones y botones de acción.

---

### 🟢 Sprint 3

#### Consigna (Entrega: 23/06):

- Implementar vista de publicación individual (detalle).
- Mostrar todos los comentarios asociados a la publicación.
- Paginación de comentarios.
- Permitir que un usuario logueado pueda comentar.
- Mostrar perfil del autor del comentario.
- Implementar control de sesión:
  - El token JWT expira.
  - Mostrar modal para renovar sesión antes de expirar.
  - Si el usuario no renueva, desloguear.
- Implementar un `loading` visual durante peticiones HTTP.

#### Resolución:

Durante este sprint se consolidó la experiencia del usuario al interactuar con una publicación en detalle, junto con mejoras importantes en la estabilidad de sesión.

- Se desarrolló el componente `detalle-publicacion`, accesible desde cualquier publicación listada:
  - Muestra la publicación seleccionada en formato completo.
  - Listado de comentarios asociados con paginación.
  - Permite dejar nuevos comentarios validados.
  - Al enviarse, se actualiza la lista.
- Se visualiza el perfil del autor de cada comentario, con avatar, nombre y fecha.
- Paginación de comentarios implementada con botones de siguiente/anterior.
  - Detecta automáticamente si el token está por expirar (5 minutos antes).
  - Muestra un modal con opción de renovar o cerrar sesión.
  - Si no responde, se cierra la sesión automáticamente.
- Se implementó un `LoadingComponent` reutilizable:
  - Muestra animación de carga durante operaciones HTTP intensivas.
  - Usado en inicio de sesión, carga de publicaciones, comentarios, etc.
- Uso de `interceptor` HTTP para renovar token de forma automática si está cerca de expirar, evitando deslogueo innecesario.

---

### 🟢 Sprint 4

#### Consigna (Entrega: 30/06):

- Implementar **Dashboard de Usuarios** accesible solo por administradores.
  - Listar usuarios.
  - Dar de alta/baja lógica.
  - Alta de nuevos usuarios administradores.
- Implementar **Dashboard de Estadísticas** con gráficos:
  - Publicaciones por usuario.
  - Comentarios por publicación.
  - Comentarios en un rango de fechas.
- Hacer la aplicación instalable como **PWA**.

#### Resolución:

En este sprint final se implementaron las funcionalidades avanzadas y exclusivas para administradores, además de optimizaciones de rendimiento y mejoras en la experiencia offline.

- Se creó el componente `dashboard-usuarios`:
  - Listado completo de usuarios (excluyendo eliminados).
  - Acciones para dar de baja o alta lógica a cada usuario.
  - Creación de nuevos usuarios con rol de administrador desde el panel.
  - Validación estricta por `AdminGuard`.
- Se creó el componente `dashboard-estadisticas`:
  - Gráfico de **publicaciones por usuario** usando `ng2-charts` (barra horizontal).
  - Gráfico de **comentarios por publicación**.
  - Gráfico de **comentarios en un rango de fechas**, con input tipo `date`.
  - Todos los datos se obtienen desde el backend mediante rutas protegidas.
- Se mejoró el manejo de roles:
  - Navegación condicional según perfil de usuario (`usuario` vs `administrador`).
  - Los dashboards solo son accesibles a administradores con token válido.
- Se configuró la app como **PWA**:
  - Se activa opción "Instalar aplicación" en navegadores compatibles.
  - Archivos cacheados por `ServiceWorker` permiten funcionamiento offline parcial.
  - `Manifest.json` personalizado con íconos, colores y nombre de la app.

---

✅ **Estado final**: Todas las consignas fueron cumplidas en tiempo y forma, y la aplicación está lista para su evaluación como TP del segundo parcial.

📌 [Volver al índice](#-indice)