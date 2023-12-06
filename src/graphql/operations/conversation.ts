import gql from "graphql-tag";

const ConversationFields = `
  id
  updatedAt
  participants {
    user {
      id
      username
    }
    hasSeenLatestMessage
  }
 
    latestMessage {
      id
      sender {
        id
        name
        username
        email
        emailVerify
        image
      }
      body
      createdAt
    }
  
`;

const conversationOperations = {
  Queries: {
    conversations: gql`
      query Conversations {
        conversations {
          ${ConversationFields}
        }
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,

    markAsRead: gql`
      mutation MarkAsRead($userId: String!, $conversationId: String!) {
        markAsRead(userId: $userId, conversationId: $conversationId)
      }
    `,

    deleteConversation: gql`
      mutation deleteConversation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId)
      }
    `,

    updateParticipants: gql`
      mutation UpdateParticipants(
        $conversationId: String!
        $participantIds: [String]!
      ) {
        updateParticipants(
          conversationId: $conversationId
          participantIds: $participantIds
        )
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          ${ConversationFields}
        }
      }
    `,
    conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
          conversation {
            ${ConversationFields}
          }
          addedUserIds
          removedUserIds
        }
      }
    `,
    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          id
        }
      }
    `,
  },
};

export default conversationOperations;
