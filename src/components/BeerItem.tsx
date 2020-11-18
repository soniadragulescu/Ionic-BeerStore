import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { BeerItemProps } from './BeerItemProps';

interface BeerItemPropsExt extends BeerItemProps {
    onEdit: (id?: string) => void;
}

const BeerItem: React.FC<BeerItemPropsExt> = ({ _id, name, price, creationDate, favorite, onEdit }) => {
    return (
        <IonItem onClick={() => onEdit(_id)}>
            <IonLabel>{name}</IonLabel>
            <IonLabel class = "price-column">{price}</IonLabel>
            <IonLabel class = "creation-date-column">{creationDate}</IonLabel>
            <IonLabel>{favorite ? '<3' : 'X'}</IonLabel>
        </IonItem>
    );
};

export default BeerItem;