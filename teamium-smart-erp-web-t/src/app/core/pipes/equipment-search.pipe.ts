import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'equipmentSearch'
})
export class EquipmentSearchPipe implements PipeTransform {

  transform(items: Array<any>, searchText: any, serachBy: any) {
    if (!items)
      return [];
    if (!serachBy || !searchText)
      return items;

    return items.filter(item => {
      for (let filter of serachBy) {
        if (filter.toString().toLowerCase() === ('qualifiedName').toLowerCase()) {
          for (let element of item.resource.functions) {
            if (element.function && searchText && element.function.qualifiedName && element.function.qualifiedName.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
              return true;
            }
          }
        } else if (item[filter] && searchText && item[filter].toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
          return true;
        }
      }

    });
  }
}
