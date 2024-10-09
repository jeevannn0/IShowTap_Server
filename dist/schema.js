"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_yoga_1 = require("graphql-yoga");
const dbConfig_1 = __importDefault(require("./dbConfig"));
exports.schema = (0, graphql_yoga_1.createSchema)({
    typeDefs: `
    type User {
      id: ID!
      name: String!
      coin_balance: Int!
      chat_id: Int!
    }
    type Query {
      getUser(chat_id: Int!): User
      checkUserExists(chat_id: Int!): Boolean
    }
    type Mutation {
      updateCoins(chat_id: Int!, coins: Int!): User
      syncCoins(chat_id: Int!, offlineCoins: Int!): User
    }
  `,
    resolvers: {
        Query: {
            getUser: async (_, args) => {
                console.log('Fetching user with chat_id:', args.chat_id);
                const { data, error } = await dbConfig_1.default
                    .from('users')
                    .select('*')
                    .eq('chat_id', args.chat_id);
                if (error) {
                    console.error('Error fetching user:', error);
                    throw new Error(`Error fetching user: ${error.message}`);
                }
                if (!data || data.length === 0) {
                    console.log('No user found with chat_id:', args.chat_id);
                    return null;
                }
                if (data.length > 1) {
                    console.warn('Multiple users found with chat_id:', args.chat_id);
                    return data[0]; // Return the first user found
                }
                return data[0];
            },
            checkUserExists: async (_, args) => {
                console.log('Checking if user exists with chat_id:', args.chat_id);
                const { data, error } = await dbConfig_1.default
                    .from('users')
                    .select('id')
                    .eq('chat_id', args.chat_id);
                if (error) {
                    console.error('Error checking user existence:', error);
                    return false;
                }
                return data && data.length > 0;
            },
        },
        Mutation: {
            updateCoins: async (_, args) => {
                // Update the user's coin balance
                const { data, error } = await dbConfig_1.default
                    .from('users')
                    .update({ coin_balance: args.coins })
                    .eq('chat_id', args.chat_id)
                    .select('*')
                    .single();
                if (error) {
                    console.error('Error updating coins:', error);
                    throw new Error(`Error updating coins: ${error.message}`);
                }
                return data;
            },
            // New mutation for syncing coins
            syncCoins: async (_, args) => {
                // Fetch the user's current coin balance
                const { data, error } = await dbConfig_1.default
                    .from('users')
                    .select('coin_balance')
                    .eq('chat_id', args.chat_id)
                    .single();
                if (error) {
                    console.error('Error fetching user coins:', error);
                    throw new Error(`Error fetching user coins: ${error.message}`);
                }
                // Calculate the new coin balance by adding the offline coins
                const newCoinBalance = data.coin_balance + args.offlineCoins;
                // Update the user's coin balance in the database
                const { data: updatedData, error: updateError } = await dbConfig_1.default
                    .from('users')
                    .update({ coin_balance: newCoinBalance })
                    .eq('chat_id', args.chat_id)
                    .select('*')
                    .single();
                if (updateError) {
                    console.error('Error updating user coins:', updateError);
                    throw new Error(`Error updating user coins: ${updateError.message}`);
                }
                return updatedData;
            },
        },
    },
});
