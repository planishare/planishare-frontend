import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFiltersCardComponent } from './post-filters-card.component';

describe('PostFiltersCardComponent', () => {
  let component: PostFiltersCardComponent;
  let fixture: ComponentFixture<PostFiltersCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostFiltersCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostFiltersCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
