const Router = require('express');
const router = Router();

const employeeRouter = require('./employeeRouter');
const awardsRouter = require('./awardsRouter');
const jobTitleRouter = require('./jobTitleRouter');
const subdivisionRouter = require('./subdivisionRouter');
const notebookRouter = require('./notebookRouter');
const userRouter = require('./userRouter');

router.use('/user', userRouter);
router.use('/employee', employeeRouter);
router.use('/awards', awardsRouter);
router.use('/job-title', jobTitleRouter);
router.use('/subdivision', subdivisionRouter);
router.use('/notebook', notebookRouter);

module.exports = router;
