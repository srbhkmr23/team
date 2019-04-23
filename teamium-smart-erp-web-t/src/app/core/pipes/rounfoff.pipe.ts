import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'roundOff'
  })
  export class RoundOffPipe implements PipeTransform {

    constructor(){}
    transform(data:any){
        data=Number(data);
        return data.toFixed(2);
    }
}