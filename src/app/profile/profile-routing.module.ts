import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from "./profile.component";
import { UserComponent } from "./user/user.component";
import { AddressesComponent } from "./addresses/addresses.component";
import { InterestsComponent } from "./interests/interests.component";
import { OrdersComponent } from "./orders/orders.component";
import { OrderDetailComponent } from "./orders/order-detail/order-detail.component";
import { RemindersComponent } from "./reminders/reminders.component";

const routes: Routes = [
  {
    path: "",
    component: ProfileComponent,
    children: [
      {
        path: "user",
        component: UserComponent,
        data: {id: 1}
      },
      {
        path: "addresses",
        component: AddressesComponent,
        data: {id: 2}
      },
      {
        path: "interests",
        component: InterestsComponent,
        data: {id: 5}
      },
      {
        path: "reminders",
        component: RemindersComponent,
        data: {id: 6}
      },
      {
        path: "orders",
        component: OrdersComponent,
        data: {id: 3}
      },
      {
        path: "orders/detail/:id",
        component: OrderDetailComponent,
        data: {id: 3}
      }
    ]
  },
  { path: "**", redirectTo: "user", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {
  static components = [UserComponent, AddressesComponent, ProfileComponent, InterestsComponent, OrdersComponent, OrderDetailComponent, RemindersComponent]
}
