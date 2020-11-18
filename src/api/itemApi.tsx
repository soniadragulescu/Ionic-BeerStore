import axios from 'axios';
import { authConfig, baseUrl, getLogger, withLogs } from '../core';
import { BeerItemProps } from '../components/BeerItemProps';

const log = getLogger('itemApi');

const itemUrl = `http://${baseUrl}/api/beer`;

export const getItems: (token:string) => Promise<BeerItemProps[]> = token=> {
  return withLogs(axios.get(itemUrl, authConfig(token)), 'getItems');
}

export const getPageItems: (token:string, pageNumber : number) => Promise<BeerItemProps[]>=(token, pageNumber)=>{
  return withLogs(axios.get(itemUrl+"/page/"+pageNumber.toString(), authConfig(token)), 'getItems');
}

export const createItem: (token: string, item: BeerItemProps) => Promise<BeerItemProps[]> = (token, item) => {
  return withLogs(axios.post(itemUrl, item, authConfig(token)), 'createItem');
}

export const removeItem: (token: string, item: BeerItemProps) => Promise<BeerItemProps[]> = (token, item) => {
  return withLogs(axios.delete(`${itemUrl}/${item._id}`, authConfig(token)), 'deleteItem');
}

export const updateItem: (token: string, item: BeerItemProps) => Promise<BeerItemProps[]> = (token, item) => {
  return withLogs(axios.put(`${itemUrl}/${item._id}`, item, authConfig(token)), 'updateItem');
}

interface MessageData {
  type: string;
  payload: BeerItemProps;
}

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${baseUrl}`)
  ws.onopen = () => {
    log('web socket onopen');
    ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
  };
  ws.onclose = () => {
    log('web socket onclose');
  };
  ws.onerror = error => {
    log('web socket onerror', error);
  };
  ws.onmessage = messageEvent => {
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}
