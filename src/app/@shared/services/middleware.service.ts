import { Injectable } from '@angular/core';
import { environment } from "@env/environment";
import { map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { CtrlModalService } from '../modal/ctrl-modal.service';
import { AuthComponent } from '@app/auth/auth.component';
import { LoadingService } from './loading.service';
import { CredentialsService } from './credentials.service';

@Injectable({
  providedIn: 'root'
})
export class MiddlewareService {

  constructor(
    private http: HttpClient,
    private ngxSmartModalService: NgxSmartModalService,
    private ctrlModalService: CtrlModalService,
    private credentialsService: CredentialsService,
    private loading: LoadingService
  ) { }

  postMiddleware(url: string, content: any): Observable<any> {
    return this.checkAuthorization().pipe(
      mergeMap((r: any) => {
        if (r)  {
          this.loading.show();
          return this.http.post(`${environment.WEB_API_URL}/${url}`, content).pipe(map(r => {
            this.loading.complete();
            return r;
          }))
        }
        else
          return null
      })
    )
  }

  deleteMiddleware(url: string): Observable<any> {
    return this.checkAuthorization().pipe(
      mergeMap((r: any) => {
        if (r) {
          this.loading.show();
          return this.http.delete(`${environment.WEB_API_URL}/${url}`).pipe(map(r => {
            this.loading.complete();
            return r;
          }))
        }
        else
          return null
      })
    )
  }

  private checkAuthorization(): Observable<any> {
    if (this.credentialsService.isAuthenticated()) return of(true);
    const obj: object = {
      action: 'login'
    }
    const dialog = this.ngxSmartModalService.create(
      "authenticate",
      AuthComponent,
      this.ctrlModalService.centerOption()
    );
    return Observable.create((observer: any) => {
      dialog.setData(obj).open().onClose.subscribe((modal: NgxSmartModalComponent) => {
        observer.next(this.credentialsService.isAuthenticated());
        observer.complete();
      });
    });
  }
}
