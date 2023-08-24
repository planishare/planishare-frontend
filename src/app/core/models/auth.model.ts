import { User } from '@angular/fire/auth';
import { UserDetail } from 'src/app/pages/user/models/user.model';

export type BasicCredentials = {
    email: string,
    password: string
}
export interface IAuthUser {
    detail?: UserDetail;
    firebaseUser: User;
    isAnon: boolean;
}
