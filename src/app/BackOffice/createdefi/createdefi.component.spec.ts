import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedefiComponent } from './createdefi.component';

describe('CreatedefiComponent', () => {
  let component: CreatedefiComponent;
  let fixture: ComponentFixture<CreatedefiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatedefiComponent]
    });
    fixture = TestBed.createComponent(CreatedefiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
