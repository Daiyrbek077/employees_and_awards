const { Employee, EmployeeAward } = require('../models/models');
const ApiError = require('../error/ApiError');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

class EmployeeController {
    async create(req, res, next) {
        try {
            let { name, lastname, surname, birthdate, jobTitleId, subdivisionId, info } = req.body;
            const { img } = req.files;
            let fileName = null;

            if (img) {
                fileName = uuidv4() + ".jpg";
                img.mv(path.resolve(__dirname, '..', 'static', fileName));
            }

            const employee = await Employee.create({ 
                name, 
                lastname, 
                surname, 
                birthdate, 
                jobTitleId, 
                subdivisionId, 
                img: fileName 
            });

            if (info) {
                info = JSON.parse(info);
                info.forEach(i => {
                    EmployeeAward.create({
                        awardId: i.awardId,
                        description: i.description,
                        date: i.date,
                        employeeId: employee.id
                    });
                });
            }

            return res.json(employee);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const { jobTitleId, awardId, subdivisionId } = req.query;
            let whereClause = {};

            if (jobTitleId) {
                whereClause.jobTitleId = jobTitleId;
            }

            if (subdivisionId) {
                whereClause.subdivisionId = subdivisionId;
            }

            let includeClause = [];

            if (awardId) {
                includeClause.push({
                    model: EmployeeAward,
                    where: { awardId },
                    as: 'info'
                });
            } else {
                includeClause.push({
                    model: EmployeeAward,
                    as: 'info'
                });
            }

            const employees = await Employee.findAll({
                where: whereClause,
                include: includeClause
            });

            return res.json(employees);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const employee = await Employee.findOne({
                where: { id },
                include: [{ model: EmployeeAward, as: 'info' }]
            });

            if (!employee) {
                return next(ApiError.notFound('Сотрудник не найден'));
            }

            return res.json(employee);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async put(req, res, next) {
        try {
            const { id } = req.params;
            let { name, lastname, surname, birthdate, jobTitleId, subdivisionId, info } = req.body;
            let fileName = null;

            // Проверяем наличие req.files и req.files.img
            if (req.files && req.files.img) {
                const { img } = req.files;
                fileName = uuidv4() + ".jpg";
                img.mv(path.resolve(__dirname, '..', 'static', fileName));

                // Удаляем старое изображение, если оно есть
                const employee = await Employee.findByPk(id);
                if (employee.img) {
                    fs.unlinkSync(path.resolve(__dirname, '..', 'static', employee.img));
                }
            } else {
                // Если изображение не выбрано, сохраняем старое изображение
                const employee = await Employee.findByPk(id);
                fileName = employee.img;
            }

            // Обновляем данные сотрудника
            const updatedEmployee = await Employee.update({ 
                name, 
                lastname, 
                surname, 
                birthdate, 
                jobTitleId, 
                subdivisionId, 
                img: fileName 
            }, { 
                where: { id } 
            });

            // Обновляем награды, если они есть
            if (info) {
                info = JSON.parse(info);
                await EmployeeAward.destroy({
                    where: { employeeId: id }
                });
                info.forEach(i => {
                    EmployeeAward.create({
                        awardId: i.awardId,
                        description: i.description,
                        date: i.date,
                        employeeId: id
                    });
                });
            }

            return res.json(updatedEmployee);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const employee = await Employee.findByPk(id);

            if (!employee) {
                return next(ApiError.notFound('Сотрудник не найден'));
            }

            if (employee.img) {
                fs.unlinkSync(path.resolve(__dirname, '..', 'static', employee.img));
            }

            await employee.destroy();
            return res.json({ message: 'Сотрудник успешно удален' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new EmployeeController();
