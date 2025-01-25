import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompileReportsComponent } from './compile-reports.component';

describe('CompileReportsComponent', () => {
  let component: CompileReportsComponent;
  let fixture: ComponentFixture<CompileReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompileReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompileReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
