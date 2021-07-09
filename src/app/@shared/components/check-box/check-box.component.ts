import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss']
})
export class CheckBoxComponent implements OnInit {
  @Input() form?: FormGroup;
  @Input() id: String;
  @Input() label: string;
  @Input() className: string;
  @Input() defaultValue: Boolean = false;
  @Output() isChange = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  emitOnChange(e: any) {
    this.isChange.emit(e.target.checked);
  }
}
