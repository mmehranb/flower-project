import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from "ngx-swiper-wrapper";
import { CountdownModule } from "ngx-countdown";

import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { TermsComponent } from './terms/terms.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SwiperModule,
    ReactiveFormsModule,
    CountdownModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    ContactUsComponent,
    AboutComponent,
    FaqComponent,
    JoinUsComponent,
    TermsComponent
  ]
})
export class HomeModule { }
