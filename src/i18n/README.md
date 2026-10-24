# i18n

Configuración de i18next y los textos de la app en español (`es.json`) y en inglés (`en.json`). Ninguna pantalla escribe textos directo; todos salen de aquí. Español con tuteo.

- Idioma: lo que elija la persona (Español, English o Sistema). Con "Sistema" se usa el idioma del teléfono y, si no es español ni inglés, español.
- La preferencia se guarda en el teléfono (`language-preference.ts`) y se lee antes del primer render.
- `es.json` es la referencia: `i18next.d.ts` hace que TypeScript marque como error una clave que no exista. Agrega cada texto nuevo en los dos archivos.
- En los componentes: `const { t } = useTranslation();` y `t('seccion.clave')`.
