import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLMiddleComponent } from './c-l-middle.component';

describe('CLMiddleComponent', () => {
  let component: CLMiddleComponent;
  let fixture: ComponentFixture<CLMiddleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CLMiddleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CLMiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
