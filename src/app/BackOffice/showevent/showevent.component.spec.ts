import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoweventComponent } from './showevent.component';

describe('ShoweventComponent', () => {
  let component: ShoweventComponent;
  let fixture: ComponentFixture<ShoweventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShoweventComponent]
    });
    fixture = TestBed.createComponent(ShoweventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
