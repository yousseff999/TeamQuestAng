import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamcreationComponent } from './teamcreation.component';

describe('TeamcreationComponent', () => {
  let component: TeamcreationComponent;
  let fixture: ComponentFixture<TeamcreationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamcreationComponent]
    });
    fixture = TestBed.createComponent(TeamcreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
