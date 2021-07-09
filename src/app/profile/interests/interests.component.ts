import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@app/@shared/services/profile.service';
import { ProductApi, Product } from '@app/@shared/viewModels/product.model';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss']
})
export class InterestsComponent implements OnInit {
  interestsList: Array<Product>
  constructor(
    private profileService: ProfileService
  ) { 
    this.getInterestsList();
  }

  ngOnInit(): void {
  }

  getInterestsList() {
    this.profileService.getWishList().then((r: ProductApi) => {
      this.interestsList = r.data.map((item: any) => {
        item.is_whishlist = 1;
        return item
      });
    })
  }
}
