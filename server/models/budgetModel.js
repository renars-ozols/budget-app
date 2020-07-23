const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose, 2);

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Budget must belong to user.']
    },
    date: {
      type: Date,
      required: [true, 'Budget must have a date.']
    },
    income: [
      {
        description: {
          type: String,
          required: [true, 'Income must have description.']
        },
        value: {
          type: Float,
          min: [0, 'Value must be greater or equal then 0.'],
          required: [true, 'Income must have a value.']
        },
        createdAt: {
          type: Date,
          default: Date.now()
        }
      }
    ],
    expenses: [
      {
        description: {
          type: String,
          required: [true, 'Expense must have description.']
        },
        value: {
          type: Float,
          min: [0, 'Value must be greater or equal then 0.'],
          required: [true, 'Expense must have a value.']
        },
        createdAt: {
          type: Date,
          default: Date.now()
        }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

budgetSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var retJson = {
      createdAt: ret.createdAt,
      _id: ret._id,
      date: ret.date,
      income: ret.income,
      expenses: ret.expenses,
      user: ret.user,
      totalIncome: doc.totalIncome,
      totalExpenses: doc.totalExpenses,
      budget: doc.budget
    };
    return retJson;
  }
});

const CalculateTotal = arr => {
  let sum = 0;

  arr.forEach(el => {
    sum += el.value;
  });

  return sum;
};

budgetSchema.virtual('totalIncome').get(function() {
  return parseFloat(CalculateTotal(this.income).toFixed(2));
});
budgetSchema.virtual('totalExpenses').get(function() {
  return parseFloat(CalculateTotal(this.expenses).toFixed(2));
});
budgetSchema.virtual('budget').get(function() {
  const total = CalculateTotal(this.income) - CalculateTotal(this.expenses);
  return parseFloat(total.toFixed(2));
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
