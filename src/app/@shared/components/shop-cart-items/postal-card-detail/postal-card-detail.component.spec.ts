import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostalCardDetailComponent } from './postal-card-detail.component';

describe('PostalCardDetailComponent', () => {
  let component: PostalCardDetailComponent;
  let fixture: ComponentFixture<PostalCardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostalCardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostalCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
