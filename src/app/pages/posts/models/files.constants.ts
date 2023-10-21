import { viewerType } from "ngx-doc-viewer";
import { NativeViewer } from "./post.model";

export const FILE_COLOR = {
    doc: 'blue',
    docm: 'blue',
    docx: 'blue',
    txt: 'blue',
    csv: 'green',
    xlam: 'green',
    xls: 'green',
    xlsx: 'green',
    xml: 'green',
    ppt: 'orange',
    pptx: 'orange',
    pdf: 'red'
};

export const NATIVE_VIEWER: { [key: string]: NativeViewer } = {
    jpg: 'img',
    jpeg: 'img',
    png: 'img',
    gif: 'img',
    bmp: 'img',
    webp: 'img',
    svg: 'img',
    tiff: 'img',
    ico: 'img',
    heif: 'img',
    jp2: 'img'
};

export const NGX_DOC_VIEWER: { [key: string]: viewerType } = {
    doc: 'office',
    docm: 'office',
    docx: 'office',
    txt: 'office',
    csv: 'office',
    xlam: 'office',
    xls: 'office',
    xlsx: 'office',
    xml: 'office',
    ppt: 'office',
    pptx: 'office',
    pdf: 'google'
};
