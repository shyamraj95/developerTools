import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Base64DecoderComponent } from './base64-decoder.component';

describe('Base64DecoderComponent', () => {
  let component: Base64DecoderComponent;
  let fixture: ComponentFixture<Base64DecoderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Base64DecoderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Base64DecoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
