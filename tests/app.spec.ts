import { prettyDOM, render, screen } from '@testing-library/angular';
import { HomepageComponent } from '../src/app/pages/homepage/homepage/homepage.component';
import { IconsModule } from '../src/app/shared/icons/icons.module';

describe('Página principal', () => {
    beforeEach(async () => {
        await render(HomepageComponent, {
            imports: [IconsModule]
        });
    });

    test('Buscar texto de prueba', async () => {
        const text = await screen.findByText('Comparte y apoya a la comunidad');
        console.log(prettyDOM(text));
        expect(text).toBeTruthy();
    });
});
