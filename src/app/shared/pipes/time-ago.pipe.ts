/*
*
* Credits: Seannvm, Janaka Edirisinghe
* URL: https://stackoverflow.com/questions/61341891/is-there-are-angular-date-ago-pipe
*
*/

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

    public transform(value: any, args?: any): any {
        value = new Date(value);
        if (value) {
            const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            if (seconds < 29) {
                return 'Justo ahora';
            }
            const intervals: { [key: string]: number } = {
                'año': 31536000,
                'mes': 2592000,
                'semana': 604800,
                'día': 86400,
                'hora': 3600,
                'minuto': 60,
                'segundo': 1
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0) {
                    if (counter === 1) {
                        return 'Hace ' + counter + ' ' + i; // singular
                    } else {
                        if (i === 'mes') {
                            return 'Hace ' + counter + ' ' + i + 'es'; // plural
                        }
                        return 'Hace ' + counter + ' ' + i + 's'; // plural
                    }
                }
            }
        }
        return value;
    }

}
