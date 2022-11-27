import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

    public transform(value: string, lenght: number): string {
        return value.length < lenght ? value : value.substring(0, lenght - 3) + '...';
    }

}
