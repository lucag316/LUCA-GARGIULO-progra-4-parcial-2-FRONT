

# Red Social - TP PARCIAL 2 - Frontend (Angular)

Este es el frontend del proyecto **Red Social**, desarrollado en Angular como parte del TP parcial #2. La aplicación permite a los usuarios registrarse, iniciar sesión, realizar publicaciones, comentar, reaccionar y editar su perfil, entre otras funcionalidades.

---

## 📋 Indice
- [👨‍💻 Información del Proyecto](#-información-del-proyecto)
- [🔗 Links importantes](#-links-importantes)

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

-🔗 **Repositorio GitHub**: *[https://github.com/lucag316/LucaFrancoGargiuloNicola-TP1-PROG4-2025-C1.git]*

-🔗 **Deploy en Vercel**: *[https://probando2.vercel.app/home]*

---

## 🛠️ Tecnologías utilizadas

### Lenguaje y Framework
- Angular 19
- TypeScript

### UI / Estilos
- HTML5 + CSS3
- Angular Forms (Template-Driven Forms)
- Bootstrap 5 / CSS / Angular Material 
- Font Awesome / Material Icons

### Funcionalidades y Librerías
- JWT (JSON Web Token)
- RxJS
- Angular Router
- Pipes y Directivas (`NgIf`, `NgFor`)
- Subida de archivos (`input type="file"`)
- Modales personalizados (no se usa `alert()`)

### Dev y Deploy
- Angular CLI
- Deploy en Vercel 
- Favicon personalizado

### Otros
- Git y GitHub
- Visual Studio Code
- Vercel (deploy)

---

## 🎯 Objetivo General

Desarrollar una aplicación web moderna, responsiva e interactiva utilizando Angular, que permita a los usuarios registrarse, iniciar sesión y participar en una red social con funcionalidades como realizar publicaciones, comentar, dar "me gusta", y gestionar su perfil personal. La interfaz debe proporcionar una experiencia de usuario intuitiva, con navegación fluida, validaciones en formularios y manejo adecuado de sesiones mediante tokens JWT, respetando buenas prácticas de diseño y seguridad.

---

## 🔧 Instalación

```bash
npm install
ng serve
```



## 🧑‍💼 Funcionalidades por Sprint

### 🟢 Sprint 1 (09/06)

#### Consigna: 
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

    - Registro: Formulario con los campos solicitados — nombre, apellido, correo, usuario, contraseña, repetir contraseña, fecha de nacimiento, descripción breve, campo para subir imagen de perfil y tipo de perfil.

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

