import { IChatConversation, IChatMessage } from '../models';
import { createApi } from './baseApi';

const api = createApi('/chat');

export function getConversations(userId: string) {
  return api
    .get('/conversations')
    .then((res) => res.data as IChatConversation[]);
}

export function startConversation(participantIds: string) {
  return api
    .post('/conversations')
    .then((res) => res.data as IChatConversation);
}

export function getConversation(conversationId: string) {
  return api
    .get(`/conversations/${conversationId}`)
    .then((res) => res.data as IChatConversation);
}

export function sendChatMessage(conversationId: string, message: string) {
  return api
    .post(`/conversations/${conversationId}/message`, { message })
    .then((res) => res.data as IChatMessage);
}
