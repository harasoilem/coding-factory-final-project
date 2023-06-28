import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientReportPageComponent } from './patient-report-page.component';

describe('PatientReportPageComponent', () => {
  let component: PatientReportPageComponent;
  let fixture: ComponentFixture<PatientReportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientReportPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
