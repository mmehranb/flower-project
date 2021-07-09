import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  dialogData: any;

  constructor(private ngxSmartModalService: NgxSmartModalService) {
    this.dialogData = this.ngxSmartModalService.getModalData('confirmation');
  }

  ngOnInit(): void {
  }

  confirmationAction(accept: boolean) {
    this.ngxSmartModalService.setModalData(accept, 'confirmation', true);
    this.ngxSmartModalService.close('confirmation');
  }
}
