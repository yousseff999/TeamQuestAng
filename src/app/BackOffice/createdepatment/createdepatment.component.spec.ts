import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedepatmentComponent } from './createdepatment.component';

describe('CreatedepatmentComponent', () => {
  let component: CreatedepatmentComponent;
  let fixture: ComponentFixture<CreatedepatmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatedepatmentComponent]
    });
    fixture = TestBed.createComponent(CreatedepatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
