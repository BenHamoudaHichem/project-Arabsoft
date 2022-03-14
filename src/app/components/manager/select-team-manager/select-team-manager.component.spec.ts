import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTeamManagerComponent } from './select-team-manager.component';

describe('SelectTeamManagerComponent', () => {
  let component: SelectTeamManagerComponent;
  let fixture: ComponentFixture<SelectTeamManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectTeamManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTeamManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
