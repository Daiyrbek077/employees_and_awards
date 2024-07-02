const Router = require('express')
const router = Router()
const notebookController = require('../controllers/notebookController')

router.post('/', notebookController.create)
router.get('/', notebookController.get)
router.delete('/', notebookController.delete)
router.put('/', notebookController.put)


module.exports = router