declare module 'diff-match-patch' {
    export default class DiffMatchPatch {
      diff_main(text1: string, text2: string): [number, string][];
      diff_cleanupSemantic(diffs: [number, string][]): void;
    }
    export const DIFF_INSERT: number;
    export const DIFF_DELETE: number;
    export const DIFF_EQUAL: number;
  }