import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBillComponent } from "./vendorbill.component";

describe('VendorBillComponent', () => {
  let component: VendorBillComponent;
  let fixture: ComponentFixture<VendorBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
