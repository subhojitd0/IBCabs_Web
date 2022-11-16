import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillLComponent } from "./billL.component";

describe('BillLComponent', () => {
  let component: BillLComponent;
  let fixture: ComponentFixture<BillLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillLComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
