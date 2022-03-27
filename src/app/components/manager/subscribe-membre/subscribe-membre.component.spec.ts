import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeMembreComponent } from './subscribe-membre.component';

describe('SubscribeMembreComponent', () => {
  let component: SubscribeMembreComponent;
  let fixture: ComponentFixture<SubscribeMembreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribeMembreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeMembreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
