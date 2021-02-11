import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnCallBillAComponent } from "./oncall-a.component";

describe('MonthlyBillAComponent', () => {
  let component: OnCallBillAComponent;
  let fixture: ComponentFixture<OnCallBillAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnCallBillAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnCallBillAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
