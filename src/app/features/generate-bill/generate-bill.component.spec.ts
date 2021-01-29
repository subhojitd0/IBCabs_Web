import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenarateBillComponent } from './generate-bill.component';

describe('GenarateBillComponent', () => {
  let component: GenarateBillComponent;
  let fixture: ComponentFixture<GenarateBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenarateBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenarateBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
