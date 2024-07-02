const { Awards } = require('../models/models');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const ApiError = require('../error/ApiError');

class AwardsController {
    async create(req, res, next) {
        try {
            const { title, description } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const award = await Awards.create({ title, description, img: fileName });
            return res.json(award);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async get(req, res) {
        const awards = await Awards.findAll();
        return res.json(awards);
    }

    async put(req, res, next) {
        try {
            const { id } = req.params;
            const { title, description } = req.body;
            const award = await Awards.findByPk(id);
            if (!award) {
                return next(ApiError.notFound('Награда не найдена'));
            }

            // Обновление свойств награды
            award.title = title || award.title;
            award.description = description || award.description;

            // Если есть новое изображение, обновить его
            if (req.files && req.files.img) {
                const { img } = req.files;
                let fileName = uuid.v4() + ".jpg";
                const filePath = path.resolve(__dirname, '..', 'static', fileName);
                img.mv(filePath);

                // Удалить старое изображение
                const oldImgPath = path.resolve(__dirname, '..', 'static', award.img);
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                }

                award.img = fileName;
            }

            // Сохранить обновленную награду в базе данных
            await award.save();
            return res.json(award);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const award = await Awards.findByPk(id);
            if (!award) {
                return next(ApiError.notFound('Награда не найдена'));
            }

            // Удалить изображение награды
            const imgPath = path.resolve(__dirname, '..', 'static', award.img);
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }

            // Удалить награду из базы данных
            await award.destroy();
            return res.json({ message: 'Награда успешно удалена' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new AwardsController();
