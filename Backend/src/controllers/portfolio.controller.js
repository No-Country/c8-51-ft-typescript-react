const passport = require("passport");
const { Transaction, PortfolioCoin, Portfolio } = require("../schemas/portfolio.schema")
const UserSchema = require("../schemas/user.schema")
const bcrypt = require("bcryptjs")
// crud for portfolio
class PortfolioController {
  async create(req, res) {
    const { name, symbol, transactions } = req.body
    const transaction = new Transaction({
      date: transactions.date,
      type: transactions.type,
      amount: transactions.amount,
      price: transactions.price
    })
    const portfolioCoin = new PortfolioCoin({
      name: name,
      symbol: symbol,
      transactions: [transaction._id]
    })
    const portfolio = new Portfolio({
      coins: [portfolioCoin._id]
    })
    const user = await UserSchema.findById(req.user._id)
    user.portfolio = portfolio
    user.save().then((user) => {
      res.status(200).json(user)
    }
    ).catch((err) => {
      res.status(500).json(err)
    }
    )
  }
  async read(req, res) {
    const user = await UserSchema.findById(req.user._id).populate("portfolio")
    res.status(200).json(user)
  }
  async update(req, res) {
    const { transactions } = req.body
    Transaction.findByIdAndUpdate(transactions._id, {
      date: transactions.date,
      type: transactions.type,
      amount: transactions.amount,
      price: transactions.price
    }, {}, (err, transaction) => {
      if (err) {
        res.status(500).json(err)
      }
      res.status(200).json(transaction)
    })
  }

  async delete(req, res) {
    const { transactions } = req.body
    Transaction.findByIdAndDelete(transactions._id, (err, transaction) => {
      if (err) {
        res.status(500).json(err)
      }
      // if portfolio coin has no transactions, delete it
      if (transaction) {
        PortfolioCoin.findById(transaction
          .portfolioCoin, (err, portfolioCoin) => {
            if (err) {
              res.status(500).json(err)
            }
            if (portfolioCoin.transactions.length === 0) {
              PortfolioCoin.findByIdAndDelete(portfolioCoin._id, (err, portfolioCoin) => {
                if (err) {
                  res.status(500).json(err)
                }
                res.status(200).json(portfolioCoin)
              })
            }
          }
        )
      }
    })
  }
}

module.exports = new PortfolioController()
