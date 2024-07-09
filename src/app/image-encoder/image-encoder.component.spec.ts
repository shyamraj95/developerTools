import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEncoderComponent } from './image-encoder.component';

describe('ImageEncoderComponent', () => {
  let component: ImageEncoderComponent;
  let fixture: ComponentFixture<ImageEncoderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageEncoderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageEncoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
