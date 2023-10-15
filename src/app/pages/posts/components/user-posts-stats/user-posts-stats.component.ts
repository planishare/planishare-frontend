import { Component, OnInit } from '@angular/core';
import { PostsStats } from '../../models/posts-stats.type';
import { AuthService } from 'src/app/core/services/auth.service';
import { filter, takeUntil } from 'rxjs';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

@Component({
    selector: 'app-user-posts-stats',
    templateUrl: './user-posts-stats.component.html',
    styleUrls: ['./user-posts-stats.component.scss']
})
export class UserPostsStatsComponent extends Unsubscriber implements OnInit {
    public stats: PostsStats = {
        likes: {
            text: 'Me gusta',
            icon: 'heart',
            color: 'red',
            value: 0
        },
        views: {
            text: 'Visualizaciones',
            icon: 'eye',
            color: 'blue',
            value: 0
        },
        posts: {
            text: 'Publicaciones',
            icon: 'description',
            color: 'green',
            value: 10
        }
    };
    public summary: string = "";

    constructor(
        private authService: AuthService
    ) {
        super();
    }

    public ngOnInit(): void {
        this.authService.user$.pipe(
            filter(user => !!user?.detail),
            takeUntil(this.ngUnsubscribe$)
        ).subscribe(user => {
            this.stats.posts.value = user?.detail?.totalPosts ?? 0;
            this.stats.views.value = user?.detail?.totalViews ?? 0;
            this.stats.likes.value = user?.detail?.totalLikes ?? 0;

            if (this.stats.posts.value) {
                if (this.stats.views.value) {
                    this.summary = `Tus ${this.stats.posts.value} publicaciones han sido vistas ${this.stats.views.value} veces en total y juntas tienen ${this.stats.likes.value} me gusta.`;
                } else {
                    this.summary = `Haz creado ${this.stats.posts.value} publicaciones.`;
                }
                this.summary += " Gracias por ayudar a la comunidad, sigue así! 🎈";
            } else {
                this.summary = "Anímante, crea un publicación y comparte con la comunidad! 🙌";
            }
        });
    }
}
