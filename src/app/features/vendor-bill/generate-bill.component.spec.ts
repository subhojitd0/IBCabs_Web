import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenarateVendorBillComponent } from './generate-bill.component';

describe('GenarateVendorBillComponent', () => {
  let component: GenarateVendorBillComponent;
  let fixture: ComponentFixture<GenarateVendorBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenarateVendorBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenarateVendorBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
