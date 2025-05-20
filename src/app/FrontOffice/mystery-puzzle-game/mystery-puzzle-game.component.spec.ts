import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysteryPuzzleGameComponent } from './mystery-puzzle-game.component';

describe('MysteryPuzzleGameComponent', () => {
  let component: MysteryPuzzleGameComponent;
  let fixture: ComponentFixture<MysteryPuzzleGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MysteryPuzzleGameComponent]
    });
    fixture = TestBed.createComponent(MysteryPuzzleGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
