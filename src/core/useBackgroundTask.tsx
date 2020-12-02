import { Plugins } from '@capacitor/core';
import {useEffect} from "react";
import {createItem, removeItem, updateItem} from "../api/itemApi";
const { App, BackgroundTask } = Plugins;

export const useBackgroundTask = (asyncTask: () => Promise<void>) => {
    useEffect(() => {
      let taskId = BackgroundTask.beforeExit(async () => {
        console.log('useBackgroundTask - executeTask started');
        await asyncTask();
        console.log('useBackgroundTask - executeTask finished');
        BackgroundTask.finish({ taskId });
      });
    }, [])
    return {};
};
