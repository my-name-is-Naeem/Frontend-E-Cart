import { Component, OnInit } from '@angular/core';
import { ApiService } from '../products/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  cartCount:string='';

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.cartItemCount.subscribe((data: any) => {
      console.log(data);
      this.cartCount = data;
    });
  }
  //to hold Search Term
  searchTerm: string = "";
  search(event:any){
    console.log(event.target.value);
    //to assign new value to Behavior subject to use next() method
    this.api.searchTerm.next(event.target.value); //add searchTerm to Behavior Subject
  };

}

