import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../services/data.service';

@Pipe({
  name: 'showProjectFilter'
})
export class ShowProjectFilterPipe implements PipeTransform {
  constructor(private dataService: DataService) {

  }

  transform(items: any, searchText: any, renderSchedule?: boolean) {

    if (!items)
      return [];
    if (searchText) {
      items = items.filter(item => {
        if (item.title && searchText && item.title.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
          return true;
        }
      });
    }
    if (renderSchedule) {
      if (items && items[0]) {
        this.dataService.dropDownChange(items[0]);
      } else {
        this.dataService.dropDownChange(null);
      }
    }
    return items;
  }
}
