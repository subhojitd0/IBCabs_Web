import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoalIndexComponent } from "./coalindex.component";

describe('RelinceSummaryComponent', () => {
  let component: CoalIndexComponent;
  let fixture: ComponentFixture<CoalIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoalIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoalIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
