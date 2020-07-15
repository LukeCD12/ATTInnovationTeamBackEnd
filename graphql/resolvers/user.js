const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Store = require('../../models/store')
const User = require('../../models/user')

module.exports = {
    users: async () => {
        try {
            const users = await User.find().populate('favorites')
            return users.map(user => {
                return {...user._doc, password: null}
            })
        } catch (err) {
            throw err
        }
    },
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({username: args.userInput.username})
            if (existingUser) {
                throw new Error(`User with username "${args.userInput.username}" already exists!`)
            }
            const hashedPW = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                name: args.userInput.name,
                username: args.userInput.username,
                password: hashedPW,
                facorites: []
            })
            const result = await user.save()
            return {...result._doc, password: null}
        } catch (err) {
            throw err
        }
    },
    deleteUser: async (args) => {
        try {
            if (!req.isAuth || req.userID !== args.user) {
                throw new Error('Unauthorized!')
            }
            const user = await User.findByIdAndDelete(
                {_id: args.user})
            if (!user) {
                throw new Error(`User ID "${args.user}" does not exist`)
            }
            return {...user._doc}
        } catch (err) {
            throw err
        }
    },
    addFavorite: async (args, req) => {
        try {
            if (!req.isAuth || req.userID !== args.user) {
                throw new Error(`Unauthorized`)
            }
            const user = await User.findById(args.user).populate('favorites')
            if (!user) {
                throw new Error(`User ID ${args.user} does not exist!`)
            }
            const store = await Store.findById(args.store)
            if (!store) {
                throw new Error(`Store ID ${args.store} does not exist`)
            }
            user.favorites.map(fav => {
                if (fav === args.store) {
                    throw new Error(`Store ID ${args.store} already in favorties!`)
                }
            })
            user.favorites.push(store)
            const result = await user.save()
            return user.favorites
        } catch (err) {
            throw err
        }
    },
    removeFavorites: async (args) => {
        try {
            if (!req.isAuth || req.userID !== args.user) {
                throw new Error(`Unauthorized`)
            }
            const user = await User.findById(args.user).populate('favorites')
            if (!user) {
                throw new Error(`User ID ${args.user} does not exist!`)
            }
            const store = await Store.findById(args.store)
            if (!store) {
                throw new Error(`Store ID ${args.store} does not exist`)
            }
            const newFavoriteList = user.favorites
            newFavoriteList.splice(newFavoriteList.findIndex(fav => fav === args.store), 1)
            await User.findByIdAndUpdate(
                {_id: args.user},
                {favorites: newFavoriteList})
            return newFavoriteList
        } catch (err) {
            throw err
        }
    },
    userLogin: async (args) => {
        const user = await User.findOne({username: args.username})
        if (!user) {
            throw new Error(`Invalid Credentials`)
        }
        const isEqual = await bcrypt.compare(args.password, user.password)
        if (!isEqual) {
            throw new Error(`Invalid Credentials`)
        }
        const token = jwt.sign({userID: user.id, username: user.username, type: 'user'}, 'testprivatekey', {expiresIn: '2h'})
        return { userID: user.id, token: token, expiration: 2, type: 'user'}
    }
}