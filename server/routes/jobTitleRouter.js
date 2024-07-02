const Router = require('express');
const router = Router();
const jobTitleController = require('../controllers/jobTitleController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), jobTitleController.create);
router.get('/', jobTitleController.get);
router.delete('/:id', checkRole('ADMIN'), jobTitleController.delete); // Использование параметра id
router.put('/:id', checkRole('ADMIN'), jobTitleController.put); // Использование параметра id

module.exports = router;
