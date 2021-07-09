import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit {
  @Input() header: string;
  @Input() headerRoute: string;
  @Input() items: Array<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
