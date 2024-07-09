import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { json } from '@codemirror/lang-json';
import { basicSetup } from 'codemirror';
import { JsonFormatterService } from '../services/json-formatter.service.js';

interface JsonObject {
  [key: string]: any;
}

@Component({
  selector: 'app-json-formatter',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './json-formatter.component.html',
  styleUrl: './json-formatter.component.scss'
})
export class JsonFormatterComponent implements AfterViewInit {
  private inputEditor!: EditorView;
  private outputEditor!: EditorView;
  public errorMessage: string | null = null;
  myTheme = EditorView.theme({
    ".cm-content, .cm-gutter": { minHeight: "200px", textAlign: "left" },
    "&": { height: "300px" },
    ".cm-scroller": { overflow: "auto" }
    /*     "&": {
          color: "white",
          backgroundColor: "#034"
        },
        ".cm-content": {
          caretColor: "#0e9"
        },
        "&.cm-focused .cm-cursor": {
          borderLeftColor: "#0e9"
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
          backgroundColor: "#074"
        },
        ".cm-gutters": {
          backgroundColor: "#045",
          color: "#ddd",
          border: "none"
        } */
  }, { dark: true })
  constructor(private jsonBeautifyService: JsonFormatterService) { }

  ngAfterViewInit(): void {
    this.inputEditor = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, json()]
      }),
      parent: document.getElementById('inputPanel')!,
    });

    this.outputEditor = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, json(), this.myTheme]

      }),
      parent: document.getElementById('outputPanel')!,

    });

  }

  beautifyJson() {
    try {
      const rawJson = this.inputEditor.state.doc.toString();
      const formattedJson = this.jsonBeautifyService.beautifyJson(rawJson);
      this.outputEditor.dispatch({
        changes: { from: 0, to: this.outputEditor.state.doc.length, insert: formattedJson }
      });
      this.errorMessage = null;
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  minifyJson() {
    try {
      const rawJson = this.inputEditor.state.doc.toString();
      const minifiedJson = this.jsonBeautifyService.minifyJson(rawJson);
      this.outputEditor.dispatch({
        changes: { from: 0, to: this.outputEditor.state.doc.length, insert: minifiedJson }
      });
      this.errorMessage = null;
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  validateJson() {
    try {
      const rawJson = this.inputEditor.state.doc.toString();
      this.jsonBeautifyService.validateJson(rawJson);
      this.errorMessage = "JSON is valid!";
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}