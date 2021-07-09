import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProductsComponent } from "./products.component";
import { ProductsResolver } from './products.resolver';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ProductsComponent,
        pathMatch: "full",
        resolve: {
          products: ProductsResolver
        },
        data: {
          title: "products"
        }
      },
      {
        path: "tag/:tagId/:tagName",
        component: ProductsComponent,
        pathMatch: "full",
        resolve: {
          products: ProductsResolver
        },
        data: {
          title: "tags"
        }
      },
      {
        path: "event/:eventName",
        component: ProductsComponent,
        pathMatch: "full",
        resolve: {
          products: ProductsResolver
        },
        data: {
          title: "events"
        }
      },
      {
        path: "search",
        component: ProductsComponent,
        pathMatch: "full",
        resolve: {
          products: ProductsResolver
        },
        data: {
          title: "search"
        }
      },
      {
        path: ":category1",
        component: ProductsComponent,
        pathMatch: "full",
        resolve: {
          products: ProductsResolver
        },
        data: {
          title: "products"
        }
      },
      {
        path: ":category1/:category2",
        component: ProductsComponent,
        pathMatch: "full",
        resolve: {
          products: ProductsResolver
        },
        data: {
          title: "products"
        }
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
