import { viewerType } from "ngx-doc-viewer";

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

export const DOCUMENT_VIEWER: { [key: string]: viewerType } = {
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
