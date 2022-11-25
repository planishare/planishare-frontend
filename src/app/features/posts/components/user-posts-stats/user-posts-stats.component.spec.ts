import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPostsStatsComponent } from './user-posts-stats.component';

describe('UserPostsStatsComponent', () => {
  let component: UserPostsStatsComponent;
  let fixture: ComponentFixture<UserPostsStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPostsStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPostsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
