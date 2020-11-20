import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyRatesComponent } from './partyrates.component';

describe('PartyComponent', () => {
  let component: PartyRatesComponent;
  let fixture: ComponentFixture<PartyRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
