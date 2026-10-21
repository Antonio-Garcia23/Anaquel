# Plan — Anaquel, app de biblioteca personal

Copia del plan del proyecto para Claude Code (21 oct 2026). La versión viva está en el documento "Plan — Anaquel" en Claude; si algo cambia allá, se actualiza este archivo.

## Resumen y decisiones clave

La app se construye con Expo (React Native + TypeScript), Supabase como backend y una base SQLite en el teléfono para funcionar sin internet. No hay un servidor propio con una base de libros: los datos se consultan por ISBN en APIs públicas gratuitas y se guardan en caché.

- **Plataforma:** un solo código para Android e iOS con Expo.
- **Datos de libros:** Google Books como fuente principal y Open Library como respaldo, ambos consultados desde una Edge Function de Supabase que guarda cada resultado. Con el tiempo eso se vuelve un catálogo propio, valioso para libros latinoamericanos.
- **Cuentas y bibliotecas compartidas:** Supabase Auth + Postgres con seguridad por fila (RLS) y roles por biblioteca.
- **Sin internet:** la app siempre lee y escribe en la base local y sincroniza cuando vuelve la conexión.
- **Idiomas:** español por defecto e inglés desde el primer día.
- **Versión 1 (MVP):** escanear, agregar manual con sugerencias, foto de portada, editar, estados de lectura, lista de deseos, ubicación física, búsqueda y filtros, bibliotecas compartidas y exportar.
- **Después:** estadísticas, préstamos, colecciones propias e integraciones de compra.
- Goodreads cerró su API pública en 2020: no hay integración posible con Goodreads.

## Stack tecnológico

| Capa           | Tecnología                                                         | Por qué                                                    |
| -------------- | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| App            | Expo SDK 58 (React Native 0.88), TypeScript estricto               | Un código para ambos sistemas; builds en la nube con EAS   |
| Navegación     | Expo Router, rutas en `src/app/`                                   | Rutas por archivos                                         |
| Escáner        | expo-camera (CameraView, códigos EAN-13)                           | Lee el código de barras del ISBN sin librerías extra       |
| Portadas       | expo-image-picker + expo-image-manipulator + expo-image            | Foto, recorte y compresión; caché de imágenes              |
| Base local     | expo-sqlite + Drizzle ORM                                          | Consultas y filtros rápidos sin internet                   |
| Sincronización | PowerSync (recomendado) o Legend-State; se decide en la fase 3     | Sube y baja cambios con Supabase cuando hay conexión       |
| Estado         | Zustand (interfaz) y TanStack Query (búsquedas en línea)           | Simples y conocidos                                        |
| Formularios    | react-hook-form + zod                                              | Validación del formulario manual (solo título obligatorio) |
| Estilos        | NativeWind (Tailwind)                                              | Tokens de color y modo oscuro centralizados                |
| Backend        | Supabase: Auth, Postgres, Storage, Edge Functions                  | Cuentas, datos compartidos, portadas y proxy de APIs       |
| Idiomas        | i18next + expo-localization                                        | Español e inglés                                           |
| Errores        | Sentry (plan gratuito)                                             | Ver fallos reales en los teléfonos                         |
| Pruebas        | Jest + React Native Testing Library; Maestro para flujos completos | Evitar regresiones                                         |
| Publicación    | EAS Build, EAS Submit, EAS Update                                  | Compilar, subir a las tiendas y enviar actualizaciones     |

Se usa un development build en lugar de Expo Go, porque la base local y la sincronización necesitan módulos nativos. Gestor de paquetes: npm (instalar con `npx expo install`).

Identificador de la app (iOS y Android): `com.antoniogarcia.anaquel`. Es permanente: no cambiarlo.

## Datos de libros: escaneo y búsqueda

**Qué pasa al escanear:**

1. La cámara lee el código EAN-13. Los libros usan prefijo 978 o 979; la app valida el dígito de control y descarta otros códigos.
2. Busca el ISBN en la biblioteca local y avisa si ya está.
3. Consulta el catálogo en caché de Supabase (`catalog_books`).
4. Si no está, la Edge Function `book-lookup` consulta Google Books y luego Open Library, combina datos y guarda el resultado.
5. Si nadie lo tiene, abre el formulario manual con el ISBN ya llenado.
6. Sin internet, abre el formulario manual y marca el libro como "por completar" para buscarlo después.

**Al agregar por título:** mientras el usuario escribe, la app sugiere resultados en línea (con debounce de unos 300 ms para no gastar cuota). Si elige uno, llena los campos; si no, guarda solo lo escrito. Sin internet solo busca en la biblioteca local.

| Fuente                              | Costo             | Límites                                           | Rol                                       |
| ----------------------------------- | ----------------- | ------------------------------------------------- | ----------------------------------------- |
| Catálogo propio (caché en Supabase) | Incluido          | Sin límite práctico                               | Primera consulta; crece con cada búsqueda |
| Google Books API                    | Gratis            | Cuota por defecto de unas 1.000 consultas diarias | Fuente principal y sugerencias por título |
| Open Library                        | Gratis, sin llave | Uso moderado, identificándose con User-Agent      | Respaldo y portadas                       |
| ISBNdb                              | Pago              | 1 consulta por segundo en el plan básico          | Opcional al escalar                       |
| Hardcover API                       | Gratis            | 5.000 consultas diarias                           | Posible integración futura                |

Las APIs externas se llaman desde la Edge Function, nunca desde el teléfono: así la llave de Google no queda dentro de la app y la caché reduce el consumo de cuota.

Muchas ediciones latinoamericanas pequeñas no estarán en ninguna fuente. Por eso el formulario manual y la foto de portada son parte del flujo principal, no un plan B.

## Arquitectura

La app es offline-first: las pantallas nunca esperan a internet, porque leen y escriben en la base local, y la sincronización se encarga de la nube.

```
TELÉFONO                         SUPABASE (nube)                 APIs EXTERNAS
Pantallas (Expo Router)  ──────▶ Auth (correo, Google, Apple)
Estado (Zustand, TanStack) ────▶ Edge Function book-lookup ────▶ Google Books
Base local SQLite (Drizzle)        │  guarda en caché       ────▶ Open Library
  ▲ lee y escribe siempre aquí     ▼
Sincronización ◀───────────────▶ Postgres + RLS (bibliotecas, libros, caché)
Sincronización ────────────────▶ Storage (fotos de portadas)
```

**Motor de sincronización (se decide en la fase 3):** PowerSync da SQLite real en el teléfono y reglas de qué datos baja cada usuario, ideal para bibliotecas compartidas y para filtrar más de 1.000 libros sin conexión; requiere más configuración inicial. Legend-State tiene plugin de Supabase y menos código, pero los filtros complejos sin internet son más limitados. Recomendación: PowerSync.

**Estructura de carpetas:**

```
src/app/        rutas (Expo Router)
src/features/   books, scanner, libraries, auth, wishlist
src/db/         esquema local y migraciones
src/sync/       sincronización
src/services/   consulta de libros, exportar
src/ui/         componentes y tokens de diseño
src/i18n/       es.json, en.json
supabase/       migraciones SQL y Edge Functions
docs/PLAN.md    este plan
CLAUDE.md       reglas del proyecto para Claude Code
```

## Modelo de datos

La clave es separar el catálogo global (datos del libro) de los ejemplares de cada biblioteca, y el estado de lectura de cada persona.

| Tabla             | Campos clave                                                                                              | Para qué                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `profiles`        | id, nombre, idioma preferido                                                                              | Datos del usuario                                                       |
| `libraries`       | id, nombre, owner_id                                                                                      | Cada biblioteca (personal o compartida)                                 |
| `library_members` | library_id, user_id, rol (dueño, editor, lector)                                                          | Quién ve y quién edita cada biblioteca                                  |
| `library_invites` | library_id, código, rol, vence                                                                            | Invitar por enlace o código                                             |
| `catalog_books`   | isbn13, título, autores, editorial, año, páginas, idioma, portada, fuente                                 | Caché global de datos consultados                                       |
| `books`           | id, library_id, título (obligatorio), autores, año, isbn, páginas, géneros, portada, ubicación, eliminado | Cada ejemplar en una biblioteca                                         |
| `wishlist_items`  | id, user_id, título (obligatorio), autores, isbn, portada, notas, eliminado                               | Lista de deseos personal; al comprar el libro se mueve a una biblioteca |
| `reading_status`  | user_id, book_id, estado (por leer, leyendo, leído, abandonado), fechas                                   | El estado es de cada persona, aunque la biblioteca sea compartida       |
| `locations`       | id, library_id, nombre, ubicación padre                                                                   | Ubicación física anidada: casa → sala → estante 2                       |

Todas las tablas llevan `created_at`, `updated_at` y `deleted_at`. El borrado es suave (se marca, no se elimina) para que la sincronización no pierda cambios hechos sin internet. La lista de deseos es personal de cada usuario, separada de las bibliotecas compartidas.

## Diseño de interfaz

Sistema de diseño "Anaquel" (paleta Tinta y papel). Las portadas son el único color fuerte; la interfaz es neutra con un solo acento terracota.

- **Tema:** claro por defecto; oscuro opcional en Ajustes (Claro, Oscuro, Sistema).
- **Tipografía:** Literata (serif) para títulos; Figtree (sans) para la interfaz.
- **Biblioteca:** cuadrícula de 3 columnas de portadas 2:3, con opción de cambiar a lista.
- **Portadas:** foto subida por el usuario → portada de Google Books u Open Library → portada generada (título y autor en blanco sobre un color `cover-1` a `cover-6` elegido con un hash estable del título).
- **Navegación:** barra inferior con Biblioteca, Buscar, Escanear (botón circular terracota de 52px, dentro de la barra, sin sobresalir), Deseos y Perfil.
- **Íconos:** Lucide, trazo 1.75, 22px.
- **Logotipo:** A caligráfica ancha, terracota.

| Token                 | Claro   | Oscuro  |
| --------------------- | ------- | ------- |
| bg                    | #F4F1EA | #121417 |
| surface               | #FBF9F4 | #1C1F24 |
| surface-raised        | #FFFFFF | #262A30 |
| border                | #D8D1C4 | #2E333A |
| border-strong         | #8C8578 | #646A73 |
| text                  | #1C1F24 | #F2EFEA |
| text-muted            | #66615A | #A19C94 |
| accent                | #A84B1A | #E07A3F |
| on-accent             | #FFFFFF | #121417 |
| teal (estado "Leído") | #2F6F68 | #56A89D |
| on-teal               | #FFFFFF | #121417 |
| danger                | #B42318 | #F07470 |

Portadas generadas (iguales en ambos temas): cover-1 #7A2E2E, cover-2 #2F4F6F, cover-3 #7D6636, cover-4 #3E6B5A, cover-5 #5B3F6E, cover-6 #A8552F. Espaciado 4, 8, 12, 16, 24, 32. Radios: cover 3, md 10, lg 18, pill 999. Área táctil mínima 44px.

**Pantallas de la versión 1:** bienvenida e inicio de sesión; biblioteca (cuadrícula y lista); escáner; agregar manual con sugerencias y foto de portada; detalle y edición del libro; búsqueda y filtros (estado, género, ubicación, año); lista de deseos; ubicaciones; bibliotecas compartidas e invitaciones; ajustes (idioma, tema, exportar, cerrar sesión, eliminar cuenta). También: estados vacíos, carga, error y aviso de "sin conexión".

Referencias visuales: sistema de diseño https://claude.ai/artifact/Hc3hS2nJJbMjxjcYbyBZfY y pantallas https://claude.ai/artifact/3KFBehpimSqyJDeHmwTuHk (el usuario puede pegar capturas al construir cada pantalla).

## Requisitos transversales

- **Inicio de sesión:** correo con enlace mágico, Google y Sign in with Apple (Apple exige una opción equivalente si se ofrece Google).
- **Eliminar cuenta dentro de la app:** obligatorio en App Store; desactivar no basta, y con Sign in with Apple hay que revocar el token.
- **Privacidad:** política publicada en una URL, etiquetas de privacidad en App Store y sección de seguridad de datos en Google Play.
- **Permisos:** textos claros en español e inglés para cámara y fotos; si el usuario niega la cámara, la app sigue funcionando con el formulario manual.
- **Seguridad:** RLS en todas las tablas; ninguna llave secreta dentro de la app.
- **Conflictos al sincronizar:** gana el último cambio por campo; borrado suave.
- **Idiomas:** todos los textos en `src/i18n` (es y en), nunca escritos directo en las pantallas.
- **Accesibilidad:** tamaño de texto dinámico, etiquetas para lectores de pantalla y contraste suficiente.
- **Calidad:** TypeScript estricto, ESLint, pruebas de la lógica de ISBN y de sincronización, Sentry.
- **Backend:** el plan gratuito de Supabase no tiene respaldos y pausa el proyecto tras 7 días sin actividad; antes de publicar conviene el plan Pro.
- **Exportar:** CSV y JSON; más adelante, importar el CSV que exporta Goodreads.
- **Actualizaciones:** EAS Update para corregir errores de JavaScript sin pasar por revisión de tienda.

## Monetización (futuro)

Enlaces de afiliado de Buscalibre (y otros) en la lista de deseos; posible versión Pro con funciones extra; integración con Hardcover como alternativa a Goodreads; importar el CSV de Goodreads. Los libros físicos se compran fuera de la app, así que no pasan por el sistema de pagos de las tiendas.

## Fases

1. **Fase 0 — Definición.** Hecha.
2. **Fase 1 — Diseño.** Hecha.
3. **Fase 2 — Preparar el proyecto.** Proyecto Expo, CLAUDE.md, estructura, ESLint y Prettier, sistema de diseño en código, i18n, development build en ambos teléfonos, repositorio privado en GitHub. _(en curso)_
4. **Fase 3 — Backend en Supabase.** Proyecto, esquema con migraciones versionadas, RLS, Auth y Storage para portadas; elegir motor de sincronización.
5. **Fase 4 — Base local y sincronización.** SQLite con Drizzle, sincronización y prueba en modo avión.
6. **Fase 5 — Núcleo de la biblioteca.** Cuadrícula y lista, agregar manual (solo título obligatorio), detalle, editar y eliminar.
7. **Fase 6 — Escáner y búsqueda en línea.** Cámara, Edge Function con caché, sugerencias por título, foto de portada y formulario de respaldo.
8. **Fase 7 — Organización.** Estados de lectura, lista de deseos, ubicaciones, géneros, búsqueda y filtros.
9. **Fase 8 — Bibliotecas compartidas.** Invitaciones por enlace o código, roles y cambiar de biblioteca.
10. **Fase 9 — Pulido.** Exportar CSV, español e inglés completos, ajustes, eliminar cuenta, accesibilidad, estados vacíos.
11. **Fase 10 — Calidad y uso real.** Pruebas, Sentry, rendimiento con más de 1.000 libros y uso real durante dos o tres semanas.
12. **Fase 11 — Publicación.** Cuentas de desarrollador, política de privacidad, TestFlight, prueba cerrada en Google Play y fichas de tienda.

Forma de trabajo: una tarea pequeña por prompt, plan antes de escribir código, probar en el teléfono y commit al terminar cada tarea.
