import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlldefiComponent } from './alldefi.component';

describe('AlldefiComponent', () => {
  let component: AlldefiComponent;
  let fixture: ComponentFixture<AlldefiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlldefiComponent]
    });
    fixture = TestBed.createComponent(AlldefiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
