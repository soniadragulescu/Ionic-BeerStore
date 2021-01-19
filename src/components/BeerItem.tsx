import React from 'react';
import { IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonImg, IonCardSubtitle, IonCardContent } from '@ionic/react';
import { BeerItemProps } from './BeerItemProps';

interface BeerItemPropsExt extends BeerItemProps {
    onEdit: (id?: string) => void;
}

const BeerItem: React.FC<BeerItemPropsExt> = ({ _id, name, price, creationDate, favorite, photo, onEdit }) => {
    return (
        <IonCard onClick={() => onEdit(_id)}>
            <IonImg src={photo?.webviewPath} className = "card-img"/>
            <IonCardHeader>
                <IonCardSubtitle>{favorite ? '<3' : 'X'}</IonCardSubtitle>
                <IonCardTitle>{name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonItem>{price} RON</IonItem>
                <IonItem>Date: {creationDate}</IonItem>
            </IonCardContent>
        </IonCard>
    );
};

export default BeerItem;