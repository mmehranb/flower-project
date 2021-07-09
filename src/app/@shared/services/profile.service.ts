import { Injectable } from "@angular/core";

import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getWishList(): Promise<any> {
    return this.http.get(`${environment.WEB_API_URL}/public/wishproduct/get`).toPromise();
  }
  editUserInfo(data: any): Promise<any> {
    return this.http.patch(`${environment.WEB_API_URL}/public/editprofile`, data).toPromise();
  }

  //address
  public getUserAddresses(): Promise<any> {
    return this.http.get(`${environment.WEB_API_URL}/public/address/get`).toPromise();
  }
  public addUserAddresses(data: any): Promise<any> {
    return this.http.post(`${environment.WEB_API_URL}/public/address/add`, data).toPromise();
  }
  public editUserAddresses(data: any): Promise<any> {
    return this.http.patch(`${environment.WEB_API_URL}/public/address/edit`, data).toPromise();
  }
  public deleteUserAddress(addressId: any): Promise<any> {
    return this.http.delete(`${environment.WEB_API_URL}/public/address/remove/${addressId}`).toPromise();
  }
  //end

  //Reminder
  public addReminder(content: any): Promise<any> {
    return this.http.post(`${environment.WEB_API_URL}/public/reminder/add`, content).toPromise();
  }
  public getReminder(): Promise<any> {
    return this.http.get(`${environment.WEB_API_URL}/public/reminder/get`).toPromise();
  }
  public deleteReminder(id: number): Promise<any> {
    return this.http.delete(`${environment.WEB_API_URL}/public/reminder/remove/${id}`).toPromise();
  }
}
