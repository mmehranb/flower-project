import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "@app/@shared/services/loading.service";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class HomeService {
	private _sliderItems$: Observable<any>;

  constructor(private http: HttpClient, private loading: LoadingService) {
		this._sliderItems$ = this.http.get(environment.WEB_API_URL + `/public/getslides`).pipe(shareReplay());

  }

  getSliderItems(): Observable<any> {
    return this._sliderItems$.pipe(map(r => r.data));
  }

  postContactUsReq(content: any): Promise<any> {
    return this.http.post(environment.WEB_API_URL + "/public/addcontactus", content).toPromise();
  }

  getFaqItems(): Promise<any> {
    return this.http.get(environment.WEB_API_URL + "/public/getfaq").toPromise();
  }
}
