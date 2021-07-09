import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';

@Component({
  selector: 'switch-toggle',
  templateUrl: './switch-toggle.component.html',
  styleUrls: ['./switch-toggle.component.scss']
})
export class SwitchToggleComponent implements OnInit {
  @Input() activeToggle: any;
  @Input() disabled?:boolean = false
  @Output() toggleStatus: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  sendDataWithAlert() {
    if (!this.disabled) {
      this.activeToggle = !this.activeToggle;
      this.toggleStatus.emit(this.activeToggle);
    }
}
}
