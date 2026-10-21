@AGENTS.md

# Anaquel — reglas del proyecto

## Contexto

El contexto completo del producto, el modelo de datos y las fases están en `docs/PLAN.md`. Consúltalo antes de cualquier tarea de datos, backend o pantallas nuevas.

## Producto

Anaquel es una biblioteca personal para iOS y Android.

- Agregar libros escaneando el ISBN o a mano (solo el título es obligatorio).
- Cuentas de usuario y bibliotecas compartidas.
- Lista de deseos personal.
- Ubicación física de cada libro.
- Estados de lectura: Por leer, Leyendo, Leído, Abandonado.
- Debe funcionar sin internet.

## Stack

- Expo SDK 58 + Expo Router, TypeScript estricto.
- NativeWind para estilos.
- expo-sqlite + Drizzle para la base de datos local.
- Supabase como backend.
- Zustand para estado, TanStack Query para datos remotos.
- react-hook-form + zod para formularios y validación.
- i18next para textos.
- Gestor de paquetes: npm. Instala librerías con `npx expo install`.

## Estructura

```
src/app/        solo rutas (Expo Router)
src/features/   una carpeta por tema: src/features/<tema>/
src/db/         esquema local y migraciones
src/sync/       sincronización
src/services/   servicios (consulta de libros, exportar)
src/ui/         componentes y tema
src/i18n/       textos (es y en)
supabase/       backend
docs/           documentación del proyecto
```

## Diseño

- Tema claro por defecto, oscuro opcional.
- Usa solo los tokens de color de `src/ui/theme`. Nunca un color hex dentro de un componente.
- Tipografía: Literata para títulos, Figtree para el resto.
- Área táctil mínima de 44px.

## Textos

- Nunca escribas textos directo en una pantalla; siempre desde `src/i18n` (es y en).
- Español con tuteo.

## Forma de trabajar

- Muestra el plan antes de hacer cambios grandes.
- Haz cambios pequeños y enfocados.
- No instales librerías sin decírmelo antes.
- Nunca hagas commit si no te lo pido.
- Al terminar cada tarea, corre `npx tsc --noEmit` y `npx expo lint`.

## Seguridad

- Ninguna llave secreta en el código de la app.
- Las variables públicas van en `.env` con el prefijo `EXPO_PUBLIC_`.
- `.env` debe estar en `.gitignore`.
