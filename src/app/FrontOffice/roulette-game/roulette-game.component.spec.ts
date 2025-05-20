import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouletteGameComponent } from './roulette-game.component';

describe('RouletteGameComponent', () => {
  let component: RouletteGameComponent;
  let fixture: ComponentFixture<RouletteGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouletteGameComponent]
    });
    fixture = TestBed.createComponent(RouletteGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
