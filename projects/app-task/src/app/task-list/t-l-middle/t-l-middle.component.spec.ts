import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TLMiddleComponent } from './t-l-middle.component';

describe('TLMiddleComponent', () => {
  let component: TLMiddleComponent;
  let fixture: ComponentFixture<TLMiddleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TLMiddleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TLMiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
