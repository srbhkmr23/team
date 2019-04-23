import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySearch'
})
export class CurrencySearchPipe implements PipeTransform {

  transform(currencyList: any, searchText?: any): any {
    if(!currencyList || currencyList.length == 0)
    return [];
    if(!searchText)
    return currencyList;
    
    return currencyList.filter(currency => {
      return currency.code.toLowerCase().includes(searchText.toLowerCase());
    });
  }

}
