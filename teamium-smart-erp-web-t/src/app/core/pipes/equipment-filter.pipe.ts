import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'equipmentFilter'
})
export class EquipmentFilterPipe implements PipeTransform {

  transform(items: Array<any>, filterByFunctions: any, filterByModels: any, filterByLocations: any) {
    if (!items)
      return [];
    if (((!filterByFunctions || filterByFunctions.length == 0) && (!filterByModels || filterByModels.length == 0) && (!filterByLocations || filterByLocations.length == 0)))
      return items;

    return items.filter(item => {
      if (!filterByFunctions || filterByFunctions.length == 0) {
        return true;
      }
      for (let element of item.resource.functions) {
        for (let filter of filterByFunctions) {
          if (element.function!=null&&element.function.id!=null&&element.function.id === filter) {
            return true;
          }
        }

      }

    }).filter(item => {
      if (!filterByModels || filterByModels.length == 0) {
        return true;
      }
      for (let model of filterByModels) {
        if (item['model']!=null&&item['model'].toString().toLowerCase()===(model.toString().toLowerCase())) {
          return true;
        }
      }
    }).filter(item => {
      
      if (!filterByLocations || filterByLocations.length == 0) {
        return true;
      }
      for (let location of filterByLocations) {
        if (item['location']!=null&&item['location'].toString().toLowerCase()===(location.toString().toLowerCase())) {
          return true;
        }
      }
    });
  }
}
