import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'expensesReportDateRangeFilter'
})
export class ExpensesReportDateRangeFilterPipe implements PipeTransform {
  transform(items: any, from?: any, to?: any): any {
   let  fromDate=moment(from).format('LL');

   let toDate=moment(to).format('LL');
    if (!items) {
      return [];
    }
   
    if (from &&  to) {
      items = items.filter(item => {
         
          let formatedDate = moment(item.date).format('LL');
          if(formatedDate >= fromDate && formatedDate <= toDate) {
            return true
          }
        
      });
    }
    return items;
   

  }
  
}
