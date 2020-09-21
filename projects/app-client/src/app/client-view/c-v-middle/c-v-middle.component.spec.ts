import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CVMiddleComponent } from './c-v-middle.component';

describe('CVMiddleComponent', () => {
  let component: CVMiddleComponent;
  let fixture: ComponentFixture<CVMiddleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CVMiddleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CVMiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
