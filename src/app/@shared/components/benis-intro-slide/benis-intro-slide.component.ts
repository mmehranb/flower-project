import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'benis-intro-slide',
  templateUrl: './benis-intro-slide.component.html',
  styleUrls: ['./benis-intro-slide.component.scss']
})
export class BenisIntroSlideComponent implements OnInit {
  @Input() isHomePage: boolean = false;
  sliderInterval: any;
  activeSlide: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.sliderInterval = setInterval(() => {
      this.activeSlide += 1;
      this.activeSlide %= 3;
    }, 3000)
  }

}
