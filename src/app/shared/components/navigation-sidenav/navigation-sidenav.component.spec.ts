import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationSidenavComponent } from './navigation-sidenav.component';

describe('NavigationSidenavComponent', () => {
    let component: NavigationSidenavComponent;
    let fixture: ComponentFixture<NavigationSidenavComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ NavigationSidenavComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavigationSidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
