import React, {useContext, useEffect, useState} from 'react';
import { RouteComponentProps } from 'react-router';
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonList, IonListHeader, IonLoading,
    IonPage,
    IonTitle,
    IonToolbar,
    IonLabel, IonSearchbar, IonInfiniteScroll, IonInfiniteScrollContent, IonCheckbox
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { getLogger } from '../core';
import { BeerItemContext } from './BeerItemProvider';
import BeerItem from "./BeerItem";
import {AuthContext} from "../auth";

const log = getLogger('ItemList');
const itemsAtOnce = 20;
const BeerItemList: React.FC<RouteComponentProps> = ({ history }) => {
    const { items, fetching, fetchingError, getItemsOnPage } = useContext(BeerItemContext);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const { token, logout } = useContext(AuthContext);
    const [searchItems, setSearchItems] = useState(items);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtering, setFiltering] = useState(false);
    const [pageNumber, setPageNumber] = useState(itemsAtOnce);
    useEffect(()=>{
        console.log(items)
        //const results = items?.filter(item => item.name.toLowerCase().includes(searchTerm));
        //setSearchItems(results);
        setPageNumber(itemsAtOnce);
        fetchData()
    }, [searchTerm, items, filtering])
    log('render');

    async function fetchData(){
        console.log("fetch data .. ");
        const result = items?.filter(item => {
            if (item.name.toLowerCase().includes(searchTerm) && (!filtering || item.favorite)) {
                return item;
            }
        })
        setSearchItems(result?.slice(0, pageNumber))
        setPageNumber(pageNumber + itemsAtOnce);
        if (result && pageNumber > result?.length) {
            setDisableInfiniteScroll(true);
            setPageNumber(result.length);
        }
        else {
            setDisableInfiniteScroll(false);
        }
    }

    async function searchNext($event:CustomEvent<void>){
        await fetchData();
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Beers</IonTitle>
                    <IonSearchbar value = {searchTerm} onIonChange = {e => setSearchTerm(e.detail.value!)} placeholder = "Filter items"/>
                    <IonLabel>Favorites ONLY</IonLabel>
                    <IonCheckbox checked = {filtering} color = "light" onIonChange ={e => setFiltering(e.detail.checked)}></IonCheckbox>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching items" />
                {searchItems && (
                    <IonList>
                        <IonListHeader lines="inset">
                            <IonLabel>Name</IonLabel>
                            <IonLabel class = "price-column">Price</IonLabel>
                            <IonLabel class = "creation-date-column">Creation date</IonLabel>
                            <IonLabel>Favorite?</IonLabel>
                        </IonListHeader>
                        {searchItems.map(({ _id, name, price, creationDate, favorite}) => {
                            //if ( _id ) {
                                return <BeerItem key={_id} _id={_id} name={name} price={price}
                                                 creationDate={creationDate} favorite={favorite}
                                                 onEdit={id => {
                                                     setDisableInfiniteScroll(true);
                                                     history.push(`/beer/${id}`);
                                                 }}/>
                            //}
                        })}
                    </IonList>
                )}
               { <IonInfiniteScroll threshold = "100px" disabled={disableInfiniteScroll}
                                   onIonInfinite = {(e:CustomEvent<void>)=>searchNext(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more products...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => {
                        setDisableInfiniteScroll(true);
                        history.push('/beer');
                    }}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
                <IonFab vertical="bottom" horizontal="start" slot="fixed">
                    <IonFabButton onClick={handleLogout}>
                        Logout
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );

    function handleLogout() {
        log("logout");
        logout?.();
    }
};

export default BeerItemList;
