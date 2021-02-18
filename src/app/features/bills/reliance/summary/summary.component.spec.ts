import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelinceSummaryComponent } from "./summary.component";

describe('RelinceSummaryComponent', () => {
  let component: RelinceSummaryComponent;
  let fixture: ComponentFixture<RelinceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelinceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelinceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
