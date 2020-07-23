const express = require('express');

const authController = require('../controllers/authController');
const budgetController = require('../controllers/budgetController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.put('/', budgetController.createOrUpdateBudget);
router.get('/get-years', budgetController.getYears);
router.get('/get-yearly-data/:year', budgetController.getYearlyData);
router.get('/:date', budgetController.getBudget);
router.patch('/:id', budgetController.removeBudgetItem);

module.exports = router;
