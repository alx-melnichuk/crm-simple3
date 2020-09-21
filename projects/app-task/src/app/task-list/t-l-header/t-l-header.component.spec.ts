import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TLHeaderComponent } from './t-l-header.component';

describe('TLHeaderComponent', () => {
  let component: TLHeaderComponent;
  let fixture: ComponentFixture<TLHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TLHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TLHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
