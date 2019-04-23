import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'functionFilter'
})
export class FunctionFilterPipe implements PipeTransform {

  transform(items: any, searchText?: any): any {
    if (!items){
      return [];
    }
    if(!searchText){
      return items;
    }else{
      return items.filter(item => {
        if (item.qualifiedName.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
                 return true;
               }
    
       });
      }
    
    }

}
