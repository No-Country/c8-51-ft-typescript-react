const passport = require("passport");
const { Transaction, PortfolioCoin, Portfolio } = require("../schemas/portfolio.schema")
const UserSchema = require("../schemas/user.schema")
const bcrypt = require("bcryptjs")
// crud for portfolio
class PortfolioController {
  async create(req, res) {
    const { name, symbol, date, type, amount, price, userID } = req.body
    const transaction = new Transaction({
      date,
      type,
      amount,
      price
    })
    const portfolioCoin = new PortfolioCoin({
      name: name,
      symbol: symbol,
      transactions: [transaction._id]
    })
    const portfolio = new Portfolio({
      coins: [portfolioCoin._id]
    })
    try {
      await transaction.save()
      await portfolioCoin.save()
      await portfolio.save()
    }
    catch (err) {
      console.log(err)
    }
    const user = await UserSchema.findById(userID)
    user.portfolio_id = portfolio._id
    user.save().then((user) => {
      res.status(200).json(user)
    }
    ).catch((err) => {
      res.status(500).json(err)
    }
    )
  }
  async read(req, res) {
    const user = await UserSchema.findById(req.body.userID).populate("portfolio")
    res.status(200).json(user)
  }
  async update(req, res) {
    const { date, type, amount, price, _id } = req.body
    Transaction.findByIdAndUpdate(_id, {
      date,
      type,
      amount,
      price
    }, {}, (err, transaction) => {
      if (err) {
        res.status(500).json(err)
      }
      res.status(200).json(transaction)
    })
  }

  async delete(req, res) {
    const { _id } = req.body
    Transaction.findByIdAndDelete(_id, (err, transaction) => {
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
            if (portfolioCoin && portfolioCoin.transactions.length === 0) {
              PortfolioCoin.findByIdAndDelete(portfolioCoin._id, (err, portfolioCoin) => {
                if (err) {
                  res.status(500).json(err)
                }
                res.status(200).json('item deleted')
              })
            }
          }
        )
      }
      res.status(200).json('item deleted')
    })
  }
}

module.exports = new PortfolioController()
