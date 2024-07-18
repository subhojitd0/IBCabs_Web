import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OncallBillSlabComponent } from './oncall-bill-slab.component';

describe('OncallBillSlabComponent', () => {
  let component: OncallBillSlabComponent;
  let fixture: ComponentFixture<OncallBillSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OncallBillSlabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OncallBillSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
