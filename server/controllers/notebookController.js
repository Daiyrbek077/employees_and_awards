const { Notebook } = require('../models/models')
const ApiError = require('../error/ApiError')


class NotebookController {
    async create(req, res) {
        const { title, text } = req.body
        const notebook = await Notebook.create({ title, text })
        return res.json(notebook)
    }
    async get(req, res) {
        const notebookes = await Notebook.findAll()
        return res.json(notebookes)

    }
    async put(req, res) {
        
    }

    async delete(req, res) {

    }
}

module.exports = new NotebookController()