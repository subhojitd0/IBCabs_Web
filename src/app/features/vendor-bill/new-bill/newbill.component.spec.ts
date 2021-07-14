import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVendorBillComponent } from './newbill.component';

describe('NewVendorBillComponent', () => {
  let component: NewVendorBillComponent;
  let fixture: ComponentFixture<NewVendorBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewVendorBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVendorBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
