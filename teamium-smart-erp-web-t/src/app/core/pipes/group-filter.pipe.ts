import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../services/data.service';

@Pipe({
  name: 'groupFilter'
})
export class GroupFilterPipe implements PipeTransform {
  constructor(private dataService: DataService) {

  }
  transform(items: any, searchText?: any): any {
    if (!items) {
      return [];
    }
    if (this.dataService.pathVariable && this.dataService.pathVariable[0] && this.dataService.pathVariable[0].start) {
      return items;
    }
    if (searchText) {
      items = items.filter(item => {
        if (item.name.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
          return true;
        }
      });
    }
    if (items && items[0]) {
      this.dataService.dropDownChange(items[0]);
    } else {
      this.dataService.dropDownChange(null);
    }
    return items;
  }

}
