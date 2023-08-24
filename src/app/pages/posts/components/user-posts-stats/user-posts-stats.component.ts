import { Component, Input } from '@angular/core';
import { PostsStats } from '../../models/posts-stats.type';

@Component({
    selector: 'app-user-posts-stats',
    templateUrl: './user-posts-stats.component.html',
    styleUrls: ['./user-posts-stats.component.scss']
})
export class UserPostsStatsComponent {
    @Input() public stats?: PostsStats;

    constructor() { }
}
