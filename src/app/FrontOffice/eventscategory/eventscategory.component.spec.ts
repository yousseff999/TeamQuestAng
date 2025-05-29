import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventscategoryComponent } from './eventscategory.component';

describe('EventscategoryComponent', () => {
  let component: EventscategoryComponent;
  let fixture: ComponentFixture<EventscategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventscategoryComponent]
    });
    fixture = TestBed.createComponent(EventscategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
