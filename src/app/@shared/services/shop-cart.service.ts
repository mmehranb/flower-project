import { Injectable } from "@angular/core";
import { Subject, Observable, of } from "rxjs";
import { CredentialsService } from "./credentials.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { map, mergeMap } from "rxjs/operators";
import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: "root",
})
export class ShopCartService {
  private shopCartItemNumber = new Subject<number>();

  constructor(
    private http: HttpClient,
    private credentialsService: CredentialsService,
    private loading: LoadingService
  ) {}

  public getBasketItemsNumber(): Observable<number> {
    this.getBasket();
    return this.shopCartItemNumber.asObservable();
  }
  public addBasket(product: any, quantity: number, productOptions?: Array<any>): Promise<any> {
    if (this.credentialsService.isAuthenticated()) {
      let data: any = { quantity };
      productOptions ? (data.product_option_value_id = productOptions.map((r) => r.id)) : "";
      return this.http
        .post(`${environment.WEB_API_URL}/public/basket/add/${product.product_id}`, data)
        .pipe(
          map((r: any) => {
            this.getBasket();
          })
        )
        .toPromise();
    } else {
      const prevShopCart: Array<any> = JSON.parse(localStorage.getItem("shopCart") || "[]");
      const newShopCart = this.ctrlExistenceInBasket(
        prevShopCart,
        product,
        quantity,
        productOptions ? productOptions.map((r) => r.id) : []
      );
      localStorage.setItem("shopCart", JSON.stringify(newShopCart));
      return this.getBasket();
    }
  }
  private ctrlExistenceInBasket(
    prevShopCart: Array<any>,
    product: any,
    quantity: number,
    productOptions: Array<any>
  ): Array<any> {
    let postal_card: Array<any> = [];
    prevShopCart = prevShopCart.filter((item) => {
      if (item.product.product_id == product.product_id && this.checkOptionState(item.cart_option, productOptions)) {
        quantity++;
        postal_card = item.postal_card;
      } else return item;
    });
    const newShopCart: Array<any> = [
      ...prevShopCart,
      {
        calc_price: product.calc_price,
        id: prevShopCart.length + 1,
        product: product,
        quantity: quantity,
        cart_option: productOptions,
        postal_card: postal_card,
      },
    ];
    return newShopCart;
  }
  checkOptionState(prevOption: Array<any>, currentOption: Array<any>): boolean {
    let ans = true;
    if (!prevOption || !currentOption) return true;
    if (prevOption.length != currentOption.length) return false;
    currentOption.forEach((element) => {
      if (!prevOption.some((item) => item.id == element.id)) {
        ans = false;
        return ans;
      }
    });
    return ans;
  }
  public getBasket(): Promise<any> {
    if (this.credentialsService.isAuthenticated()) {
      return this.http
        .get(`${environment.WEB_API_URL}/public/basket/get`)
        .pipe(
          map((r: any) => {
            this.shopCartItemNumber.next(r.data.length);
            localStorage.setItem("shopCart", JSON.stringify(r.data));
            return r.data;
          })
        )
        .toPromise();
    } else {
      const shopCart = JSON.parse(localStorage.getItem("shopCart") || "[]");
      this.shopCartItemNumber.next(shopCart.length);
      return of(shopCart).toPromise();
    }
  }
  public updateBasket(id: number, quantity: number): Promise<any> {
    this.loading.show();
    if (this.credentialsService.isAuthenticated()) {
      return this.http
        .patch(`${environment.WEB_API_URL}/public/basket/changeqauntity/${id}`, { quantity })
        .pipe(
          mergeMap((r: any) => {
            this.loading.complete();
            return this.getBasket();
          })
        )
        .toPromise();
    } else {
      this.loading.complete();
      const shopCart: Array<any> = JSON.parse(localStorage.getItem("shopCart") || "[]");
      const newShopCart = shopCart.map((item) => {
        if (item.id == id) item.quantity = quantity;
        return item;
      });
      localStorage.setItem("shopCart", JSON.stringify(newShopCart));
      return this.getBasket();
    }
  }
  public deleteBasket(id: number): Promise<any> {
    this.loading.show();
    if (this.credentialsService.isAuthenticated()) {
      return this.http
        .delete(`${environment.WEB_API_URL}/public/basket/delete/${id}`)
        .pipe(
          mergeMap((r: any) => {
            this.loading.complete();
            return this.getBasket();
          })
        )
        .toPromise();
    } else {
      this.loading.complete();
      const shopCart: Array<any> = JSON.parse(localStorage.getItem("shopCart") || "[]");
      const newShopCart = shopCart.filter((item) => item.id != id);
      localStorage.setItem("shopCart", JSON.stringify(newShopCart));
      return this.getBasket();
    }
  }
  public createBasket() {
    this.loading.show();
    const shopItems = JSON.parse(localStorage.getItem("shopCart") || "[]");
    let promiseArray: Array<Promise<any>> = [];
    shopItems.forEach((item: any) => {
      const data = {
        quantity: item.quantity,
        postalcard_id: item.postal_card.length ? item.postal_card[0].postalcard_id : "",
        postalcard_text: item.postal_card.length ? item.postal_card[0].pivot.postalcard_text : "",
      };
      item.cart_option.length ? (data["product_option_value_id"] = item.cart_option) : "";
      promiseArray.push(
        this.http.post(`${environment.WEB_API_URL}/public/basket/add/${item.product.product_id}`, data).toPromise()
      );
    });
    Promise.all(promiseArray).then(() => {
      this.loading.complete();
    });
  }
  public clearBasket() {
    localStorage.setItem("shopCart", JSON.stringify([]));
    this.shopCartItemNumber.next(0);
  }

  //ctrl-postalCard
  public addPostalCard(cartId: number, content: any): Promise<any> {
    if (this.credentialsService.isAuthenticated()) {
      return this.http
        .post(`${environment.WEB_API_URL}/public/basket/postalcard/add/${cartId}`, {
          postalcard_id: content.postalcard_id,
          postalcard_text: content.postalcard_text,
        })
        .pipe(
          mergeMap((r: any) => {
            return this.getBasket();
          })
        )
        .toPromise();
    } else {
      const prevShopCart: Array<any> = JSON.parse(localStorage.getItem("shopCart") || "[]");
      const newShopCart = prevShopCart.map((item) => {
        if (item.id == cartId) {
          item.postal_card = [
            {
              picurl: content.picurl,
              postalcard_id: content.postalcard_id,
              pivot: { postalcard_text: content.postalcard_text },
            },
          ];
        }
        return item;
      });
      localStorage.setItem("shopCart", JSON.stringify(newShopCart));
      return this.getBasket();
    }
  }
  public editPostalCard(cartId: number, content: any): Promise<any> {
    if (this.credentialsService.isAuthenticated()) {
      return this.http
        .put(`${environment.WEB_API_URL}/public/basket/postalcard/edit/${cartId}`, {
          postalcard_id: content.postalcard_id,
          postalcard_text: content.postalcard_text,
        })
        .pipe(
          mergeMap((r: any) => {
            return this.getBasket();
          })
        )
        .toPromise();
    } else {
      const prevShopCart: Array<any> = JSON.parse(localStorage.getItem("shopCart") || "[]");
      const newShopCart = prevShopCart.map((item) => {
        if (item.id == cartId) {
          item.postal_card = [
            {
              picurl: content.picurl,
              pivot: { postalcard_id: content.postalcard_id, postalcard_text: content.postalcard_text },
            },
          ];
        }
        return item;
      });
      localStorage.setItem("shopCart", JSON.stringify(newShopCart));
      return this.getBasket();
    }
  }
  public getSuggestionText(): Promise<any> {
    return this.http.get(`${environment.WEB_API_URL}/public/geteventtexts`).toPromise();
  }
  //end
}
