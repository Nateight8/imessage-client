// import {
//   conversationPopulated,
//   participantPopulated,
// } from "@/server/graphql/resolvers/conversations";
import { Prisma, PrismaClient } from "@prisma/client";
import { Context } from "graphql-ws";
import { Session } from "next-auth";
import { PubSub } from "graphql-subscriptions";
import { ConversationPopulated } from "../../../apollo-server/src/schema/types.utils";
import { MessagePopulated } from "../../../imessage/apollo-server/src/schema/types.utils";

export interface UsernameData {
  createUsername: {
    succeess: boolean;
    error: string;
  };
}

export interface UsernameVariables {
  username: string;
}

export interface GraphqlContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

export interface CreateUsernameResponse {
  success?: Boolean;
  error?: String;
}

export interface SearchUserInput {
  username: string;
}

export interface SearchsUsersData {
  searchUsers: SearchedUser[];
}

export interface SearchedUser {
  id: string;
  username: string;
}

// conversations

export interface createConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface createConversationInput {
  participantIds: Array<string>;
}

// conversations

// export type ConversationPopulated = Prisma.ConversationGetPayload<{
//   include: typeof conversationPopulated;
// }>;

export interface ConversationsData {
  conversations: ConversationPopulated[];
}

export interface SubscriptionCtx extends Context {
  connectionParams: {
    session?: Session;
  };
}

export interface MessageData {
  messages: MessagePopulated[];
}

export interface MessageVariables {
  conversationId: string;
}

export interface MessageInput {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}
