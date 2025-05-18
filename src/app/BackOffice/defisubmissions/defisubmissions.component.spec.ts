import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefisubmissionsComponent } from './defisubmissions.component';

describe('DefisubmissionsComponent', () => {
  let component: DefisubmissionsComponent;
  let fixture: ComponentFixture<DefisubmissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefisubmissionsComponent]
    });
    fixture = TestBed.createComponent(DefisubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
