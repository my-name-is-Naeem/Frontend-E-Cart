import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(allProducts:any[],searchTerm:string,propertyName:string): any[] {

    //for holding the search result
    const result:any[]=[];

    if(!allProducts||searchTerm==''||propertyName==''){
      return allProducts;

    }

    allProducts.forEach((item)=>{
      //propertyName==SearchTerm  //user entering Value =>SearchTerm
      if(item[propertyName].trim().toLowerCase().includes(searchTerm.trim().toLowerCase())){
        result.push(item);

      }
    })

    return result;
  }
}
