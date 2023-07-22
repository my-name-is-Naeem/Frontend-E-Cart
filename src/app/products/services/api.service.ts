import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  //to hold cart count
  cartItemCount = new BehaviorSubject(0);

  //Backend Path
  BASE_URL = 'http://localhost:5001';

  //to hold Search Term
  searchTerm = new BehaviorSubject('');

  constructor(private http: HttpClient) {
    this.cartCount();
  }

  //get all products
  getAllProducts() {
    return this.http.get(`${this.BASE_URL}/products/allProducts`);
  }

  //view particular product
  viewProduct(id: any) {
    return this.http.get(`${this.BASE_URL}/products/viewProduct/${id}`);
  }

  //add product to wishlist
  addToWishlist(id: any, title: string, price: any, image: string) {
    const body = { id, title, price, image };
    return this.http.post(`${this.BASE_URL}/products/addToWishlist`, body); //because of post we need to add body
  }

  //get wishlist products
  getWishlist() {
    return this.http.get(`${this.BASE_URL}/products/wishlist`);
  }

  //Delete Wishlist product
  deleteWishlist(id: any) {
    return this.http.delete(`${this.BASE_URL}/products/deleteWishlist/${id}`);
  }

  //
  addToCart(product:any) {
    const body = { 
      id:product.id, 
      title:product.title, 
      price:product.price, 
      image:product.image,
      quantity:product.quantity};
    return this.http.post(`${this.BASE_URL}/products/addToCart`, body); //because of post we need to add body
  }

  getCart()
  {
    return this.http.get(`${this.BASE_URL}/products/carts`);
  }

  // cart count
  cartCount(){
    this.getCart().subscribe((result:any)=>{
      this.cartItemCount.next(result.length);
    })
  }

  //delete cart product
  deleteCart(id:any)
  {
    return this.http.delete(`${this.BASE_URL}/products/deleteCart/${id}`)
  }

  //increment cart
  incrementCart(productId:any)
  {
    return this.http.get(`${this.BASE_URL}/products/increment/${productId}`);
  }

  //Decrement Cart
  decrementCart(productId:any)
  {
    return this.http.get(`${this.BASE_URL}/products/decrement/${productId}`);
  }
}
