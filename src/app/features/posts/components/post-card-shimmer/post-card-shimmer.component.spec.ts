import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardShimmerComponent } from './post-card-shimmer.component';

describe('PostCardShimmerComponent', () => {
    let component: PostCardShimmerComponent;
    let fixture: ComponentFixture<PostCardShimmerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PostCardShimmerComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PostCardShimmerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
