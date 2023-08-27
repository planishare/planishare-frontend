import { Directive, ElementRef, Input, OnInit, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appLoadingButton]'
})
export class LoadingButtonDirective implements OnInit, OnChanges {
    @Input() public loading = false;
    @Input() public loaderColor: string|null = null;

    private defaultContent = '';
    private loadersHtml = {
        ellipsis: (backgroundColor: string) => `<div class="loader-ellipsis">
            <div style="background-color: ${backgroundColor}"></div>
            <div style="background-color: ${backgroundColor}"></div>
            <div style="background-color: ${backgroundColor}"></div>
            <div style="background-color: ${backgroundColor}"></div>
        </div>`
    };

    constructor(
        private el: ElementRef<HTMLElement>
    ) {}

    public ngOnInit(): void {
        this.defaultContent = this.el.nativeElement.innerHTML ?? 'No content';
        this.loaderColor = this.loaderColor ?? getComputedStyle(this.el.nativeElement).color;
    }

    public ngOnChanges(changes : SimpleChanges): void {
        const { loading } = changes;
        if (loading && !loading.firstChange) {
            if (this.loading) {
                this.el.nativeElement.innerHTML = this.loadersHtml.ellipsis(this.loaderColor!);
            } else {
                this.el.nativeElement.innerHTML = this.defaultContent;
            }
        }
    }
}
