import { Component, OnInit, Input } from "@angular/core";
import { LoadingService } from "@app/@shared/services/loading.service";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
  animations: [
    trigger("fadeInOut", [
      transition(":enter", [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(250, style({ opacity: 1 })),
      ]),
      transition(":leave", [
        // :leave is alias to '* => void'
        animate(250, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class LoaderComponent implements OnInit {
  isLoading = false;

  constructor(private loading: LoadingService) {}

  ngOnInit() {
    this.loading.getLoadingStatus().subscribe((r) => {
      console.log(r ? "loading is show" : "loading is hide");

      this.isLoading = r;
    });
  }
}
