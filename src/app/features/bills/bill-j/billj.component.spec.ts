import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillJComponent } from "./billj.component";

describe('BillJComponent', () => {
  let component: BillJComponent;
  let fixture: ComponentFixture<BillJComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillJComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
