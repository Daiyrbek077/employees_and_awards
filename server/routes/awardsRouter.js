const Router = require('express')
const router = Router()
const awardsController = require('../controllers/awardsController')
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/', checkRole('ADMIN'), awardsController.create)
router.get('/', awardsController.get)
router.put('/:id', checkRole('ADMIN'), awardsController.put)
router.delete('/:id', checkRole('ADMIN'), awardsController.delete)


module.exports = router