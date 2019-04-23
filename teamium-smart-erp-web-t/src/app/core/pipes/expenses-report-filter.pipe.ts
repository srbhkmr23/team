import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'expensesReportFilter'
})
export class ExpensesReportFilterPipe implements PipeTransform {

  transform(items: any, searchText?: any): any {
    if (!items) {
      return [];
    }
   
    if (searchText) {
      items = items.filter(item => {
         
          let formatedDate = moment(item.date).format("DD/MM/YYYY");
          if(formatedDate && searchText && searchText &&  formatedDate.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
            return true
          }
        if (("ER"+item.id).toString().toLowerCase().includes(searchText.toString().toLowerCase()) || ("Team-"+item.project.id).toString().toLowerCase().includes(searchText.toString().toLowerCase()) || item.project.title.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
          return true;
        }
      });
    }
    return items;
   

  }

}
