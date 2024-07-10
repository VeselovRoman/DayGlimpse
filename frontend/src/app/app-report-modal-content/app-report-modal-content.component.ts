import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Report } from '../_models/report';

@Component({
  selector: 'app-report-modal-content',
  templateUrl: './app-report-modal-content.component.html',
  styleUrls: ['./app-report-modal-content.component.css']
})

export class ReportModalContentComponent {
  @Input() report!: Report;

  constructor(public activeModal: NgbActiveModal) {}
}
