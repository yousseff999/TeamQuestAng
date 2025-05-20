import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndercoverGameComponent } from './undercover-game.component';

describe('UndercoverGameComponent', () => {
  let component: UndercoverGameComponent;
  let fixture: ComponentFixture<UndercoverGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UndercoverGameComponent]
    });
    fixture = TestBed.createComponent(UndercoverGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
