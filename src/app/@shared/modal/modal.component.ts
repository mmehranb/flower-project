import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'modal-template',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit,  AfterContentInit{
  @Input() isCentralDialog?: Boolean = false;
  @Input() headerTitle: string;
  @Input() dialogDesc: string;
  @Input() dialogClass: string;
  @Input() disableToRemove: boolean = false; 

  constructor(private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    console.log(this.ngxSmartModalService.getHigherIndex());
  }

  ngAfterContentInit() {
    this.ngxSmartModalService.getModalStack().map(item => {  
      item.modal.onOpenFinished.subscribe((modal: NgxSmartModalComponent) => {
        modal.addCustomClass('active');
      })
      item.modal.onAnyCloseEvent.subscribe((modal: NgxSmartModalComponent) => {
        modal.removeCustomClass('active');
      })
    })

    this.ngxSmartModalService.getTopOpenedModal().onAnyCloseEventFinished.subscribe((modal: NgxSmartModalComponent) => {
      this.ngxSmartModalService.resetModalData(modal.identifier);
      if (!this.disableToRemove) {
        this.ngxSmartModalService.removeModal(modal.identifier);
      }
    })
  }

  closeModal() {
    const id = this.ngxSmartModalService.getTopOpenedModal().identifier;
    this.ngxSmartModalService.resetModalData(id);
    this.ngxSmartModalService.close(id);
  }
}
