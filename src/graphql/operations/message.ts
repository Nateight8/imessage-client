// we want to export an object that contains subscriptions, mutations and queries
import gql from "graphql-tag";

const messageOperations = {
  Mutations: {
    sendMessage: gql`
      mutation SendMessage(
        $sendMessageId: String
        $conversationId: String
        $senderId: String
        $body: String
      ) {
        sendMessage(
          id: $sendMessageId
          conversationId: $conversationId
          senderId: $senderId
          body: $body
        )
      }
    `,
  },
  Queries: {
    messages: gql`
      query Messages($conversationId: String) {
        messages(conversationId: $conversationId) {
          id
          sender {
            id
            username
          }
          body
          createdAt
        }
      }
    `,
  },

  Subscriptions: {
    messageSent: gql`
      subscription MessageSent($conversationId: String) {
        messageSent(conversationId: $conversationId) {
          id
          sender {
            id
            username
          }
          body
          createdAt
        }
      }
    `,
  },
};

export default messageOperations;
