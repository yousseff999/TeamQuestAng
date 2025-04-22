import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddusertoeventComponent } from './addusertoevent.component';

describe('AddusertoeventComponent', () => {
  let component: AddusertoeventComponent;
  let fixture: ComponentFixture<AddusertoeventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddusertoeventComponent]
    });
    fixture = TestBed.createComponent(AddusertoeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
