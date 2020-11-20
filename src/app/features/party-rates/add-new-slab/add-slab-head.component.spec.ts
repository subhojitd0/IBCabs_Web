import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlabComponent } from './add-slab-head.component';

describe('PartyComponent', () => {
  let component: AddSlabComponent;
  let fixture: ComponentFixture<AddSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSlabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
