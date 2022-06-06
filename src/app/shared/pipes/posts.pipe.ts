import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getDocType'
})
export class GetDocType implements PipeTransform {
    public transform(docUrl: string, docTypes: any): string {
        const docName =  docUrl.split('/o/')[1].split('?')[0].split('.');
        const docType = docName[docName.length - 1];

        if (docTypes.doc.find((ext: any) => ext === docType)) {
            return 'doc';
        }
        if (docTypes.ppt.find((ext: any) => ext === docType)) {
            return 'ppt';
        }
        if (docTypes.xls.find((ext: any) => ext === docType)) {
            return 'xls';
        }
        return docType;
    }
}

@Pipe({
    name: 'getDocName'
})
export class GetDocName implements PipeTransform {
    public transform(docUrl: string): string {
        try {
            const realFileName =  decodeURIComponent(docUrl.split('/o/')[1].split('?')[0]);
            const shortFileName = realFileName.split('___')[0];
            return shortFileName;
        } catch (error) {
            return '';
        }
    }
}
