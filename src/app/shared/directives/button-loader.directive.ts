import { Directive, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appButtonLoader]'
})
export class ButtonLoaderDirective implements OnInit {
    private loader: any;
    private parent: any;

    @Input() public set appButtonLoader(value: boolean) {
        if (value) {
            this.viewContainer.clear();
            this.renderer.setProperty(this.loader, '@inOutLeft', true);
            this.renderer.insertBefore(this.parent, this.loader, this.el.nativeElement, true);
        } else {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.renderer.removeChild(this.parent, this.loader);
        }
    }

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>
    ) { }

    public ngOnInit(): void {
        this.parent = this.renderer.parentNode(this.el.nativeElement);
        this.loader = this.renderer.createElement('div');
        this.renderer.addClass(this.loader, "shapes-loader");
    }
}
