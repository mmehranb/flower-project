import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { Credentials, CredentialsService } from "../@shared/services/credentials.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
import { finalize, map, shareReplay } from "rxjs/operators";
import { ShopCartService } from '@app/@shared/services/shop-cart.service';
import { LoadingService } from '@app/@shared/services/loading.service';

export interface LoginContext {
  username: string;
  password: string;
}

export interface RegisterContext {
  firstname: string;
  lastname: string;
  email?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
	private _getUserInfo: Observable<any>;

  constructor(
    private credentialsService: CredentialsService,
    private http: HttpClient,
    private shopCartService: ShopCartService,
    private loading: LoadingService
  ) {
    this.fetchUserInfo();
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: any): Observable<Credentials> {
    const params: any = {
      grant_type: environment.GRANT_TYPE,
      username: context.username || context.telephone,
      password: context.password,
      scope: environment.SCOPE,
      client_secret: environment.CLIENT_SECRET,
      client_id: environment.CLIENT_ID,
    };
    return this.http.post(`${environment.WEB_API_URL}/public/login`, params).pipe(
      map((res: any) => {
        if (typeof res.access_token !== "undefined") {
          this.credentialsService.setCredentials({token: res.access_token, expires_in: res.expires_in} );
        }
        this.shopCartService.createBasket();
        return res;
      })
    );
  }

  register(context: RegisterContext): Observable<Credentials> {
    return this.http.post(`${environment.WEB_API_URL}/public/register`, context).pipe(
      map((res: any) => {
        if (typeof res.access_token !== "undefined") {
          this.credentialsService.setCredentials(res);
        }
        return res;
      })
    );
  }

  exit(): Promise<any> {
    return this.http.post(`${environment.WEB_API_URL}/public/logout`, {}).pipe(
      map(r => {
        localStorage.removeItem('shopCart')
        localStorage.removeItem('credentials')
        window.location.href = '/';
      })
    ).toPromise()
  }

  giveVerifyCode(context: any): Promise<any> {
    this.loading.show();
    return this.http
      .get(`${environment.WEB_API_URL}/public/forgottenpassword?username=${context.username || context.telephone}`).pipe(
        finalize(() => {
          this.loading.complete();
        })
      )
      .toPromise();
  }

  changePassword(context: any): Promise<any> {
    return this.http.post(`${environment.WEB_API_URL}/public/editpasswordwithconfirmcode`, context).toPromise();
  }

  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }

  public getUserInfo(): Observable<any> {
    if (!this.credentialsService.isAuthenticated()) return of(null);
    return this._getUserInfo;
  }

  public fetchUserInfo() {
		this._getUserInfo = this.http.get(environment.WEB_API_URL + "/public/getcustomerinfo").pipe(shareReplay());
	}
}
