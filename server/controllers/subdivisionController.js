const { Subdivision } = require('../models/models');
const ApiError = require('../error/ApiError');

class SubdivisionController {
    async create(req, res) {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        try {
            const subdivision = await Subdivision.create({ title });
            return res.json(subdivision);
        } catch (error) {
            return res.status(500).json({ message: "Error creating subdivision", error: error.message });
        }
    }

    async get(req, res) {
        try {
            const subdivisions = await Subdivision.findAll();
            return res.json(subdivisions);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching subdivisions", error: error.message });
        }
    }

    async put(req, res) {
        const { id } = req.params;
        const { title } = req.body;
        if (!id || !title) {
            return res.status(400).json({ message: "ID and Title are required" });
        }
        try {
            const subdivision = await Subdivision.findByPk(id);
            if (!subdivision) {
                return res.status(404).json({ message: "Subdivision not found" });
            }
            subdivision.title = title;
            await subdivision.save();
            return res.json(subdivision);
        } catch (error) {
            return res.status(500).json({ message: "Error updating subdivision", error: error.message });
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }
        try {
            const subdivision = await Subdivision.findByPk(id);
            if (!subdivision) {
                return res.status(404).json({ message: "Subdivision not found" });
            }
            await subdivision.destroy();
            return res.json({ message: "Subdivision deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting subdivision", error: error.message });
        }
    }
}

module.exports = new SubdivisionController();
