import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverOTComponent } from './driverot.component';

describe('DriverOTComponent', () => {
  let component: DriverOTComponent;
  let fixture: ComponentFixture<DriverOTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverOTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverOTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
