import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillhComponent } from './billh.component';

describe('BillhComponent', () => {
  let component: BillhComponent;
  let fixture: ComponentFixture<BillhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
