import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyBillAComponent } from './monthly-a.component';

describe('MonthlyBillAComponent', () => {
  let component: MonthlyBillAComponent;
  let fixture: ComponentFixture<MonthlyBillAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyBillAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyBillAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
