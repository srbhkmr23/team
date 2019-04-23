import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'showSearch'
})
export class ShowSearchPipe implements PipeTransform {

  transform(items: any, searchText: any, searchBy: any) {
   
    if (!items)
      return [];
    if (!searchText || !searchBy)
      return items;

    return items.filter(item => {
      for (let filter of searchBy) {
        // if (filter.toString().toLowerCase() === ('program').toLowerCase()) {
         
        //     if (item.program && item.program.title && searchText &&  item.program.title.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
        //       return true;
            
        //   }
        // }
        // if (filter.toString().toLowerCase() === ('company').toLowerCase()) {     
        //   if (item.company && item.company.name && searchText &&  item.company.name.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
        //     return true;  
        //   }
        // } else 

 
        if(filter=="startString"){
          let date = item[filter]; 
          let formatedDate = moment(date).format("MM/DD/YYYY");
          if(formatedDate && searchText && searchText &&  formatedDate.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
            return true
          }
        }
        else{
          if (item[filter] && searchText && item[filter].toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
            return true;
          }
        }

        
      }
    }); 
  }
 
}
