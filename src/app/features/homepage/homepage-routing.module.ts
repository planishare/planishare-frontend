import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
    {
        path: '',
        component: HomepageComponent
    },
    {
        path: 'results',
        component: ResultsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomepageRoutingModule { }
