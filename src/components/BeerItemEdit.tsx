import React, { useContext, useEffect, useState } from 'react';
import {IonCheckbox, IonLabel} from '@ionic/react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { BeerItemContext } from './BeerItemProvider';
import { RouteComponentProps } from 'react-router';
import { BeerItemProps } from './BeerItemProps';

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
        }
    }, [match.params.id, items]);
    const handleSave = () => {
        const editedItem = item ? { ...item, name, price, favorite, creationDate : new Date().toLocaleDateString() } : { name, price, favorite, creationDate : new Date().toLocaleDateString() };
        saveItem && saveItem(editedItem).then(() => history.goBack());
    };

    const handleDelete = () => {
        const editedItem = item ? { ...item, name, price, favorite, creationDate : new Date().toLocaleDateString() } : { name, price, favorite, creationDate : new Date().toLocaleDateString() };
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
                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default BeerItemEdit;
