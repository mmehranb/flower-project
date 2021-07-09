import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaticDataService } from '@app/@shared/services/static-data.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.scss']
})
export class ProductsFilterComponent implements OnInit {
  @Input() defaultValue: object;
  @Input() useInModal: boolean = true;
  @Output() onFilterChange = new EventEmitter<object>();
  productFilterTypeItems: Array<any>;
  categoryFilterTypeItems: Array<any>;
  priceFilterTypeItems: Array<any> = [
    {
      id: 1,
      name: 'کمتر از 50,000 تومان',
      param: {
        price_max: 50000,
        price_min: 0
      }
    },
    {
      id: 2,
      name: '50,000 تا 100,000',
      param: {
        price_max: 100000,
        price_min: 50001
      }
    },
    {
      id: 3,
      name: '100,000 تا 200,000',
      param: {
        price_max: 200000,
        price_min: 100001
      }
    },
    {
      id: 4,
      name: '200,000 تا 300,000',
      param: {
        price_max: 300000,
        price_min: 200001
      }
    },
    {
      id: 5,
      name: 'بیشتر از 300,000 تومان',
      param: {
        price_max: 90000000,
        price_min: 300001
      }
    },
  ];
  dialogData: any;

  constructor(
    private staticDataService: StaticDataService,
    private ngxSmartModalService: NgxSmartModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.useInModal) {
      this.dialogData = this.ngxSmartModalService.getModalData('proFilter');
      this.defaultValue = this.dialogData.defaultValue;
    }
    this.staticDataService.getCategories().subscribe(r => {
      let categoriesId = this.defaultValue['categories_id']
      this.categoryFilterTypeItems = r;
      if (categoriesId) {
        categoriesId.split(',').forEach((id: any) => {
          this.categoryFilterTypeItems.find(x => x.id == id).value = true
        });
      }
    })
    this.staticDataService.getProductsOptions().then(r => {
      this.productFilterTypeItems = r.data.map((item: any) => {
        let option = this.defaultValue[`option[${item.option_id}]`]
        if (option) {
          option.split(',').forEach((filter: any) => {
            item.values.find((x: any) => x.option_value_id == +filter).value = true
          });
        }
        return item;
      })
    })
  }

  filterChange(type: string) {
    let params: object = {};
    this.productFilterTypeItems.forEach(item => {
      item.values.forEach((option: any) => {
        if (option.value) {
          params[`option[${item.option_id}]`] = params[`option[${item.option_id}]`] ? params[`option[${item.option_id}]`] + `,${option.option_value_id}` : `${option.option_value_id}`
        }
      });
    })
    let x: string;
    this.categoryFilterTypeItems.forEach(item => {
      if (item.value) {
        !!x ? x += `,${item.id}` : x = item.id
        params['categories_id'] = x;
      }
    })
    this.priceFilterTypeItems.forEach(item => {
      if (item.value) {
        params = {...params, ...item.param}
        item.value = false;
      }
    })
    if (this.useInModal) {
      this.ngxSmartModalService.setModalData({params: params, type: type}, 'proFilter', true);
      this.ngxSmartModalService.close('proFilter');
    }
    else {
      this.onFilterChange.emit({params: params, type: type})
    }
  }

  // private getRouteCategoriesId() {
  //   let id = null;
  //   console.log();

  //   if (this.route.snapshot.data['title'] == 'products') {
  //     this.staticDataService.getCategories().subscribe(r => {
  //       let categoriesId = this.defaultValue['categories_id']
  //       this.categoryFilterTypeItems = r;
  //       if (this.route.params['category1']) {
  //         r.forEach((item: any) => {
  //           if (item.cleanurl == this.route.params['category1']) {
  //             id = {categories_id: item.id};
  //             this.categoryFilterTypeItems = r.children;
  //           }
  //         });
  //       }
  //       if (categoriesId) {
  //         categoriesId.split(',').forEach((id: any) => {
  //           this.categoryFilterTypeItems.find(x => x.id == id).value = true
  //         });
  //       }
  //     })
  //   }
  // }
}
