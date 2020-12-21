import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRentalDetailComponent } from './edit-rental-detail.component';

describe('PartyComponent', () => {
  let component: EditRentalDetailComponent;
  let fixture: ComponentFixture<EditRentalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRentalDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRentalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
