import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserDetail } from 'src/app/core/types/users.type';

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

        this.authUser = this.authService.getUserProfile();
        this.showOwnPosts = this.ownerId === this.authUser?.id;
        this.likes.value = this.authUser?.total_likes ?? 0;
        this.views.value = this.authUser?.total_views ?? 0;
        this.posts.value = this.authUser?.total_posts ?? 0;
        this.stats.push(this.likes, this.views);
    }
}
