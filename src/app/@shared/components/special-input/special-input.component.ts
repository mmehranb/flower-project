import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'special-input',
  templateUrl: './special-input.component.html',
  styleUrls: ['./special-input.component.scss']
})
export class SpecialInputComponent implements OnInit {
  @Input() id: String;
  @Input() value: string;
  @Input() label: string;
  @Input() name: string;
  @Input() defaultValue: any;
  @Output() onChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  emitOnChange(e: any) {
    this.onChange.emit(e.target.value);
  }
}
