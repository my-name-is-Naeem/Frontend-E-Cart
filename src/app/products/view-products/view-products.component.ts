import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css'],
})
export class ViewProductsComponent implements OnInit {
  productId: string = '';
  addedToWishlist:string=""

  //Used for fetch data with id
  constructor(private viewRoute: ActivatedRoute, private api: ApiService) {}
  //to hold particular product details
  product:any = [];
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    //to fetch parameter details use params.
    this.viewRoute.params.subscribe((result: any) => {
      console.log(result); //{productId:"3"}
      console.log(result.productId); //3
      this.productId = result.productId;
      //to fetch particular product details
      this.api.viewProduct(this.productId).subscribe((result: any) => {
          console.log(result);
          this.product = result;
        },
        (result: any) => {
          console.log(result.error); //error message
        }
      );
    });
  }

  //api function to add product to wishlist

  addToWishlist() {
    //Destructuring
    const { id, title, price, image } = this.product; //req.body

    //api function

    this.api.addToWishlist(id, title, price, image).subscribe(
      (result: any) => {
        this.addedToWishlist = "<span style='color:Blue;'>Successfully Added</span>"
        setTimeout(() => {
          this.addedToWishlist=""
        },2000);


        
      },
      (result: any) => {
       //error message
         this.addedToWishlist =
           "<span style='color:Blue;'>Product already in wishlist</span>";
         setTimeout(() => {
           this.addedToWishlist = '';
         }, 2000);

      }
    );
  }

  //add to Cart
  addToCart(product:any)
  {
    Object.assign(product,{quantity:1})
    console.log(product);
    this.api.addToCart(product).subscribe((result)=>{
    this.api.cartCount();
    alert(result)//add to cart Successfully
    },(result:any)=>{
      alert(result.error);
    })

    
  }
}
