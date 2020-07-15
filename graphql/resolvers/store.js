const Store = require('../../models/store')
const User = require('../../models/user')
const Employee = require('../../models/employee')

module.exports = {
    stores: async () => {
        try {
            const stores = await Store.find().populate('employeeList')
            return stores.map(store => {
                store.employeeList.map(employee => {
                    employee.password = null
                })
                return {...store._doc}
            })
        } catch (err) {
            throw err
        }
    },
    createStore: async (args, req) => {
        try {
            const existingStore = await Store.findOne({address: args.storeInput.address})
            if (existingStore) {
                throw new Error(`Store with address "${args.storeInput.address}" already exists!`)
            }
            const store = new Store({
                name: args.storeInput.name,
                capacity: +args.storeInput.capacity,
                employeeList: [],
                maskCount: 0,
                numCustomers: 0,
                address: args.storeInput.address,
                date: new Date().toISOString(),
            })
            const result = await store.save()
            return {...result._doc}
        } catch (err) {
            throw err
        }
    },
    updateStoreCount: async (args, req) => {
        try {
            if (!req.isAuth || req.type === "user") {
                throw new Error('Unauthorized!')
            }
            if (!req.isAuth || req.type !== 'employee') {
                throw new Error(`Unauthorized`)
            }
            const store = await Store.findByIdAndUpdate(
                {_id: args.updateCount.store},
                {capacity: args.updateCount.capacity,
                maskCount: args.updateCount.maskCount,
                numCustomers: args.updateCount.numCustomers})
            return {...store._doc}
        } catch (err) {
            throw err
        }
    },
    deleteStore: async (args) => {
        try {
            if (!req.isAuth || req.type !== "manager") {
                throw new Error('Unauthorized!')
            }
            const store = await Store.findByIdAndDelete(args.store).populate('employeeList')
            if (!store) {
                throw new Error(`Store ID "${args.store}" does not exist!`)
            }
            await Employee.deleteMany({store: args.store})
            const users = await User.find()
            await users.map(user => {
                const newFavoriteList = user.favorites
                newFavoriteList.splice(newFavoriteList.findIndex(fav => fav === args.store), 1)
                User.findByIdAndUpdate(
                    {_id: user},
                    {favorites: newFavoriteList})
            })
            return store
        } catch (err) {
            throw err
        }
    },
}