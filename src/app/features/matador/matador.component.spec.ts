import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatadorComponent } from './matador.component';

describe('MatadorComponent', () => {
  let component: MatadorComponent;
  let fixture: ComponentFixture<MatadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
