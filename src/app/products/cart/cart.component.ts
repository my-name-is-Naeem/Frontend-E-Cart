import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  //for PayPal
  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean = false;
  showPaypalStatus: boolean = false;

  offerClicked: boolean = false;

  offerOff: boolean = false;

  totalPrice = 0;
  paymentStatus: boolean = false;

  name: string = '';
  houseNo: string = '';
  street: string = '';
  state: string = '';
  phone: string = '';

  //To hold cart product
  allCart: any = [];
  cartCount: string = '';
  constructor(private api: ApiService, private DetailsValidate: FormBuilder) {}

  DetailsForm = this.DetailsValidate.group({
    //array creation
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    houseNo: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    street: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    state: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    phone: ['', [Validators.required, Validators.pattern('[0-9]*')]],
  });

  ngOnInit(): void {
    this.api.cartItemCount.subscribe((data: any) => {
      console.log(data);
      this.cartCount = data;

      this.initConfig();
    });

    this.api.getCart().subscribe(
      (result) => {
        console.log(result);
        // this.api.cartCount()
        this.allCart = result;
        //call cart total function
        this.getCartTotal();
      },
      (result: any) => {
        console.log(result.error);
      }
    );
  }

  removeCart(id: any) {
    this.api.deleteCart(id).subscribe(
      (result: any) => {
        this.allCart = result;
        this.api.cartCount();
      },
      (result: any) => {
        alert(result.error);
      }
    );
  }

  getCartTotal() {
    let total = 0;
    this.allCart.forEach((result: any) => {
      total += result.grandTotal;
      this.totalPrice = Math.ceil(total);
    });
  }

  incrementCart(productId: any) {
    this.api.incrementCart(productId).subscribe(
      (result: any) => {
        this.allCart = result;
        this.getCartTotal();
      },
      (result: any) => {
        alert(result.error);
      }
    );
  }

  decrementCart(productId: any) {
    this.api.decrementCart(productId).subscribe(
      (result: any) => {
        this.allCart = result;
        this.getCartTotal();
        this.cartCount;
      },
      (result: any) => {
        alert(result.error);
      }
    );
  }

  submitPay() {
    if (this.DetailsForm.valid) {
      this.name = this.DetailsForm.value.name || '';
      this.houseNo = this.DetailsForm.value.houseNo || '';
      this.street = this.DetailsForm.value.street || '';
      this.state = this.DetailsForm.value.state || '';
      this.phone = this.DetailsForm.value.phone || '';

      this.paymentStatus = true;
    } else {
      alert('Invalid Details Entered');
    }
  }

  offerClick() {
    this.offerClicked = true;
    this.offerOff = true;
  }

  discount(value: any) {
    this.totalPrice = (this.totalPrice * (100 - value)) / 100;
    this.offerClicked = false;
  }

  //PayPal
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: '9.99',
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: '9.99',
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'EUR',
                    value: '9.99',
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  //PayPal button Show
  payPalPay() {
    this.showPaypalStatus = true;
  }

  modalClose(){
    this.DetailsForm.reset();
    this.showPaypalStatus=false;
    this.showSuccess=false;
    this.paymentStatus=false;
  }

  //Form Creation

  //form Group creation
}
