import {useEffect, useState} from "react";
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera"
import {isPlatform} from "@ionic/react";
import {Directory, Filesystem} from "@capacitor/filesystem";
import {PhotoItem} from "../types/PhotoItem";
import {Capacitor} from "@capacitor/core";
import {Preferences} from "@capacitor/preferences";

const PHOTO_STORAGE = 'photos';
export const usePhoto = () => {
    const [photos, setPhotos] = useState<PhotoItem[]>([]);

    useEffect(() => {
        const loadSaved = async () => {
            const { value } = await Preferences.get({ key: PHOTO_STORAGE });
            const photosInPreferences = (value ? JSON.parse(value) : []) as PhotoItem[];

            for (let photo of photosInPreferences) {
                const file = await Filesystem.readFile({
                    path: photo.filepath,
                    directory: Directory.Data,
                });
                // Web platform only: Load the photo as base64 data
                photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
            }
            setPhotos(photosInPreferences);
        };
        loadSaved();
    }, []);
    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });
        const fileName = Date.now() + '_ionic.jpeg';
        const savedFileImage = await savePicture(photo, fileName);
        const newPhotos = [savedFileImage, ...photos];
        setPhotos(newPhotos);
        Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
    };

    const savePicture = async (photo: Photo, fileName: string): Promise<PhotoItem> => {
        let base64Data: string | Blob;
        // "hybrid" will detect Cordova or Capacitor;
        if (isPlatform('hybrid')) {
            const file = await Filesystem.readFile({
                path: photo.path!,
            });
            base64Data = file.data;
        } else {
            base64Data = await base64FromPath(photo.webPath!);
        }
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        if (isPlatform('hybrid')) {
            // Display the new image by rewriting the 'file://' path to HTTP
            // Details: https://ionicframework.com/docs/building/webview#file-protocol
            return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
            };
        } else {
            // Use webPath to display the new image instead of base64 since it's
            // already loaded into memory
            return {
                filepath: fileName,
                webviewPath: photo.webPath,
            };
        }
    };

    async function base64FromPath(path: string): Promise<string> {
        const response = await fetch(path);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject('method did not return a string');
                }
            };
            reader.readAsDataURL(blob);
        });
    }

    return {
        photos,
        takePhoto,
    };

}