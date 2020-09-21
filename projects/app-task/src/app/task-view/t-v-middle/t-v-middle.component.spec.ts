import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVMiddleComponent } from './t-v-middle.component';

describe('TVMiddleComponent', () => {
  let component: TVMiddleComponent;
  let fixture: ComponentFixture<TVMiddleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TVMiddleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TVMiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
