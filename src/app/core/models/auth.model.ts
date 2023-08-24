import { User } from '@angular/fire/auth';
import { UserDetail } from 'src/app/features/user/models/user.model';

export type BasicCredentials = {
    email: string,
    password: string
}
export interface IAuthUser {
    detail?: UserDetail;
    firebaseUser: User;
    isAnon: boolean;
}

export enum FirebaseAuthErrorCodes {
    INVALID_PASSWORD = 'auth/wrong-password',
    EMAIL_NOT_FOUND = 'auth/user-not-found',
    TOO_MANY_REQUESTS = 'auth/too-many-requests',
    USER_NOT_FOUND = 'auth/user-not-found',
    USER_DISABLED = 'auth/user-disabled',
    POPUP_CLOSED_BY_USER = 'auth/popup-closed-by-user',
    EMAIL_ALREADY_USED = 'auth/email-already-in-use'
}
