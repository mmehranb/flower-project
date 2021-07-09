import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { AuthFormComponent } from './auth-form/auth-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    AuthRoutingModule,
  ],
  declarations: [
    AuthComponent,
    AuthFormComponent,
  ]
})
export class AuthModule { }
