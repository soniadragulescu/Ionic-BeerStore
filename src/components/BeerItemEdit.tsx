import React, { useContext, useEffect, useState } from 'react';
import {IonCheckbox, IonLabel} from '@ionic/react';
import { createAnimation } from '@ionic/react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonActionSheet,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonImg,
    IonIcon
} from '@ionic/react';
import { getLogger } from '../core';
import { BeerItemContext } from './BeerItemProvider';
import { RouteComponentProps } from 'react-router';
import { BeerItemProps } from './BeerItemProps';
import {Photo, usePhotoGallery} from "../core/usePhotoGallery";
import {camera, locate} from "ionicons/icons";
import {Geolocation, GeolocationPosition} from "@capacitor/core";
import {MyMap} from "./MyMap";

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const BeerItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
    const { items, saving, savingError, saveItem, deleteItem } = useContext(BeerItemContext);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0.0);
    const [favorite, setFavorite] = useState(true);
    const [item, setItem] = useState<BeerItemProps>();
    const [photo, setPhoto] = useState<Photo>();
    const [location, setLocation] = useState<GeolocationPosition>();
    const { takePhoto } = usePhotoGallery();

    function chainAnimations(){
        const elB = document.querySelector('.photoButton');
        const elC = document.querySelector('.mapButton');
        if (elB && elC) {
            const animationA = createAnimation()
                .addElement(elB)
                .duration(5000)
                .keyframes([
                    { offset: 0, transform: 'scale(1) rotate(0)' },
                    { offset: 0.5, transform: 'scale(1.2) rotate(45deg)' },
                    { offset: 1, transform: 'scale(1) rotate(0)' }
                ]);
            const animationB = createAnimation()
                .addElement(elC)
                .duration(7000)
                .fromTo('transform', 'scale(1)', 'scale(0.5)')
                .afterStyles({
                    'background': 'green'
                });
            (async () => {
                await animationA.play();
                await animationB.play();
            })();
        }
    }

    useEffect(chainAnimations, []);

    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const item = items?.find(it => it._id === routeId);
        log(routeId);
        setItem(item);
        if (item) {
            setName(item.name);
            setPrice(item.price);
            setFavorite(item.favorite);
            setPhoto(item.photo);
            setLocation(item.location);
        }
    }, [match.params.id, items]);

    const handleSave = () => {
        const editedItem = item ? { ...item, name, price, favorite, photo,location, creationDate : new Date().toLocaleDateString() } : { name, price, favorite, photo,location, creationDate : new Date().toLocaleDateString() };
        saveItem && saveItem(editedItem).then(() => history.goBack());
    };

    const handleDelete = () => {
        const editedItem = item ? { ...item, name, price, favorite, photo, location, creationDate : new Date().toLocaleDateString() } : { name, price, favorite, photo, location, creationDate : new Date().toLocaleDateString() };
        deleteItem && deleteItem(editedItem).then(() => history.goBack());
    };

    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>
                            Save
                        </IonButton>
                        <IonButton onClick={handleDelete}>
                            Delete
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLabel>Name: </IonLabel>
                <IonInput value={name} onIonChange={e => setName(e.detail.value || '')} />
                <IonLabel>Price: </IonLabel>
                <IonInput value={price} onIonChange={e => setPrice(parseFloat(e.detail.value ? e.detail.value
                                                                                                        : "0.0") || 0.0)} />
                <IonLabel>Favorite: </IonLabel>
                <IonCheckbox color = "light" checked = {favorite} onIonChange={e => setFavorite(e.detail.checked)} />
                <IonImg src={photo?.webviewPath}
                        className = "card-img"/>
                <MyMap
                    lat={location ? (location.coords ? location.coords.latitude : 0.0) : 0.0}
                    lng={location ?  (location.coords ? location.coords.longitude : 0.0)  : 0.0}
                    onMapClick={(e: any) => {
                        console.log(e.latLng.lat(), e.latLng.lng())
                        setLocation({
                            coords: {
                                latitude: e.latLng.lat(),
                                longitude: e.latLng.lng(),
                                accuracy: e.latLng.accuracy,
                            },
                            timestamp: Date.now()
                        })
                    }}
                    onMarkerClick={log('onMarker')}
                />
                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
            </IonContent>
            <div className = "photoButton">
                <IonFab vertical="bottom" horizontal="start" slot="fixed">
                    <IonFabButton onClick={async () => {
                        const savedPhoto = await takePhoto();
                        console.log(savedPhoto, "photo saved")
                        setPhoto(savedPhoto);
                    }}>
                        <IonIcon icon={camera}/>
                    </IonFabButton>
                </IonFab>
            </div>
            <div className = "mapButton">
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={async () => {
                        Geolocation.getCurrentPosition()
                            .then(location => {
                                console.log(location)
                                setLocation({
                                    coords: {
                                        latitude: location.coords.latitude,
                                        longitude: location.coords.longitude,
                                        accuracy: location.coords.accuracy,
                                    },
                                    timestamp: Date.now()
                                });
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    }}>
                        <IonIcon icon={locate}/>
                    </IonFabButton>
                </IonFab>
            </div>
        </IonPage>
    );
};

export default BeerItemEdit;
