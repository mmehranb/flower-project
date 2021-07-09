import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqItems: Array<any>;

  constructor(private homeSerive: HomeService) {
    this.homeSerive.getFaqItems().then(r => {
      this.faqItems = r.data;
    })
  }

  ngOnInit(): void {
  }

}
