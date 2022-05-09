import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ButtonsConfig } from '../types/navbar.type';

@Injectable({
    providedIn: 'root'
})
export class NavbarService {
    public buttonsConfig$: BehaviorSubject<ButtonsConfig> = new BehaviorSubject<ButtonsConfig>(
        {
            desktopSearchButton: true,
            desktopLogo: false,
            mobileSearchButton: true,
            mobileLogo: false
        }
    );

    constructor() { }

    public setButtonsConfig(config: ButtonsConfig): void {
        this.buttonsConfig$.next(config);
    }

    public getButtonConfig(): Observable<ButtonsConfig> {
        return this.buttonsConfig$.asObservable();
    }

    public setDefaultButtonConfig(): void {
        this.buttonsConfig$.next(
            {
                desktopSearchButton: true,
                desktopLogo: false,
                mobileSearchButton: true,
                mobileLogo: false
            }
        );
    }
}
