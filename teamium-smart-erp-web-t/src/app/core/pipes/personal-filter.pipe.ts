import { Pipe, PipeTransform } from '@angular/core';
import { Rates } from '../entity/Rates';

@Pipe({
  name: 'personalFilter'
})
export class PersonalFilterPipe implements PipeTransform {

  transform(items: Array<any>, serachBy: any, filterByFunctions: any, filterBySkills: any, filterByLocations: any, filterByFreelancer: any, filterByRate: any, filterByStatus: any, rates: Rates) {
    
    if (!items)
      return [];
    if (!serachBy || ((!filterByFunctions || filterByFunctions.length == 0) && (!filterBySkills || filterBySkills.length == 0) && (!filterByLocations || filterByLocations.length == 0) && (!filterByFreelancer || filterByFreelancer.length == 0) && (!filterByRate || filterByRate.length == 0) && (!filterByStatus || filterByStatus.length == 0)&& (!rates.rangeValues || rates.rangeValues.length == 0)))
      return items;

    return items.filter(item => {
      if (!filterByFunctions || filterByFunctions.length == 0) {
        return true;
      }
      if(item.resource && item.resource.functions){
        for (let element of item.resource.functions) {
          for (let filter of filterByFunctions) {
            if (element.function != null && element.function.id != null && element.function.id === filter) {
              return true;
            }
          }
        }
      }
    }).filter(item => {
      if (!filterBySkills || filterBySkills.length == 0) {
        return true;
      }
      if(item.skills){
        for (let element of item.skills) {
          for (let skill of filterBySkills) {
            if (element.domain != null && element.domain != null && element.domain.toLocaleLowerCase() === (skill.toLocaleLowerCase())) {
              return true;
            }
          }
        }
      }
    }).filter(item => {
      if (!filterByLocations || filterByLocations.length == 0) {
        return true;
      }
      for (let location of filterByLocations) {
        if (item['location'] != null && item['location'].toString().toLowerCase().includes(location.toString().toLowerCase())) {
          return true;
        }
      }
    }).filter(item => {
      if (!filterByFreelancer || filterByFreelancer.length == 0) {
        return true;
      }
      for (let freelancer of filterByFreelancer) {
        if (item['freelance'] != undefined && item['freelance'] === freelancer) {
          return true;
        }
      }
    }).filter(item => {
      if (!filterByStatus || filterByStatus.length == 0) {
        return true;
      }
      for (let status of filterByStatus) {
        if (item['available'] != undefined && item['available'] === status) {
          return true;
        }
      }
    }).filter(item => {
          
      if ((!filterByFreelancer || filterByFreelancer.length == 0) || (!rates.rangeValues || rates.rangeValues.length == 0)) {
        return true;
      }
      if(rates.maxValue==rates.rangeValues[1] && rates.minValue==rates.rangeValues[0]){
        return true;
      }
      
      if (rates.rangeValues) {
        if(item.resource && item.resource.functions){
          console.log('Range start value is1 : ' , rates.rangeValues[0]);
        for (let func of item.resource.functions) {
          console.log('Range end value is 2 : ' , rates.rangeValues[1]);
          if(func.rates){
            for (let rate of func.rates) {
              if(rate.value != null && rate.value<=rates.rangeValues[1] && rate.value>=rates.rangeValues[0]){
                return true;
              }
            }
          }
        }
      }
      }    
    });
  }
}