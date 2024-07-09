import { Injectable } from '@angular/core';
import { parse, ParseError } from 'jsonc-parser';
interface JsonObject {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class JsonFormatterService {
  beautifyJson(rawJson: string): string {
    try {
      const jsonValue = JSON.parse(rawJson);
      return JSON.stringify(jsonValue, null, 2);
    } catch (e: any) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }
  }

  minifyJson(rawJson: string): string {
    try {
      const jsonValue = JSON.parse(rawJson);
      return JSON.stringify(jsonValue);
    } catch (e: any) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }
  }

  validateJson(rawJson: string): void {
    const errors: ParseError[] = [];
    parse(rawJson, errors);
    if (errors.length > 0) {
      const errorMessages = errors.map(error => {
        const { line, character } = this.getLineAndCharacter(rawJson, error.offset);
        return `Error at line ${line}, column ${character}: ${error.error}`;
      });
      throw new Error(errorMessages.join('\n'));
    }
  }

  private getLineAndCharacter(text: string, offset: number): { line: number; character: number } {
    const lines = text.substring(0, offset).split('\n');
    const line = lines.length;
    const character = lines[line - 1].length + 1;
    return { line, character };
  }
}
