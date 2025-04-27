import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JointeamComponent } from './jointeam.component';

describe('JointeamComponent', () => {
  let component: JointeamComponent;
  let fixture: ComponentFixture<JointeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JointeamComponent]
    });
    fixture = TestBed.createComponent(JointeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
