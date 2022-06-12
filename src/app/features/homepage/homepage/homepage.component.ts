import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, forkJoin, map, Observable, of, takeUntil, tap } from 'rxjs';
import { PostsService } from 'src/app/core/services/posts.service';
import { RoundedSelectSearchGroup, RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { isMobile } from 'src/app/shared/utils';
import { AcademicLevel, Axis, PostDetail, PostsQueryParams, Subject } from 'src/app/core/types/posts.type';
import { Router } from '@angular/router';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { NavbarService } from 'src/app/shared/services/navbar.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnDestroy {
    public isMobile = isMobile;

    constructor(
        private navbarService: NavbarService
    ) {
        this.navbarService.setButtonConfig({
            backgroundColor: 'var(--pink-light)'
        });
    }

    public ngOnDestroy(): void {
        this.navbarService.resetConfig();
    }
}
