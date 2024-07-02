const Router = require('express');
const router = Router();
const subdivisionController = require('../controllers/subdivisionController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), subdivisionController.create);
router.get('/', subdivisionController.get);
router.delete('/:id', checkRole('ADMIN'), subdivisionController.delete);
router.put('/:id', checkRole('ADMIN'), subdivisionController.put);

module.exports = router;
