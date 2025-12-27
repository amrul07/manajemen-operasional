import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const enableNotification = async () => {
  if (!('Notification' in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  return await getToken(messaging, { vapidKey: VAPID_KEY });
};
