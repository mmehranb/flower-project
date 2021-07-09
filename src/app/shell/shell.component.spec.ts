import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreModule } from '@core';
import { CredentialsService } from '@shared/services/credentials.service';
import { AuthenticationService } from '@app/auth';

import { ShellComponent } from './shell.component';
import { HeaderComponent } from './header/header.component';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CoreModule
      ],
      providers: [
        { provide: AuthenticationService },
        { provide: CredentialsService }
      ],
      declarations: [
        HeaderComponent,
        ShellComponent
      ]
  })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
