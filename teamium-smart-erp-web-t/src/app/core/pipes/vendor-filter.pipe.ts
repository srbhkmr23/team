import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vendorFilter'
})
export class VendorFilterPipe implements PipeTransform {

  transform(items: Array<any>, filterByDomains: any, filterByCountry: any, filterByCity: any) {
    if (!items)
      return [];
    if (((!filterByDomains || filterByDomains.length == 0) && (!filterByCountry || filterByCountry.length == 0) && (!filterByCity || filterByCity.length == 0)))
      return items;

    // return items.filter(item => {
    //   if (!filterByDomains || filterByDomains.length == 0) {
    //     return true;
    //   }
    //   for (let element of item.resource.functions) {
    //     for (let filter of filterByDomains) {
    //       if (element.function!=null&&element.function.id!=null&&element.function.id === filter) {
    //         return true;
    //       }
    //     }

    //   }

    return items.filter(item => {
        if (!filterByDomains || filterByDomains.length == 0) {
            return true;
        }

        for (let domain of filterByDomains) {
            if (item['domain']!=null&&item['domain'].toString().toLowerCase()===(domain.toString().toLowerCase())) {
                return true;
            }
        }
    }).filter(item => {
        if (!filterByCountry || filterByCountry.length == 0) {
            return true;
        }
        for (let country of filterByCountry) {
            if (item['address'] && item['address']['country']!=null && item['address']['country'].toString().toLowerCase()===(country.toString().toLowerCase())) {
                return true;
            }
        }
        
    }).filter(item => {
      
      if (!filterByCity || filterByCity.length == 0) {
        return true;
      }
      for (let city of filterByCity) {
        if (item['address'] && item['address']['city']!=null&&item['address']['city'].toString().toLowerCase()===(city.toString().toLowerCase())) {
          return true;
        }
      }
    });
  }
}
 