import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from "src/app/@shared/shared.module";

import { ShellComponent } from './shell.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './header/menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    HeaderComponent,
    ShellComponent,
    MenuComponent,
    FooterComponent,
  ]
})
export class ShellModule {
}
