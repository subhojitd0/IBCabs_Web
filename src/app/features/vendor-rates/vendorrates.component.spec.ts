import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRatesComponent } from './vendorrates.component';

describe('VendorRatesComponent', () => {
  let component: VendorRatesComponent;
  let fixture: ComponentFixture<VendorRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
