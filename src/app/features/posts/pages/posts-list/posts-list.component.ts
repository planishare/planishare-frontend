import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, takeUntil } from 'rxjs';

import { Pageable } from 'src/app/shared/models/pageable.model';
import { PostFilters, IURLPostsQueryParams } from 'src/app/features/posts/models/post-filter.model';
import { IAcademicLevel, ISubjectWithAxis, PostDetail } from 'src/app/features/posts/models/post.model';
import { OrderingType } from 'src/app/features/posts/constants/posts.enum';
import { UserDetail } from 'src/app/features/user/models/user.model';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/features/posts/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

@Component({
    selector: 'app-posts-list',
    templateUrl: './posts-list.component.html',
    styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent extends Unsubscriber implements OnInit {
    public urlQueryParams?: IURLPostsQueryParams;
    public pageResults?: Pageable<PostDetail>;
    public isLoading = true;
    public authUser: UserDetail | null;
    public academicLevels$: Observable<IAcademicLevel[]> = of();
    public subjectWithAxes$: Observable<ISubjectWithAxis[]> = of();
    public currentFilters?: PostFilters;
    public removeFilter?: { value: string };
    public changePage?: { value: number };

    constructor(
        private postsService: PostsService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private router: Router
    ) {
        super();
        this.urlQueryParams = this.activatedRoute.snapshot.queryParams;
        this.authUser = this.authService.getUserDetail();
    }

    public ngOnInit(): void {
        this.academicLevels$ = this.postsService.getAcademicLevels();
        this.subjectWithAxes$ = this.postsService.getSubjectWithAxis();
    }

    public getPosts(postFilters: PostFilters): void {
        this.currentFilters = postFilters;
        this.isLoading = true;
        this.urlQueryParams = postFilters.formatForURL();
        console.log('Filters: ', this.urlQueryParams);
        this.setQueryParams(this.urlQueryParams);

        this.postsService.getPosts(postFilters.formatForAPI()).pipe(
            catchError(() => {
                this.isLoading = false;
                this.commonSnackbarMsg.showErrorMessage();
                return of();
            }),
            takeUntil(this.ngUnsubscribe$)
        ).subscribe(resp => {
            const posts: PostDetail[] = resp!.results.map(post => new PostDetail(post));
            this.pageResults = new Pageable<PostDetail>({
                ...resp,
                results: posts
            });
            console.log('Results: ', this.pageResults);
            this.isLoading = false;
        });
    }

    private setQueryParams(urlQueryParams: IURLPostsQueryParams): void {
        urlQueryParams.ordering =
            urlQueryParams.ordering !== OrderingType.MOST_RECENT ? urlQueryParams.ordering : undefined;
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: urlQueryParams
        });
    }
}
