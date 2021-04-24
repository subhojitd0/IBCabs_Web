import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRightComponent } from './user-right.component';

describe('UserRightComponent', () => {
  let component: UserRightComponent;
  let fixture: ComponentFixture<UserRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
