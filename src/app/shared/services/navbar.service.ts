import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ButtonsConfig } from '../types/navbar.type';

@Injectable({
    providedIn: 'root'
})
export class NavbarService {

    constructor() { }

    public buttonsConfig$: BehaviorSubject<ButtonsConfig> = new BehaviorSubject<ButtonsConfig>({
        showSeachButton: true
    });

    public getButtonsConfig(): Observable<ButtonsConfig> {
        return this.buttonsConfig$.asObservable();
    }

    public setButtonConfig(config: ButtonsConfig): void {
        this.buttonsConfig$.next({
            ...this.buttonsConfig$.value,
            ...config
        });
    }
}
