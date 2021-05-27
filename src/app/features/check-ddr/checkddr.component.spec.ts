import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDdrComponent } from './checkddr.component';

describe('CheckDdrComponent', () => {
  let component: CheckDdrComponent;
  let fixture: ComponentFixture<CheckDdrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckDdrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckDdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
