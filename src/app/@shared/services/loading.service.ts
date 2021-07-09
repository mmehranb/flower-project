import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingStatus = new Subject<any>();

  constructor() { }

  public show() {
    document.body.classList.add('body-overflow')
    this.loadingStatus.next(true);
  }

  public complete() {
    document.body.classList.remove('body-overflow')
    this.loadingStatus.next(false);
  }

  getLoadingStatus(): Observable<boolean> {
    return this.loadingStatus.asObservable();
  }
}
