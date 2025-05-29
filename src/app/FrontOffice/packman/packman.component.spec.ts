import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackmanComponent } from './packman.component';

describe('PackmanComponent', () => {
  let component: PackmanComponent;
  let fixture: ComponentFixture<PackmanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackmanComponent]
    });
    fixture = TestBed.createComponent(PackmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
