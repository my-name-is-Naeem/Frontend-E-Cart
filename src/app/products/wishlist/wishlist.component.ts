import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  allWishlistItems: any = [];
  deletedFromWishlist: string = '';

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.getWishlist().subscribe(
      (result: any) => {
        console.log(result); //array[4]
        this.allWishlistItems = result;
      },
      (result: any) => {
        console.log(result.error);
      }
    );
  }

  //delete api call
  deleteWishlist(id: any) {
    this.api.deleteWishlist(id).subscribe((result) => {
      this.allWishlistItems = result;
      this.deletedFromWishlist =
        "<span style='color:Blue;'>Successfully Added</span>";
      setTimeout(() => {
        this.deletedFromWishlist = '';
      }, 2000);
  
    },(result:any)=>{
      //error message
     
    });
  }

  addToCart(product: any) {
    //add quantity to cart
    Object.assign(product, { quantity: 1 });

    //api call to add quantity
    this.api.addToCart(product).subscribe(
      (result: any) => {
        this.api.cartCount();
        this.deleteWishlist(product.id);
         this.deletedFromWishlist =
           "<span style='color:Blue;'>Product already in wishlist</span>";
         setTimeout(() => {
           this.deletedFromWishlist = '';
         }, 2000);
      },
      (result: any) => {
        alert(result.error);
      }
    );
  }
}
