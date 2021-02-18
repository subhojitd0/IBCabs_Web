import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoalIndiaComponent } from "./coalindia.component";

describe('CoalIndiaComponent', () => {
  let component: CoalIndiaComponent;
  let fixture: ComponentFixture<CoalIndiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoalIndiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoalIndiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
