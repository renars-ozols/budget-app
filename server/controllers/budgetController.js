const Budget = require('../models/budgetModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOrUpdateBudget = catchAsync(async (req, res) => {
  const budget = await Budget.findOneAndUpdate(
    {
      user: req.user._id,
      date: req.body.date
    },
    {
      // $push operator must be first here for validation to work
      $push: {
        [req.body.type]: { $each: [req.body], $position: 0 }
      },
      $set: {
        date: req.body.date,
        user: req.user._id
      }
    },
    {
      runValidators: true,
      upsert: true,
      new: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: budget
  });
});

exports.getBudget = catchAsync(async (req, res) => {
  const budget = await Budget.findOne({
    user: req.user._id,
    date: new Date(req.params.date)
  });

  res.status(200).json({
    status: 'success',
    data: budget
  });
});

exports.removeBudgetItem = catchAsync(async (req, res, next) => {
  const budget = await Budget.findOne({
    _id: req.params.id,
    user: req.user._id
  });
  // (1) check if budget exists with provided parameters
  if (!budget) {
    return next(new AppError('No budget found with provided parameters', 404));
  }
  // (2) check if item exists in array
  if (budget[req.body.type]) {
    const itemToRemove = budget[req.body.type].find(
      el => el._id.toHexString() === req.body.id
    );
    if (!itemToRemove) {
      return next(new AppError("Element doesn't exist with provided ID", 400));
    }
    // (3) remove item from array
    // NOTE ---- mongodb $pull didnt give expected results
    budget[req.body.type] = budget[req.body.type].filter(
      item => item !== itemToRemove
    );
    await budget.save();
  }
  // (4) if both arrays are empty then delete budget
  if (!budget.income.length && !budget.expenses.length) {
    await Budget.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      status: 'success',
      data: null
    });
  }

  res.status(200).json({
    status: 'success',
    data: budget
  });
});

exports.getYears = catchAsync(async (req, res) => {
  const data = await Budget.aggregate([
    {
      $match: { user: req.user._id }
    },
    {
      $group: {
        _id: { $year: '$date' }
      }
    },
    {
      $addFields: { year: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    { $sort: { year: -1 } }
  ]);
  res.status(200).json({
    status: 'success',
    data
  });
});

exports.getYearlyData = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const data = await Budget.aggregate([
    {
      $match: {
        user: req.user._id,
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $project: {
        _id: 0,
        date: { $month: '$date' },
        income: {
          $reduce: {
            input: '$income',
            initialValue: 0,
            in: { $add: ['$$value', '$$this.value'] }
          }
        },
        expenses: {
          $reduce: {
            input: '$expenses',
            initialValue: 0,
            in: { $add: ['$$value', '$$this.value'] }
          }
        }
      }
    },
    {
      $group: {
        _id: '$date',
        income: { $sum: '$income' },
        expenses: { $sum: '$expenses' }
      }
    },
    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: [
                ,
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
              ]
            },
            in: {
              $arrayElemAt: ['$$monthsInString', '$_id']
            }
          }
        }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $group: {
        _id: null,
        budgets: {
          $push: { month: '$month', income: '$income', expenses: '$expenses' }
        }
      }
    },
    {
      $addFields: {
        totalIncome: { $sum: '$budgets.income' },
        totalExpenses: { $sum: '$budgets.expenses' },
        yearlyBudget: {
          $subtract: [
            { $sum: '$budgets.income' },
            { $sum: '$budgets.expenses' }
          ]
        }
      }
    },
    {
      $project: {
        _id: 0
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data
  });
});
