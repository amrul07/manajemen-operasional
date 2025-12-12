import { get, set, del } from "idb-keyval";

export const OFFLINE_USERS = "offline-users";
export const OFFLINE_QUEUE = "offline-queue"; // untuk data yg menunggu sync

export async function getOfflineUsers() {
  return (await get(OFFLINE_USERS)) || [];
}

export async function saveOfflineUsers(users) {
  return await set(OFFLINE_USERS, users);
}

export async function getQueue() {
  return (await get(OFFLINE_QUEUE)) || [];
}

export async function saveQueue(queue) {
  return await set(OFFLINE_QUEUE, queue);
}

export async function removeQueueItem(id) {
  const queue = await getQueue();
  const newQueue = queue.filter((q) => q.localId !== id);
  await saveQueue(newQueue);
}
