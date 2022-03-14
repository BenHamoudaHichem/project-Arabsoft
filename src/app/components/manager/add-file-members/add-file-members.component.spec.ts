import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFileMembersComponent } from './add-file-members.component';

describe('AddFileMembersComponent', () => {
  let component: AddFileMembersComponent;
  let fixture: ComponentFixture<AddFileMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFileMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFileMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
