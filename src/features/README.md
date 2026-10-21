# features

Una carpeta por tema del producto: `src/features/<tema>/` (por ejemplo `books`, `scanner`, `libraries`, `auth`, `wishlist`).

Cada tema agrupa sus componentes, hooks, estado (Zustand), consultas (TanStack Query) y formularios (react-hook-form + zod). Las rutas no van aquí; van en `src/app/` e importan desde aquí.
