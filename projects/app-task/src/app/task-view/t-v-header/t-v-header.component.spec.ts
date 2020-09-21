import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVHeaderComponent } from './t-v-header.component';

describe('TVHeaderComponent', () => {
  let component: TVHeaderComponent;
  let fixture: ComponentFixture<TVHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TVHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TVHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
