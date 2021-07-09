import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutComponent } from "./about/about.component";
import { FaqComponent } from './faq/faq.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: "",
        component: HomeComponent, // base template component
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      },
      {
        path: 'join-us',
        component: JoinUsComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'faq',
        component: FaqComponent
      },
      {
        path: 'terms',
        component: TermsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule { }
