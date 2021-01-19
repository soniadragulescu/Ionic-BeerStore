import React, { useState } from 'react';
import {  IonModal, IonButton, IonContent } from '@ionic/react';
import { createAnimation } from '@ionic/react';
interface ModalProps {
    showModal: boolean,
    onClose: ()=> void,
    onLogout: () => void
}

export const MyModal: React.FC<ModalProps> = ({showModal, onClose, onLogout}) => {
    const enterAnimation = (baseEl: any) => {
        const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '0.99', transform: 'scale(1)' }
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
    }

    return (
            <IonModal isOpen = {showModal} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                <p>Are you sure you want to logout?</p>
                <IonButton onClick={() => onClose()}>Cancel</IonButton>
                <IonButton onClick={() => onLogout()}>I'm sure!</IonButton>
            </IonModal>
    );
};