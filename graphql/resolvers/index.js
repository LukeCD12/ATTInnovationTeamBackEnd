const userResolver = require('./user')
const storeResolver = require('./store')
const employeeResolver = require('./employee')

const rootResolver = {
    ...userResolver,
    ...storeResolver,
    ...employeeResolver
}
module.exports = rootResolver