import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyContractAComponent } from './monthly-contract-a.component';

describe('MonthlyContractAComponent', () => {
  let component: MonthlyContractAComponent;
  let fixture: ComponentFixture<MonthlyContractAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyContractAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyContractAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
