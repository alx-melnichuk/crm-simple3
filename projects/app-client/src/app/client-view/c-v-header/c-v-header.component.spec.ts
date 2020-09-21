import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CVHeaderComponent } from './c-v-header.component';

describe('CVHeaderComponent', () => {
  let component: CVHeaderComponent;
  let fixture: ComponentFixture<CVHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CVHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CVHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
