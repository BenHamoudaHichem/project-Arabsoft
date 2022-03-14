import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFileMaterialsComponent } from './add-file-materials.component';

describe('AddFileMaterialsComponent', () => {
  let component: AddFileMaterialsComponent;
  let fixture: ComponentFixture<AddFileMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFileMaterialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFileMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
