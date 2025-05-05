import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllactivitiesComponent } from './allactivities.component';

describe('AllactivitiesComponent', () => {
  let component: AllactivitiesComponent;
  let fixture: ComponentFixture<AllactivitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllactivitiesComponent]
    });
    fixture = TestBed.createComponent(AllactivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
