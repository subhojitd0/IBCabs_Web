import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelianceJMSComponent } from "./jms.component";

describe('RelianceJMSComponent', () => {
  let component: RelianceJMSComponent;
  let fixture: ComponentFixture<RelianceJMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelianceJMSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelianceJMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
