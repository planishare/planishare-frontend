import { User } from '@angular/fire/auth';
import { UserDetail } from 'src/app/features/user/models/user.model';

export interface IAuthUser {
    detail?: UserDetail;
    firebaseUser: User;
    isAnon: boolean;
}
