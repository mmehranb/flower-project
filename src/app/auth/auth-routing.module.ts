import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from "./auth.component";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: AuthComponent, data: { action: 'login' }},
      { path: 'signup', component: AuthComponent, data: { action: 'signup' }},
      { path: 'forgot', component: AuthComponent, data: { action: 'forgot' }},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AuthRoutingModule { }
