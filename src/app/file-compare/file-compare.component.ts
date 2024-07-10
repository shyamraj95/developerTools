import { Component, AfterViewInit } from '@angular/core';
import { EditorState, StateEffect, StateField, RangeSetBuilder } from '@codemirror/state';
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType  } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import DiffMatchPatch, { DIFF_INSERT, DIFF_DELETE, DIFF_EQUAL } from 'diff-match-patch';


@Component({
  selector: 'app-file-compare',
  standalone: true,
  imports: [],
  templateUrl: './file-compare.component.html',
  styleUrl: './file-compare.component.scss'
})
export class FileCompareComponent implements AfterViewInit {
    private editor1!: EditorView;
  private editor2!: EditorView;
  private mergedEditor!: EditorView;
  private changes: [number, string][] = [];
  private currentChangeIndex = 0;

  ngAfterViewInit(): void {
    this.initializeEditors();
  }

  initializeEditors() {
    const editorConfig = {
      extensions: [basicSetup, javascript()]
    };

    this.editor1 = new EditorView({
      state: EditorState.create({
        doc: `// File 1 content\nfunction foo() {\n  return 'foo';\n}`,
        extensions: [...editorConfig.extensions, highlightPlugin]
      }),
      parent: document.getElementById('editor1')!
    });

    this.editor2 = new EditorView({
      state: EditorState.create({
        doc: `// File 2 content\nfunction foo() {\n  return 'bar';\n}`,
        extensions: [...editorConfig.extensions, highlightPlugin]
      }),
      parent: document.getElementById('editor2')!
    });

    this.mergedEditor = new EditorView({
      state: EditorState.create({
        doc: '',
        extensions: editorConfig.extensions
      }),
      parent: document.getElementById('editor-merged')!
    });

    this.compareFiles();
  }

  compareFiles() {
    const doc1 = this.editor1.state.doc.toString();
    const doc2 = this.editor2.state.doc.toString();

    const dmp = new DiffMatchPatch();
    this.changes = dmp.diff_main(doc1, doc2);
    dmp.diff_cleanupSemantic(this.changes);

    this.displayDiff(this.changes);
    this.highlightCurrentChange();
  }

  displayDiff(diffs: [number, string][]) {
    let mergedContent = '';

    diffs.forEach(([type, text]) => {
      if (type === DIFF_EQUAL) {
        mergedContent += text;
      } else if (type === DIFF_INSERT) {
        mergedContent += `<span class="insert">${text}</span>`;
      } else if (type === DIFF_DELETE) {
        mergedContent += `<span class="delete">${text}</span>`;
      }
    });

    this.mergedEditor.dispatch({
      changes: { from: 0, to: this.mergedEditor.state.doc.length, insert: mergedContent }
    });
  }

  mergeChange(diffIndex: number) {
    const selectedChange = this.changes[diffIndex];
    let mergedContent = '';

    this.changes.forEach(([type, text], index) => {
      if (index === diffIndex) {
        if (selectedChange[0] === DIFF_INSERT) {
          mergedContent += text;
        } else if (selectedChange[0] === DIFF_DELETE) {
          // skip
        } else if (selectedChange[0] === DIFF_EQUAL) {
          mergedContent += text;
        }
      } else {
        if (type === DIFF_EQUAL) {
          mergedContent += text;
        } else if (type === DIFF_INSERT) {
          mergedContent += `<span class="insert">${text}</span>`;
        } else if (type === DIFF_DELETE) {
          mergedContent += `<span class="delete">${text}</span>`;
        }
      }
    });

    this.mergedEditor.dispatch({
      changes: { from: 0, to: this.mergedEditor.state.doc.length, insert: mergedContent }
    });
  }

  nextChange() {
    if (this.currentChangeIndex < this.changes.length - 1) {
      this.currentChangeIndex++;
      this.highlightCurrentChange();
    }
  }

  previousChange() {
    if (this.currentChangeIndex > 0) {
      this.currentChangeIndex--;
      this.highlightCurrentChange();
    }
  }

  navigateToChange(index: number) {
    this.currentChangeIndex = index;
    this.highlightCurrentChange();
  }

  highlightCurrentChange() {
    const change = this.changes[this.currentChangeIndex];
    this.clearHighlights();
    if (change[0] === DIFF_INSERT) {
      this.highlight(this.editor2, change[1]);
    } else if (change[0] === DIFF_DELETE) {
      this.highlight(this.editor1, change[1]);
    }
  }

  clearHighlights() {
    this.clearEditorHighlights(this.editor1);
    this.clearEditorHighlights(this.editor2);
  }

  clearEditorHighlights(editor: EditorView) {
    editor.dispatch({
      effects: highlightEffect.of({ from: 0, to: editor.state.doc.length, add: Decoration.none })
    });
  }

  highlight(editor: EditorView, text: string) {
    const match = editor.state.doc.toString().indexOf(text);
    if (match !== -1) {
      const deco = Decoration.mark({ class: 'current-highlight' }).range(match, match + text.length);
      editor.dispatch({
        effects: highlightEffect.of({ from: match, to: match + text.length, add: Decoration.set([deco]) })
      });
    }
  }
}

// Define a StateEffect for managing highlights
const highlightEffect = StateEffect.define<{ from: number, to: number, add: DecorationSet }>();

// Define a StateField to store the decorations
const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    for (const effect of tr.effects) {
      if (effect.is(highlightEffect)) {
        const builder = new RangeSetBuilder<Decoration>();
        const { from, to, add } = effect.value as { from: number, to: number, add: DecorationSet };
        add.between(from, to, (from, to, deco) => builder.add(from, to, deco));
        decorations = decorations.update({
          add: builder.finish(),
          filter: from => from <= from && from < to
        });
      }
    }
    return decorations;
  },
  provide: f => EditorView.decorations.from(f)
});

// Create a plugin to handle highlights
const highlightPlugin = ViewPlugin.fromClass(class {
  constructor(readonly view: EditorView) {}

  update(update: ViewUpdate) {}
    // Add the state property
    state!: EditorState;
}, {
  decorations: v => v.state.field(highlightField)
});