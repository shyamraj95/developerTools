import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonFormatterComponent } from './json-formatter/json-formatter.component.js';
import { FileCompareComponent } from './file-compare/file-compare.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, JsonFormatterComponent,FileCompareComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'developerTools';
}
