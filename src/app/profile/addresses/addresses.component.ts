import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@app/@shared/services/profile.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  myAddress: Array<any>;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.getAddresses();
  }

  getAddresses() {
    this.profileService.getUserAddresses().then((r) => {
      this.myAddress = r.data;
    });
  }
}
