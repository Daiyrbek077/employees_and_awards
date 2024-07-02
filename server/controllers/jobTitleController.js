const { JobTitle } = require('../models/models');
const ApiError = require('../error/ApiError');

class JobTitleController {
    async create(req, res) {
        try {
            const { title, description } = req.body;
            const jobTitle = await JobTitle.create({ title, description });
            return res.json(jobTitle);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async get(req, res) {
        try {
            const jobTitles = await JobTitle.findAll();
            return res.json(jobTitles);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async put(req, res) {
        try {
            const { id } = req.params;
            const { title, description } = req.body;
            const jobTitle = await JobTitle.findByPk(id);

            if (!jobTitle) {
                return res.status(404).json({ message: "Должность не найдена" });
            }

            jobTitle.title = title;
            jobTitle.description = description;
            await jobTitle.save();

            return res.json(jobTitle);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const jobTitle = await JobTitle.findByPk(id);

            if (!jobTitle) {
                return res.status(404).json({ message: "Должность не найдена" });
            }

            await jobTitle.destroy();
            return res.json({ message: "Должность успешно удалена" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new JobTitleController();
