import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesineventsComponent } from './activitiesinevents.component';

describe('ActivitiesineventsComponent', () => {
  let component: ActivitiesineventsComponent;
  let fixture: ComponentFixture<ActivitiesineventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitiesineventsComponent]
    });
    fixture = TestBed.createComponent(ActivitiesineventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
