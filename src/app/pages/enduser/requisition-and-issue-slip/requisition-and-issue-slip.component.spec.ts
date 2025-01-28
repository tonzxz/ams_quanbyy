import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionAndIssueSlipComponent } from './requisition-and-issue-slip.component';

describe('RequisitionAndIssueSlipComponent', () => {
  let component: RequisitionAndIssueSlipComponent;
  let fixture: ComponentFixture<RequisitionAndIssueSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequisitionAndIssueSlipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisitionAndIssueSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
