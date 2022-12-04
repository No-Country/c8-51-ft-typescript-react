const { Schema, model } = require('mongoose')


const TransactionSchema = new Schema({
  date: { type: Date, require: true },
  type: { type: String, require: true },
  amount: { type: Number, require: true },
  price: { type: Number, require: true }
})
const PortfolioCoinSchema = new Schema({
  name: { type: String, require: true },
  symbol: { type: String, require: true },
  transactions: { type: [Schema.Types.ObjectId], require: true, ref: "Transaction" },
})
const PortfolioSchema = new Schema({
  coins: { type: [Schema.Types.ObjectId], require: true, ref: "PortfolioCoin" },
})

const Transaction = model('Transaction', TransactionSchema)
const PortfolioCoin = model('PortfolioCoin', PortfolioCoinSchema)
const Portfolio = model('Portfolio', PortfolioSchema)

module.exports = {
  Transaction,
  PortfolioCoin,
  Portfolio
}

