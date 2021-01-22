import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalDetailWalkinComponent } from './rental-detail-walkin.component';

describe('PartyComponent', () => {
  let component: RentalDetailWalkinComponent;
  let fixture: ComponentFixture<RentalDetailWalkinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalDetailWalkinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalDetailWalkinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
