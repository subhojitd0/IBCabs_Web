import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirIndiaComponent } from "./airindia.component";

describe('AirIndiaComponent', () => {
  let component: AirIndiaComponent;
  let fixture: ComponentFixture<AirIndiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirIndiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirIndiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
