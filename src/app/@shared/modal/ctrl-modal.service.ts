import { ComponentFactoryResolver, ApplicationRef, TemplateRef, Type, Injectable } from "@angular/core";
import { INgxSmartModalOptions } from "ngx-smart-modal/src/config/ngx-smart-modal.config";
import { ModalModule } from "./modal.module";
import { NavigationStart, RouterEvent, Router } from "@angular/router";
import { filter, tap } from 'rxjs/operators';
import { NgxSmartModalService } from 'ngx-smart-modal';

export declare type Content<T> = string | TemplateRef<T> | Type<T>;

@Injectable({
  providedIn: ModalModule,
})
export class CtrlModalService {
  constructor(private router: Router, private ngxSmartModalService: NgxSmartModalService) {
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationStart),
        tap(() => {
          this.ngxSmartModalService.closeAll();
        })
      )
      .subscribe();
  }

  public centerOption(): INgxSmartModalOptions {
    const option: INgxSmartModalOptions = {
      closable: false,
      escapable: false,
			refocus: false,
      customClass: "dialog-center nsm-dialog-animation-fade",
    };
    return option;
  }

  public bottomSheetOption(id: string = "modal"): INgxSmartModalOptions {
    const option: INgxSmartModalOptions = {
      closable: false,
      escapable: false,
      force: false,
      refocus: false,
      customClass: "dialog-bottomSheet",
    };
    return option;
  }

  public sideOption(id: string = "modal"): INgxSmartModalOptions {
    const option: INgxSmartModalOptions = {
      closable: false,
      escapable: false,
      force: false,
      customClass: "dialog-side",
    };
    return option;
  }
}
