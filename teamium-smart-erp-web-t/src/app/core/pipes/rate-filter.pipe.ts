import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rateFilter'
})
export class RateFilterPipe implements PipeTransform {

  transform(items: Array<any>, filterByCompany: any, filterByFunction: any, filterByClient: any, filterByBasis: any, filterByType:any) {
    
    if (!items)
      return [];
    if (((!filterByFunction || filterByFunction.length == 0) && (!filterByCompany || filterByCompany.length == 0) && (!filterByClient || filterByClient.length == 0)&&(!filterByBasis || filterByBasis.length == 0) && (!filterByType || filterByType.length == 0)))
      return items;

    
    return items.filter(item => {// company
      console.log("company");
      if (!filterByCompany || filterByCompany.length == 0) {
          return true;
      }
      for(let company of filterByCompany){
        if (item['entity'] && item['entity']['name']!=null&&item['entity']['name'].toString().toLowerCase()===(company.toString().toLowerCase())) {
          return true;
        }
      }

    }).filter(item => {//client
      console.log("client");
      // console.log(item['company']['name'], filterByClient)
      if (!filterByClient || filterByClient.length == 0) {
        return true;
      }
      
      for(let value of filterByClient){
        
        if (item['company']!=null && item['company']['name']!=null && item['company']['id']=== value) {
          console.log(item['company']['name'], filterByClient, value)
          return true;
        }
      }

    }).filter(item => {// Function
      console.log("Function");
        if (!filterByFunction || filterByFunction.length == 0) {
            return true;
        }
        for(let id of filterByFunction){
          console.log(id, item['functionDetails']['qualifiedName']!=null, item['functionDetails']['id']===id )
          if (item['functionDetails']['qualifiedName']!=null && item['functionDetails']['id']===id) {
                return true;
            }
        }

    }).filter(item => {//basis
      console.log("basis");
      if (!filterByBasis || filterByBasis.length == 0) {
        return true;
      }
      for(let basis of filterByBasis){
        console.log(basis, item['basis']!=null, item['basis'].toString().toLowerCase(), item['basis'].toString().toLowerCase()===(basis.toString().toLowerCase()))
        if (item['basis']!=null&&item['basis'].toString().toLowerCase()===(basis.toString().toLowerCase())) {
          return true;
        }
      }

    }).filter(item => {//type
      console.log("type");
      if (!filterByType || filterByType.length == 0) {
        return true;
      }
      for(let type of filterByType){
        console.log(type, item['type']!=null, item['type'].toString().toLowerCase(), item['type'].toString().toLowerCase()===(type.toString().toLowerCase()))
        if (item['type']!=null&&item['type'].toString().toLowerCase()===(type.toString().toLowerCase())) {
          return true;
        }
      }

    });
  }
}
 