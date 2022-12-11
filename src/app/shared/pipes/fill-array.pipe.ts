import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fillArray'
})
export class FillArrayPipe implements PipeTransform {

    public transform(length: number): number[] {
        const baseArray = [...Array(length).keys()];
        baseArray.push(length);
        baseArray.shift();
        return baseArray;
    }

}
