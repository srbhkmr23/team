import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rateSearch'
})
export class RateSearchPipe implements PipeTransform {

  transform(items: Array<any>, searchText: any, serachBy: any) {
    if (!items)
      return [];
    if (!serachBy || !searchText)
      return items;

    return items.filter(item => {
        for (let filter of serachBy) {
            if (filter.toString().toLowerCase() === ('qualifiedName').toLowerCase()) {                
                if (item.functionDetails && searchText && item.functionDetails.qualifiedName && item.functionDetails.qualifiedName.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
                    return true;
                }                
            }
            if (filter.toString().toLowerCase() === ('company').toLowerCase()) {                
                if (item.entity && searchText && item.entity.name && item.entity.name.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
                    return true;
                }                
            }
            if (filter.toString().toLowerCase() === ('client').toLowerCase()) {          
                if (item.company && searchText && item.company.name && item.company.name.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
                    return true;
                }                
            }
            if (filter.toString().toLowerCase() === ('vendor').toLowerCase()) {                
                if (item.vendor && searchText && item.vendor.name && item.vendor.name.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
                    return true;
                }                
            }
            if (filter.toString().toLowerCase() === ('cardName').toLowerCase()) {                
                if (item.label && searchText && item.label && item.label.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
                    return true;
                }                
            }
        }
  
      });
  }
}
