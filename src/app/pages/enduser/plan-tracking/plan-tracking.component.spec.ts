import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTrackingComponent } from './plan-tracking.component';

describe('PlanTrackingComponent', () => {
  let component: PlanTrackingComponent;
  let fixture: ComponentFixture<PlanTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
