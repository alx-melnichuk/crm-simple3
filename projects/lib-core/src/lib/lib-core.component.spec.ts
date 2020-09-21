import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibCoreComponent } from './lib-core.component';

describe('LibCoreComponent', () => {
  let component: LibCoreComponent;
  let fixture: ComponentFixture<LibCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibCoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
