import { ApiResponse, IChatConversation, IChatMessage } from '../models';
import Api from './api';

export class ChatApi extends Api {
  constructor() {
    super('/chat');
  }

  getConversations(): Promise<ApiResponse<IChatConversation[]>> {
    return this.api
      .get('/conversations', { headers: this.headers })
      .then((res) => res.data);
  }

  startConversation(
    participantIds: string[]
  ): Promise<ApiResponse<IChatConversation>> {
    return this.api
      .post(
        '/conversations',
        {
          userIds: participantIds,
        },
        { headers: this.headers }
      )
      .then((res) => res.data);
  }

  getConversation(
    conversationId: string
  ): Promise<ApiResponse<IChatConversation>> {
    return this.api
      .get(`/conversations/${conversationId}`, { headers: this.headers })
      .then((res) => res.data);
  }

  sendChatMessage(
    conversationId: string,
    message: string
  ): Promise<ApiResponse<IChatMessage>> {
    return this.api
      .post(
        `/conversations/${conversationId}/message`,
        { message },
        { headers: this.headers }
      )
      .then((res) => res.data);
  }
}
