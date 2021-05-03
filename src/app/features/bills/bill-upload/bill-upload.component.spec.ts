import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillUploadComponent } from './bill-upload.component';

describe('BillUploadComponent', () => {
  let component: BillUploadComponent;
  let fixture: ComponentFixture<BillUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
