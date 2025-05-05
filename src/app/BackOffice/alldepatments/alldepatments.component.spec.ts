import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlldepatmentsComponent } from './alldepatments.component';

describe('AlldepatmentsComponent', () => {
  let component: AlldepatmentsComponent;
  let fixture: ComponentFixture<AlldepatmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlldepatmentsComponent]
    });
    fixture = TestBed.createComponent(AlldepatmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
