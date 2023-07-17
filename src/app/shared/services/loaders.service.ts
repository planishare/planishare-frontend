import { Injectable } from '@angular/core';

/*****************************************************************
    * Note: Book loader is used in index.html, add new GENERIC logic
    * for others loaders called from a component.
******************************************************************/
@Injectable({
    providedIn: 'root'
})
export class LoadersService {
    public bookLoaderEl: HTMLElement|null = null;

    constructor() { }

    public hideBookLoader(): void {
        this.bookLoaderEl = document.querySelector('#book-loader');
        this.bookLoaderEl?.remove();
    }

    public showBookLoader(): void {
        if (this.bookLoaderEl) {
            document.body.appendChild(this.bookLoaderEl);
        }
    }
}
