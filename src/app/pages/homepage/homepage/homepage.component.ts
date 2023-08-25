import { Component } from '@angular/core';
import { WindowResizeService } from 'src/app/shared/services/window-resize.service';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
}
