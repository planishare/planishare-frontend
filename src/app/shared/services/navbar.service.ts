import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ButtonsConfig } from '../types/navbar.type';

@Injectable({
    providedIn: 'root'
})
export class NavbarService {

    constructor() { }

    private defaultConfig: ButtonsConfig = {
        showSeachButton: true,
        backgroundColor: 'var(--purple-light)'
    };

    public buttonsConfig$: BehaviorSubject<ButtonsConfig> = new BehaviorSubject<ButtonsConfig>(this.defaultConfig);

    public getButtonsConfig(): Observable<ButtonsConfig> {
        return this.buttonsConfig$.asObservable();
    }

    public setButtonConfig(config: ButtonsConfig): void {
        this.buttonsConfig$.next({
            ...this.buttonsConfig$.value,
            ...config
        });
    }

    public resetConfig(): void {
        this.buttonsConfig$.next(this.defaultConfig);
    }
}
