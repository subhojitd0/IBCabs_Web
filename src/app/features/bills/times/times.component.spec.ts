import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesBillComponent } from "./times.component";

describe('TimesComponent', () => {
  let component: TimesBillComponent;
  let fixture: ComponentFixture<TimesBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
