import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'globalSort'
})
export class GlobalSortPipe implements PipeTransform {
  transform(items: any, sortBy: string, sortValue: number) {
    if (!items)
      return [];
    if (!sortBy)
      return items;

    return items.sort((item1, item2) => {
      if (!item1[sortBy]) {
        return 1;
      }
      if (!item2[sortBy]) {
        return -1;
      }
      return sortValue * item1[sortBy].toString().toUpperCase().localeCompare(item2[sortBy].toString().toUpperCase())
    });

  }
}


