import { Pipe, PipeTransform } from '@angular/core';
import { UserSimpleDetail } from 'src/app/core/types/users.type';

@Pipe({
    name: 'getUsername'
})
export class GetUsernamePipe implements PipeTransform {

    public transform(value: UserSimpleDetail): string {
        let hasName = false;
        const name = `${value.first_name} ${value.last_name}`;
        if (!!value.first_name || !!value.last_name) {
            hasName = true;
        }
        return hasName ? name : value.email;
    }

}
