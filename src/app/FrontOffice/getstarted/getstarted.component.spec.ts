import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetstartedComponent } from './getstarted.component';

describe('GetstartedComponent', () => {
  let component: GetstartedComponent;
  let fixture: ComponentFixture<GetstartedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetstartedComponent]
    });
    fixture = TestBed.createComponent(GetstartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
