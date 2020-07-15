const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Store = require('../../models/store')
const Employee = require('../../models/employee')

module.exports = {
    employees: async (args) => {
        try {
            const store = await Store.findById(args.store).populate('employeeList')
            return store._doc.employeeList.map(employee => {
                console.log(employee)
                employee.password = null
                employee.store = store
                return employee
            })
        } catch (err) {
            throw err
        }
    },
    findEmployee: async (args, req) => {
        try {
            if (!req.isAuth || req.type === 'user') {
                throw new Error('Unauthorized')
            }
            const employee = await Employee.findOne({_id: args.employee})
            if (!employee) {
                throw new Error(`Employee ${args.employee} not found!`)
            }
            return {...employee._doc, password: null}
        } catch(err) {
            throw err
        }
    },
    createEmployee: async (args, req) => {
        try {
            if (!req.isAuth || req.type !== "manager") {
                throw new Error('Unauthorized!')
            }
            const existingEmployee = await Employee.findOne({username: args.employeeInput.username})
            if (existingEmployee) {
                throw new Error(`Employee username "${args.employeeInput.username}" already exists!`)
            }
            const store = await Store.findById(args.employeeInput.store).populate('employeeList')
            console.log(store)
            if (!store) {
                throw new Error(`Store ID "${args.employeeInput.store}" does not match any store in our records!`)
            }
            const hashedPW = await bcrypt.hash(args.employeeInput.password, 12)
            const employee = new Employee({
                name: args.employeeInput.name,
                username: args.employeeInput.username,
                password: hashedPW,
                boolean: args.employeeInput.manager,
                store: store
            })
            store.employeeList.push(employee)
            await store.save()
            const result = await employee.save()
            result.store.employeeList.map(employee => {
                employee.password = null
            })
            return {...result._doc, password: null}
        } catch (err) {
            throw err
        }
    },
    deleteEmployee: async (args) => {
        try {
            if (!req.isAuth || req.type !== "manager") {
                throw new Error('Unauthorized!')
            }
            const employee = await Employee.findByIdAndDelete(args.employee).populate('store')
            if (!employee) {
                throw new Error(`Employee ID "${args.employee}" does not exist`)
            }
            const newEmployeeList = employee.store.employeeList
            newEmployeeList.splice(newEmployeeList.findIndex(deleted => deleted === args.employee), 1)
            await Store.findByIdAndUpdate(
                {_id: employee.store._id},
                {employeeList: newEmployeeList})
            return employee
            } catch (err) {
            throw err
        }
    },
    employeeLogin: async (args) => {
        const employee = await Employee.findOne({username: args.username})
        if (!employee) {
            throw new Error(`Invalid Credentials`)
        }
        const before = employee.password
        const type = employee.manager ? "manager" : "employee"
        const isEqual = await bcrypt.compare(args.password, employee.password)
        if (!isEqual) {
            throw new Error(`Invalid Credentials ${before} : ${employee.password} : ${args.password} : ${isEqual}`)
        }
        const token = jwt.sign({userID: employee.id, username: employee.username, type: type}, 'testprivatekey', {expiresIn: '8h'})
        return { userID: employee.id, token: token, expiration: 8, type: type}
    }
}