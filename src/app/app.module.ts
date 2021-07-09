import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "@env/environment";
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from "ngx-cookie-service";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ShellModule } from './shell/shell.module';
import { LoaderComponent } from "./components/loader/loader.component";
import { CoreModule } from './@core';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register("./ngsw-worker.js", { enabled: environment.production }),
    HttpClientModule,
    CoreModule,
    ShellModule,
    ToastrModule.forRoot({
			positionClass: "toast-top-right",
			timeOut: 3000,
			closeButton: true,
			toastClass: "ngx-toastr toastr"
		}),
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent, LoaderComponent],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
