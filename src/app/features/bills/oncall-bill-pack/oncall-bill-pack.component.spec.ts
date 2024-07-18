import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OncallBillPackComponent } from './oncall-bill-pack.component';

describe('OncallBillPackComponent', () => {
  let component: OncallBillPackComponent;
  let fixture: ComponentFixture<OncallBillPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OncallBillPackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OncallBillPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
