import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../services/data.service';


@Pipe({
  name: 'reelFilter'
})
export class ReelFilterPipe implements PipeTransform {

  constructor(private dataService:DataService){

  }
  transform(items: Array<any>, serachBy: any, filterByReel: any, filterByPhoto: any, filterByResume: any, filterByBio: any, filterByPress: any) {
    if (!items)
      return [];
    if (!serachBy || ((!filterByReel || filterByReel.length == 0) && (!filterByPhoto || filterByPhoto.length == 0) && (!filterByResume || filterByResume.length == 0) && (!filterByBio || filterByBio.length == 0) && (!filterByPress || filterByPress.length == 0)))
      return items;

    items= items.filter(item => {
     
      for (let reel of filterByReel) {
        if (item['type'] != undefined && item['type'] === reel) {
          return true;
        }
      }
      
      for (let photo of filterByPhoto) {
        if (item['type'] != undefined && item['type'] === photo) {
          return true;
        }
      }
      
      for (let resume of filterByResume) {
        if (item['type'] != undefined && item['type'] === resume) {
          return true;
        }
      }
      
      for (let bio of filterByBio) {
        if (item['type'] != undefined && item['type'] === bio) {
          return true;
        }
      }
      
      for (let press of filterByPress) {
        if (item['type'] != undefined && item['type'] === press) {
          return true;
        }
      }
    });

    this.dataService.changeReel(items);
    return items;
  }
}
