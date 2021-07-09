import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "@env/environment";
import { Router, RouterStateSnapshot, ActivatedRoute } from "@angular/router";

import { LoadingService } from "@shared/services/loading.service";
import { Credentials, CredentialsService } from "@app/@shared/services/credentials.service";
/**
 * Prefixes all requests not starting with `http[s]` with `environment.serverUrl`.
 */
@Injectable({
  providedIn: "root",
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  private errorWhiteList: { url: string; disc: string }[] = [
    {
      url: `${environment.WEB_API_URL}/connect/token`,
      disc: "لاگین",
    },
  ];

  constructor(
    private loading: LoadingService,
    private router: Router,
    private toastr: ToastrService,
    private credentialsService: CredentialsService,
    private route: ActivatedRoute
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const credentials: Credentials = this.credentialsService.credentials();
    request = request.clone({
      setHeaders: {
        "Client-Key": `Z0f0xnCNLLlC67ie9tHsD5gXIWZpWS7G9or5EzTI`,
      },
    });
    if (credentials) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${credentials.token}`,
          "Client-Key": `Z0f0xnCNLLlC67ie9tHsD5gXIWZpWS7G9or5EzTI`,
          "Cache-Control": "no-cache, no-store, must-revalidate, post-check=0, pre-check=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }

    if (!request.headers.has("Content-Type") && !(request.body instanceof FormData)) {
      request = request.clone({
        headers: request.headers.set("Content-Type", "application/json"),
      });
    }

    // if (!/^(http|https):/i.test(request.url)) {
    //   request = request.clone({ url:request.url });
    // }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.loading.complete();
        if (this.errorWhiteList.find((x) => x.url == error.url)) {
        } else if (error.status == 401) {
          this.credentialsService.setCredentials();
          this.router.navigate(["auth/login"], {
            queryParams: { redirect: this.route.snapshot["_routerState"].url },
            replaceUrl: true,
          });
        } else if (error.status == 403) {
          this.toastr.error("شما به این بخش دسترسی ندارید", "خطا");
        } else if (error.status == 404) {
          this.toastr.error("این مسیر وجود ندارد", "خطا");
        } else if (error.status == 500) {
          this.toastr.error("خطای سیستمی رخ داد", "خطا");
        } else if (error.status == 400) {
          if (error.error.errors) {
            if (error.error.errors.DomainValidations) {
              if (error.error.errors.DomainValidations.length > 0) {
                for (const Dom of error.error.errors.DomainValidations) {
                  this.toastr.error(Dom, "خطا");
                }
              }
            } else {
              this.toastr.error(error.error.title, "خطا");
            }
          }
        } else if (error.status == 0) {
          this.toastr.error("خطا در ارتباط با سرور", "خطا");
        }
        return throwError(error);
      })
    );
  }
}
