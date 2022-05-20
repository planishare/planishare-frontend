import { Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytesResumable, UploadTaskSnapshot } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class FirebaseStorageService {

    constructor(
        private storage: Storage
    ) { }

    // Upload a file in firestore and returns its url
    public async uploadPostFile(file: File): Promise<any> {
        const ext = file!.name.split('.').pop();
        const name = file!.name.split('.')[0];
        const date = new Date().getTime();
        const fileName = `${name}|${file.size}|${date}.${ext}`;

        const storageRef = ref(this.storage, `/posts/files/${fileName}`);

        const task = uploadBytesResumable(storageRef, file);
        task.on('state_changed', (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        });
        await task;

        // Get firebase file url
        const url = await getDownloadURL(storageRef);
        return url;
    }
}
