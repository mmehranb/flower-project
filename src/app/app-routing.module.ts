import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { Shell } from "./shell/shell.service";
import { AuthenticationGuard } from "@shared/guards/authentication.guard";

const routes: Routes = [
  { path: "auth", loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule) },
  Shell.childRoutes([
    { path: "products", loadChildren: () => import("./products/products.module").then((m) => m.ProductsModule) },
    { path: "product", loadChildren: () => import("./product/product.module").then((m) => m.ProductModule) },
    {
      path: "profile",
      canActivate: [AuthenticationGuard],
      loadChildren: () => import("./profile/profile.module").then((m) => m.ProfileModule),
    },
    { path: "checkout", loadChildren: () => import("./checkout/checkout.module").then((m) => m.CheckoutModule) },
    { path: "home", loadChildren: () => import("./home/home.module").then((m) => m.HomeModule) },
    { path: "", loadChildren: () => import("./home/home.module").then((m) => m.HomeModule) },
  ]),
  { path: '**', redirectTo: "''" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
