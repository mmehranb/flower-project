import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from "@shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule } from '@app/@shared/datePicker';


@NgModule({
  declarations: [ProfileRoutingModule.components],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DpDatePickerModule,
    ProfileRoutingModule,
  ]
})
export class ProfileModule {}
