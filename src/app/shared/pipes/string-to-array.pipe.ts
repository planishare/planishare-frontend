import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stringToArray'
})
export class StringToArrayPipe implements PipeTransform {

    public transform(value: string, ...args: unknown[]): Array<string> {
        const formatedString = value.replace(/[ '\[\]]/g, '');
        const newArray = !!formatedString ? formatedString.split(',') : [];
        return newArray;
    }

}
