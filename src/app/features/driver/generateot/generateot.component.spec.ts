import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateOTComponent } from './generateot.component';

describe('GenerateOTComponent', () => {
  let component: GenerateOTComponent;
  let fixture: ComponentFixture<GenerateOTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateOTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateOTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
