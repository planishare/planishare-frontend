import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPaginatedListComponent } from './post-paginated-list.component';

describe('PostPaginatedListComponent', () => {
    let component: PostPaginatedListComponent;
    let fixture: ComponentFixture<PostPaginatedListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PostPaginatedListComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PostPaginatedListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
