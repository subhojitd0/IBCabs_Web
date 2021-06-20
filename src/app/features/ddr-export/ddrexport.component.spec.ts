import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DDRExportComponent } from './ddrexport.component';

describe('DDRExportComponent', () => {
  let component: DDRExportComponent;
  let fixture: ComponentFixture<DDRExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DDRExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DDRExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
