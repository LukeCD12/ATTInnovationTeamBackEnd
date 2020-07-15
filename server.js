const express = require('express')
const graphQLMiddle = require('express-graphql')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const graphQLSchema = require('./graphql/schema/index')
const graphQLResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

const app = express()

app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})
app.use(isAuth)
app.use('/graphql', graphQLMiddle({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@quaranteam-usmv9.azure.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() => {
    app.listen(process.env.PORT)
}).catch(err => {
    console.error(err)
})