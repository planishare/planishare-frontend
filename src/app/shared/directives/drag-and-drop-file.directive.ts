// Directive from: https://medium.com/@tarekabdelkhalek/how-to-create-a-drag-and-drop-file-uploading-in-angular-78d9eba0b854
// By: Tarek Noaman

import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appDragAndDropFile]'
})
export class DragAndDropFileDirective {

    @HostBinding('style.filter') public fileOver: string = 'opacity(0.6)';
    @Output() public fileDropped = new EventEmitter<any>();

    // Dragover listener
    @HostListener('dragover', ['$event']) public onDragOver(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = 'opacity(1)';
    }

    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = 'opacity(0.6)';
    }

    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = 'opacity(0.6)';
        let files = event.dataTransfer.files;
        if (files.length > 0) {
            console.log('DragAndDropFileDirective', files);
            this.fileDropped.emit(files);
        }
    }
}
