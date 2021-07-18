import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorSlabComponent } from './add-slab-head.component';

describe('AddVendorSlabComponent', () => {
  let component: AddVendorSlabComponent;
  let fixture: ComponentFixture<AddVendorSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVendorSlabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
