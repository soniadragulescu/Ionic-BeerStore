import {Photo} from "../core/usePhotoGallery";
import {GeolocationPosition} from "@capacitor/core";

export interface BeerItemProps {
    _id?: string;
    name: string;
    price: number;
    creationDate?: string;
    favorite: boolean;
    photo?: Photo;
    location?: GeolocationPosition;
}
