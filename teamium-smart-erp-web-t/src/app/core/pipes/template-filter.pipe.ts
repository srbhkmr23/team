import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'templateFilter'
})
export class TemplateFilterPipe implements PipeTransform {

  transform(items: any, searchText?: any): any {
    if (!items){
      return [];
    }
    if(!searchText){
      return items;
    }else{
      return items.filter(item => {
        if (item.title.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
                 return true;
               }
    
       });
      }
    
    }

}
