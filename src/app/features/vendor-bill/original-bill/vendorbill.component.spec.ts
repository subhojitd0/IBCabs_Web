import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginalVendorBillComponent } from "./vendorbill.component";

describe('OriginalVendorBillComponent', () => {
  let component: OriginalVendorBillComponent;
  let fixture: ComponentFixture<OriginalVendorBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OriginalVendorBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OriginalVendorBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
