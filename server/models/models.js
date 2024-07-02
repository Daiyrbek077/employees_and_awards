const sequelize = require('../db')
const { DataTypes } = require('sequelize')



const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: "USER"}
})

const Employee = sequelize.define('employee', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    lastname: {type: DataTypes.STRING, allowNull: false},
    surname: {type: DataTypes.STRING, allowNull: false},
    birthdate: {type: DataTypes.STRING, allowNull: false},
    img: {type: DataTypes.STRING},
})


const Awards = sequelize.define('awards', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING(10000)},
    img: {type: DataTypes.STRING},
    
})

const EmployeeAward = sequelize.define('employee_award', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    awardId: {type: DataTypes.INTEGER},
    description: {type: DataTypes.STRING(10000)},
    date: {type: DataTypes.STRING, allowNull: false},
})


const JobTitle = sequelize.define('job_title', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true}
})


const Subdivision = sequelize.define('subdivision', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING}
})


// const Notebook = sequelize.define('notebook', {
//     id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//     title: {type: DataTypes.STRING},
//     text: {type: DataTypes.STRING(1000)}
// })
 


// User.hasOne(Notebook)
// Notebook.belongsTo(User)

JobTitle.hasMany(Employee)
Employee.belongsTo(JobTitle)

Subdivision.hasMany(Employee)
Employee.belongsTo(Subdivision)

Employee.hasMany(EmployeeAward, {as: 'info'})
EmployeeAward.belongsTo(Employee)



module.exports = {
    Employee,
    Awards,
    EmployeeAward,
    JobTitle,
    Subdivision,
    // Notebook,
    User,
}