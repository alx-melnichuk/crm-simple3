import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLHeaderComponent } from './c-l-header.component';

describe('CLHeaderComponent', () => {
  let component: CLHeaderComponent;
  let fixture: ComponentFixture<CLHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CLHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CLHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
