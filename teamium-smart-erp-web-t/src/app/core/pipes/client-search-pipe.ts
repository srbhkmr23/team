import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clientSearch'
})
export class ClientSearchPipe implements PipeTransform {

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
        // } 
        if (item[filter] && searchText && item[filter].toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
            return true;
        }
      }
    });
  }

}
