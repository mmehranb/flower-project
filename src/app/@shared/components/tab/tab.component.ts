import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tab } from "@shared/viewModels/tab.model";

@Component({
  selector: 'share-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
  @Input() items?: Array<Tab>;
  @Output() changeActivation: EventEmitter<any> = new EventEmitter();
  @Input() activeId = 0;

  constructor(
    private route: ActivatedRoute,
  ) {
    console.log(
      this.route
    );

  }

  ngOnInit(): void {}

  chooseTab(tab: Tab) {
    this.changeActivation.emit(tab)
  }
}
