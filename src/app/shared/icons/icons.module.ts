import { NgModule } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
    IconHeart,
    IconHeartFilled,
    IconDotsVertical,
    IconMessageReport,
    IconPencil,
    IconTrash,
    IconFileDescription,
    IconEye,
    IconX,
    IconChevronRight,
    IconChevronLeft,
    IconFilterCheck,
    IconChevronDown,
    IconSearch,
    IconDownload,
    IconArrowLeft,
    IconPlus,
    IconSend,
    IconDeviceFloppy,
    IconMenu,
    IconLogout,
    IconEyeOff,
    IconBrandLinkedin,
    IconPalette
} from 'angular-tabler-icons/icons';

const icons = {
    IconHeart,
    IconHeartFilled,
    IconDotsVertical,
    IconMessageReport,
    IconPencil,
    IconTrash,
    IconFileDescription,
    IconEye,
    IconX,
    IconChevronRight,
    IconChevronLeft,
    IconFilterCheck,
    IconChevronDown,
    IconSearch,
    IconDownload,
    IconArrowLeft,
    IconPlus,
    IconSend,
    IconDeviceFloppy,
    IconMenu,
    IconLogout,
    IconEyeOff,
    IconBrandLinkedin,
    IconPalette
};

@NgModule({
    imports: [
        TablerIconsModule.pick(icons)
    ],
    exports: [
        TablerIconsModule
    ]
})
export class IconsModule { }
