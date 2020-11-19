import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartyHeadComponent } from './add-party-head.component';

describe('PartyComponent', () => {
  let component: AddPartyHeadComponent;
  let fixture: ComponentFixture<AddPartyHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPartyHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPartyHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
