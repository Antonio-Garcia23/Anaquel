import 'i18next';

import type es from './es.json';

// Las claves de es.json son el contrato: t('clave.que.no.existe') no compila.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof es;
    };
  }
}
