import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenisIntroSlideComponent } from './benis-intro-slide.component';

describe('BenisIntroSlideComponent', () => {
  let component: BenisIntroSlideComponent;
  let fixture: ComponentFixture<BenisIntroSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenisIntroSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenisIntroSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
