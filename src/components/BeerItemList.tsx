import React, {useCallback, useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
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
import {add} from 'ionicons/icons';
import {getLogger} from '../core';
import {BeerItemContext} from './BeerItemProvider';
import BeerItem from "./BeerItem";
import {AuthContext} from "../auth";
import {useAppState} from "../core/useAppState";
import {useNetwork} from "../core/useNetwork";
import {createAnimation} from '@ionic/react';
import {createItem, removeItem, updateItem} from "../api/itemApi";
import {MyModal} from "./MyModal";

const log = getLogger('ItemList');
const itemsAtOnce = 20;
const BeerItemList: React.FC<RouteComponentProps> = ({history}) => {
    const {items, fetching, fetchingError, getItemsOnPage} = useContext(BeerItemContext);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const {token, logout} = useContext(AuthContext);
    const [searchItems, setSearchItems] = useState(items);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtering, setFiltering] = useState(false);
    const [pageNumber, setPageNumber] = useState(itemsAtOnce);
    const {appState} = useAppState();
    const {networkStatus} = useNetwork();
    const [showModal, setShowModal] = useState(false);

    function basicAnimation() {
        const el = document.querySelector('.appTitle');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(1000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    {offset: 0, transform: 'scale(2)', opacity: '1'},
                    {
                        offset: 1, transform: 'scale(1)', opacity: '0.5'
                    }
                ]);
            animation.play();
        }
    }

    function groupAnimations() {
        const elB = document.querySelector('.app-status');
        const elC = document.querySelector('.net-status');
        if (elB && elC) {
            const animationA = createAnimation()
                .addElement(elB)
                .fromTo('transform', 'scale(1)', 'scale(1.5)');
            const animationB = createAnimation()
                .addElement(elC)
                .fromTo('transform', 'scale(1)', 'scale(0.5)');
            const parentAnimation = createAnimation()
                .duration(10000)
                .iterations(Infinity)
                .keyframes([
                    {offset: 0, transform: 'scale(2)', opacity: '1'},
                    {
                        offset: 1, transform: 'scale(1)', opacity: '0.5'
                    }])
                .addAnimation([animationA, animationB]);
            parentAnimation.play();
        }
    }

    useEffect(basicAnimation, []);
    useEffect(groupAnimations, [])

    useEffect(() => {
        console.log(items)
        //const results = items?.filter(item => item.name.toLowerCase().includes(searchTerm));
        //setSearchItems(results);
        setPageNumber(itemsAtOnce);
        fetchData()
    }, [searchTerm, items, filtering])
    log('render');

    async function fetchData() {
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
        } else {
            setDisableInfiniteScroll(false);
        }
    }

    async function searchNext($event: CustomEvent<void>) {
        await fetchData();
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <div className="headerContainer">
                <IonHeader>
                    <div className="app-status">
                        <IonLabel>
                            <div>App state is {appState.isActive ? 'active' : 'inactive'}</div>
                        </IonLabel>
                    </div>
                    <div className="net-status">
                        <IonLabel>Network status is {networkStatus.connected ? 'online' : 'offline'}</IonLabel>
                    </div>
                    <IonToolbar>
                        <div className="appTitle">
                            <IonTitle>Beers</IonTitle>
                        </div>
                        <IonSearchbar value={searchTerm} onIonChange={e => setSearchTerm(e.detail.value!)}
                                      placeholder="Filter items"/>
                        <IonLabel>Favorites ONLY</IonLabel>
                        <IonCheckbox checked={filtering} color="light"
    onIonChange={e => setFiltering(e.detail.checked)}/>
                    </IonToolbar>
                </IonHeader>
            </div>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching items"/>
                {searchItems && (
                    <IonList>
                        {/* <IonListHeader lines="inset">
                            <IonLabel>Name</IonLabel>
                            <IonLabel class = "price-column">Price</IonLabel>
                            <IonLabel class = "creation-date-column">Creation date</IonLabel>
                            <IonLabel>Favorite?</IonLabel>
                        </IonListHeader>*/}
                        {searchItems.map(({_id, name, price, creationDate, favorite, photo}) => {
                            return <BeerItem key={_id} _id={_id} name={name} price={price}
                                             creationDate={creationDate} favorite={favorite}
                                             photo={photo}
                                             onEdit={id => {
                                                 setDisableInfiniteScroll(true);
                                                 history.push(`/beer/${id}`);
                                             }}/>
                            //}
                        })}
                    </IonList>
                )}
                {<IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                                    onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
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
                        <IonIcon icon={add}/>
                    </IonFabButton>
                </IonFab>
                <IonFab vertical="bottom" horizontal="start" slot="fixed">
                    <IonFabButton onClick={() => setShowModal(true)}>
                        Logout
                    </IonFabButton>
                </IonFab>
                <MyModal onClose={() => setShowModal(false)}
                         showModal={showModal}
                         onLogout={() => {
                             setShowModal(false)
                             handleLogout()
                         }}/>
            </IonContent>
        </IonPage>
    );

    function handleLogout() {
        log("logout");
        logout?.();
    }
};

export default BeerItemList;
