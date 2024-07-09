declare module 'codemirror' {
    import { Extension } from '@codemirror/state';
  export const basicSetup: Extension;
  }
  
  declare module '@codemirror/lang-json' {
    import { Extension } from '@codemirror/state';
    export function json(): Extension;
  }
  