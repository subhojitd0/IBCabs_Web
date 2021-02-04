import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedBillComponent } from './advancedbill.component';

describe('AdvancedBillComponent', () => {
  let component: AdvancedBillComponent;
  let fixture: ComponentFixture<AdvancedBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
