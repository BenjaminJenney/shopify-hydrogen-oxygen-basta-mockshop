import {initBasta} from '@bastaai/basta-admin-js';
import type {IBastaAdmin} from '@bastaai/basta-admin-js/types/sdk';

declare global {
  var __basta: IBastaAdmin;
}

if (!global.__basta) {
  global.__basta = initBasta({
    accountId: 'b8a7f554-30f2-415a-afbd-9e3fe5a033c9',
    secretKey: '3FVf91na-8UGNl2bTRGDt1DfNINLEvFyUpXa8GRiDyE=',
  });
}

export const basta = global.__basta;
