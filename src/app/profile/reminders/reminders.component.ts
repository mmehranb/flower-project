import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'jalali-moment';
import { ProfileService } from '@app/@shared/services/profile.service';
import { StaticDataService } from '@app/@shared/services/static-data.service';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { DialogSelectComponent } from '@app/@shared/components/dialog-select/dialog-select.component';
import { CtrlModalService } from '@app/@shared/modal/ctrl-modal.service';
import { FormErrosCtrlService } from '@app/@shared/services/form-erros-ctrl.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class RemindersComponent implements OnInit {
  form: FormGroup;
  formErrors: any = {}
  reminderItems: Array<any>;
  datePickerConfig = {
    drops: "down",
    format: "YYYY/MM/DD",
  };
  selectedEvent: string;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private staticDataService: StaticDataService,
    private ngxSmartModalService: NgxSmartModalService,
    private ctrlModalService: CtrlModalService,
    private formErrorService: FormErrosCtrlService
  ) {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      eventid: [null, Validators.required],
      date: [null, Validators.required],
      smsontime: 1,
    })
    Object.entries(this.form.controls).forEach(ctrl => {
			const ctrlName = ctrl[0];
			ctrl[1].valueChanges.subscribe(data => {
				this.formErrors[ctrlName] = this.formErrorService.validateForm(ctrl[1]);
			});
    });
    this.getReminderList();
  }

  ngOnInit(): void {
  }

  getReminderList() {
    this.profileService.getReminder().then(r => {
      this.reminderItems = r.data;
    })
  }

  deleteReminder(id: number) {
    this.profileService.deleteReminder(id).then(r => {
      this.getReminderList();
    })
  }

  showEventItems() {
    this.staticDataService.getEvents().subscribe((r: any) => {
      const obj: Object = {
        desc: "نوع مناسبت خود را انتخاب کنید",
        listItems: r.map((x: any) => {return {...x, title: x.name}}),
        header: "نوع مناسبت",
      };
      const dialog = this.ngxSmartModalService.create(
        "dialogSelect",
        DialogSelectComponent,
        this.ctrlModalService.centerOption()
      );
      dialog
        .setData(obj)
        .open()
        .onClose.subscribe((modal: NgxSmartModalComponent) => {
          const x = modal.getData();
          this.selectedEvent = x.title;
          this.form.controls["eventid"].patchValue(x.id);
        });
    })
  }

  submit() {
		this.formErrorService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      const formValue = this.form.value;
      const data = {
        eventid: formValue.eventid,
        name: formValue.name,
        event_day: moment(formValue.date, 'JYYYY/JMM/JDD').date(),
        event_month: moment(formValue.date, 'JYYYY/JMM/JDD').month() + 1,
        smsontime: 1
      }
      this.profileService.addReminder(data).then(r => {
        this.getReminderList();
      })
    }
    else {
      Object.entries(this.form.controls).forEach(ctrl => {
        const ctrlName = ctrl[0];
        this.formErrors[ctrlName] = this.formErrorService.validateForm(ctrl[1], true);
      });
    }
  }
}
