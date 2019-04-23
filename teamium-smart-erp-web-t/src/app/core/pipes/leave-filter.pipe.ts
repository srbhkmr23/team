import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leaveFilter'
})
export class LeaveFilterPipe implements PipeTransform {

  transform(items: any, searchText?: any): any {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    return items.filter(el => (searchText && el.leaveRecordDTO.leaveTypeDTO.type.toString().toLowerCase().includes(searchText.toString().toLowerCase())));
  }

}
