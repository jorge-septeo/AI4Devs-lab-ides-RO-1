# Herramientas

VSCode + Github Copilot + Agent Mode + Claude 3.7 Sonnet & Gemini 2.5 Pro

# Primer prompt: 


En base al readme del proyecto, prepara 3 prompts para poder conseguir desarrollar el front, back y bbdd teniendo en cuenta lo siguiente:

Esta es la historia de usuario que hay que trabajar:

Añadir Candidato al Sistema
Como reclutador,
Quiero tener la capacidad de añadir candidatos al sistema ATS,
Para que pueda gestionar sus datos y procesos de selección de manera eficiente.

Criterios de Aceptación:

Accesibilidad de la función: Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador.
Formulario de ingreso de datos: Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato como nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral.
Validación de datos: El formulario debe validar los datos ingresados para asegurar que son completos y correctos. Por ejemplo, el correo electrónico debe tener un formato válido y los campos obligatorios no deben estar vacíos.
Carga de documentos: El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX.
Confirmación de añadido: Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema.
Errores y manejo de excepciones: En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema.
Accesibilidad y compatibilidad: La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.
Notas:

La interfaz debe ser intuitiva y fácil de usar para minimizar el tiempo de entrenamiento necesario para los nuevos reclutadores.
Considerar la posibilidad de integrar funcionalidades de autocompletado para los campos de educación y experiencia laboral, basados en datos preexistentes en el sistema.
Tareas Técnicas:

Implementar la interfaz de usuario para el formulario de añadir candidato.
Desarrollar el backend necesario para procesar la información ingresada en el formulario.
Asegurar la seguridad y privacidad de los datos del candidato.


# Respuesta prompt:



Basándome en el README del proyecto y la historia de usuario para añadir candidatos al sistema, te prepararé tres prompts enfocados al desarrollo del frontend, backend y base de datos para esta funcionalidad. Estos prompts te ayudarán a abordar el desarrollo de manera estructurada.

## Prompt 1: Desarrollo del Frontend para la funcionalidad de Añadir Candidato

```
Necesito implementar una nueva funcionalidad en el frontend React de mi aplicación ATS (Sistema de Seguimiento de Talento) para añadir candidatos. 

Contexto técnico:
- La aplicación está desarrollada con React y TypeScript
- Utiliza Create React App como base
- El backend está en http://localhost:3010

Requisitos de la funcionalidad:
1. Crear un botón visible en el dashboard del reclutador para "Añadir Candidato"
2. Implementar un formulario con campos para:
   - Nombre y apellido
   - Correo electrónico (con validación)
   - Teléfono
   - Dirección
   - Educación (campos para institución, título y periodo)
   - Experiencia laboral (campos para empresa, cargo, periodo y descripción)
3. Añadir la funcionalidad para cargar un CV en formato PDF o DOCX
4. Implementar validaciones para todos los campos, especialmente para los obligatorios
5. Mostrar mensajes de confirmación tras añadir exitosamente un candidato
6. Implementar manejo de errores para mostrar mensajes adecuados
7. Asegurar que la interfaz sea intuitiva y responsive para diferentes dispositivos

Necesito ayuda específica con:
1. La estructura de componentes React para esta funcionalidad
2. La implementación de formularios con validación (preferiría usar React Hook Form o Formik)
3. El código para manejar la carga de archivos
4. La comunicación con el backend para enviar los datos (utilizando fetch o axios)
5. El manejo de estados para los mensajes de confirmación y errores

Por favor, proporciona ejemplos de código y estructura de archivos siguiendo las mejores prácticas para aplicaciones React con TypeScript.
```

## Prompt 2: Desarrollo del Backend para la funcionalidad de Añadir Candidato

```
Necesito desarrollar la API backend para una función de "Añadir Candidato" en mi sistema ATS (Sistema de Seguimiento de Talento). El backend está construido con Express, TypeScript y usa Prisma como ORM con PostgreSQL.

Contexto técnico:
- Backend en Express/Node.js con TypeScript
- ORM: Prisma conectado a PostgreSQL 
- Arquitectura actual basada en controladores y rutas
- Servidor ejecutándose en http://localhost:3010

Requisitos para la API:
1. Crear un endpoint POST para "/api/candidates" que reciba los datos del candidato
2. Implementar validaciones de datos en el backend
3. Manejar la carga y almacenamiento de archivos (CV en formato PDF/DOCX)
4. Diseñar la estructura de la base de datos para almacenar:
   - Datos personales (nombre, apellido, email, teléfono, dirección)
   - Información de educación (múltiples registros posibles)
   - Experiencia laboral (múltiples registros posibles)
   - Referencia al CV cargado (ruta de almacenamiento)
5. Implementar manejo de errores adecuado con respuestas HTTP apropiadas
6. Asegurar la seguridad de los datos (validación, sanitización)

Necesito ayuda específica con:
1. Definición del esquema de Prisma para las nuevas entidades
2. Implementación del controlador y rutas para la API
3. Validación de datos con bibliotecas como express-validator o joi
4. Manejo de archivos con multer o similar
5. Ejemplos de pruebas unitarias para esta funcionalidad

Por favor, proporciona el código necesario y las instrucciones para implementar esta funcionalidad, respetando las mejores prácticas para APIs RESTful.
```

## Prompt 3: Desarrollo de la Base de Datos para la funcionalidad de Añadir Candidato

```
Necesito diseñar e implementar el esquema de base de datos para almacenar información de candidatos en mi sistema ATS (Sistema de Seguimiento de Talento). El proyecto utiliza PostgreSQL con Prisma como ORM.

Contexto técnico:
- Base de datos PostgreSQL ejecutándose en Docker
- Prisma ORM para la definición del esquema y migraciones
- Conexión definida en el archivo .env del backend

Requisitos para el modelo de datos:
1. Crear el modelo de datos para "Candidate" con los siguientes campos:
   - ID (único)
   - Nombre y apellido
   - Correo electrónico (único)
   - Teléfono
   - Dirección (puede incluir múltiples campos como calle, ciudad, etc.)
   - Fecha de creación y actualización
   - Ruta de almacenamiento del CV

2. Crear modelos relacionados:
   - Educación: institución, título, periodo, relacionado con Candidate (uno a muchos)
   - Experiencia: empresa, cargo, periodo, descripción, relacionada con Candidate (uno a muchos)

3. Consideraciones específicas:
   - Necesito índices adecuados para búsquedas frecuentes (por ejemplo, búsqueda por email)
   - La estructura debe soportar futuras extensiones (como añadir etiquetas o estados)
   - Debo considerar la integridad referencial para cuando se elimine un candidato

Necesito ayuda específica con:
1. La definición del esquema en Prisma (schema.prisma)
2. Los comandos necesarios para generar y aplicar las migraciones
3. Estrategias para la gestión de datos y validación a nivel de base de datos
4. Consultas comunes que se necesitarán para esta funcionalidad

Por favor, proporciona el código necesario para el esquema de Prisma y ejemplos de cómo interactuar con estos modelos, así como los comandos para aplicar las migraciones.
```

Estos tres prompts están diseñados para abordar de manera integral el desarrollo de la funcionalidad de "Añadir Candidato" según la historia de usuario proporcionada. Cada uno está enfocado en una capa específica de la aplicación (frontend, backend y base de datos), siguiendo la estructura y tecnologías del proyecto que se describen en el README.

Utiliza estos prompts cuando estés listo para comenzar el desarrollo de cada componente. Puedes ajustarlos según sea necesario si tienes requerimientos específicos adicionales o si necesitas profundizar en algún aspecto particular de la implementación.

# Resto prompts

A partir de los 3 prompts el resto han sido iteraciones confirmando que vaya implementando lo que indica hasta que funcione. Cuando van saliendo errores, se los comparto para que arregle el problema y sigue implementando cambios hasta que se van haciendo pruebas de validación confirmando que funciona. Esto han sido bastantes prompts hasta poder llegar a una versión funcional