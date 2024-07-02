const { Router } = require('express'); // Destructuring for clarity
const router = Router();
const employeeController = require('../controllers/employeeController');
const checkRole = require('../middleware/checkRoleMiddleware');

// Define routes with middleware where needed
router.post('/', checkRole('ADMIN'), employeeController.create);
router.get('/', employeeController.getAll); // Adjusted route path
router.get('/:id', employeeController.getOne); // Adjusted route path
router.put('/:id', checkRole('ADMIN'), employeeController.put);
router.delete('/:id', checkRole('ADMIN'), employeeController.delete);

module.exports = router;

