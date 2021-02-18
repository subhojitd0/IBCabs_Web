import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelianceMISComponent } from "./mis.component";

describe('RelianceMISComponent', () => {
  let component: RelianceMISComponent;
  let fixture: ComponentFixture<RelianceMISComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelianceMISComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelianceMISComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
