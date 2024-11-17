import { fireEvent, prettyDOM, render, screen } from '@testing-library/angular';
import { HomepageComponent } from 'src/app/pages/homepage/homepage/homepage.component';
import { IconsModule } from 'src/app/shared/icons/icons.module';
import { PostsListComponent } from 'src/app/pages/posts/pages/posts-list/posts-list.component';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

describe('Página principal', () => {
    beforeEach(async () => {
        await render(HomepageComponent, {
            imports: [
                IconsModule
            ],
            routes: [
                { path: '', component: HomepageComponent },
                { path: 'posts', component: PostsListComponent }
            ]
        });
    });

    test('Coincide con el snapshot', async () => {
        expect(prettyDOM()).toMatchSnapshot();
    });

    test('Hacer click en botón de ver planificaciones', async () => {
        const router = TestBed.inject(Router);

        const link = await screen.findByRole('link', { name: 'Ver planificaciones' });

        // Check if the link contains /posts
        expect(link).toBeTruthy();
        expect(link.getAttribute('routerLink')).toBe('/posts');

        // Assert navigation
        fireEvent.click(link);
        expect(router.url).toBe('/posts');
    });
});
