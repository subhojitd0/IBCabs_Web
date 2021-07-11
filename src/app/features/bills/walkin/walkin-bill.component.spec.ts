import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkinBillComponent } from "./walkin-bill.component";

describe('WalkinBillComponent', () => {
  let component: WalkinBillComponent;
  let fixture: ComponentFixture<WalkinBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalkinBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkinBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
