const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Employee {
        _id: ID!
        name: String!
        username: String!
        password: String
        store: Store!
        manager: Boolean!
    }

    type Store {
        _id: ID!
        capacity: Int!
        name: String!
        address: String!
        date: String!
        maskCount: Int!
        numCustomers: Int!
        employeeList: [Employee!]
    }

    type User {
        _id: ID!
        name: String!
        username: String!
        password: String
        favorties: [Store!]
    }

    type Auth {
        userID: ID!
        token: String!
        expiration: Int!
        type: String!
    }

    input EmployeeInput {
        name: String!
        username: String!
        password: String!
        store: ID!
        manager: Boolean!
    }

    input StoreInput {
        name: String!
        address: String!
        capacity: Int!
    }

    input UpdateCount {
        storeID: ID!
        maskCount: Int!
        numCustomers: Int!
        capacity: Int!
    }

    input UserInput {
        name: String!
        username: String!
        password: String!
    }

    type RootQuery {
        stores: [Store!]!
        users: [User!]!
        findUser(user: ID!): User!
        employees(store: ID!): [Employee!]
        findEmployee(employee: ID!): Employee!
        userLogin(username: String!, password: String!): Auth!
        employeeLogin(username: String!, password: String!): Auth!
        creatorToken: Auth!
    }

    type RootMutation {
        deleteStore(store: ID!): Store
        deleteEmployee(employee: ID!): Employee
        deleteUser(user: ID!): Employee
        createStore(storeInput: StoreInput): Store
        createEmployee(employeeInput: EmployeeInput): Employee
        createUser(userInput: UserInput): User
        updateStoreCount(updateCount: UpdateCount): Store
        addFavorite(user: ID!, store: ID!): [Store!]
        removeFavorite(user: ID!, store: ID!): [Store!]
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)