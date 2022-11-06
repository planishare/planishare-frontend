import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { UserDetail } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

type Stat = { text: string, value?: number, icon?: string, color?: string };

@Component({
    selector: 'app-user-posts',
    templateUrl: './user-posts.component.html',
    styleUrls: ['./user-posts.component.scss']
})
export class UserPostsComponent  {
    public ownerId?: number;
    public authUser?: UserDetail;
    public showOwnPosts = false;

    public stats: Stat[] = [];
    public likes: Stat = {
        text: 'Me gusta',
        icon: 'favorite_outline',
        color: 'red'
    };
    public views: Stat = {
        text: 'Visualizaciones',
        icon: 'visibility',
        color: 'blue'
    };
    public posts: Stat = {
        text: 'Publicaciones',
        icon: 'description',
        color: 'green'
    };

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService
    ) {
        const userId = this.route.snapshot.paramMap.get('id');
        this.ownerId = userId ? Number(userId) : undefined;
        this.authUser = this.authService.getUserDetail() ?? undefined;
        this.showOwnPosts = this.ownerId === this.authUser?.id;
        this.setStatsValues();

        this.authService.refreshUserDetail().subscribe(userDetail => {
            if (!!userDetail) {
                this.authUser = new UserDetail(userDetail);
                this.setStatsValues();
            }
        });
    }

    public setStatsValues(): void {
        this.stats = [];
        this.likes.value = this.authUser?.totalLikes ?? 0;
        this.views.value = this.authUser?.totalViews ?? 0;
        this.posts.value = this.authUser?.totalPosts ?? 0;
        this.stats.push(this.likes, this.views);
    }
}
