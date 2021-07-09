import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'checkout-header',
  templateUrl: './checkout-header.component.html',
  styleUrls: ['./checkout-header.component.scss']
})
export class CheckoutHeaderComponent implements OnInit {
  @Input() stepNumber: number;
  
  constructor() {
  }

  ngOnInit(): void {
    console.log('asdgsdgsd gsdg ');
  }

}
