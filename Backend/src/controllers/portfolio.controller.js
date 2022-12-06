const passport = require("passport");
const {
  Transaction,
  PortfolioCoin,
  Portfolio,
} = require("../schemas/portfolio.schema");
const UserSchema = require("../schemas/user.schema");
const bcrypt = require("bcryptjs");

class PortfolioController {
  async create(req, res) {
    const { name, symbol, date, type, amount, price, userID } = req.body;
    const transaction = new Transaction({
      date,
      type,
      amount,
      price,
    });
    // create portfolio coin or find it

    const user = await UserSchema.findById(userID);
    // if user have a portfolio
    if (user.portfolio_id) {
      const userPortfolio = await Portfolio.findById(user.portfolio_id).populate('coins');
      // if user have a portfolio coin
      // console.log(userPortfolio)
      // console.log(userPortfolioCoin.length > 0)
      await transaction.save();
      if (userPortfolio?.coins !== undefined && userPortfolio.coins.length > 0) {
        const userPortfolioCoin = userPortfolio.coins.filter(coin => coin.name === name && coin.symbol === symbol)
        console.log(userPortfolioCoin)
        if (userPortfolioCoin.length > 0) {
          userPortfolioCoin[0].transactions.push(transaction._id);
          console.log(userPortfolioCoin)
          await userPortfolioCoin[0].save();
        }
        else {
          const portfolioCoin = new PortfolioCoin({
            name,
            symbol,
            transactions: [transaction._id],
          });
          await portfolioCoin.save();
          userPortfolio.coins.push(portfolioCoin._id);
          userPortfolio.save();
        }
      } else {
        const portfolioCoin = new PortfolioCoin({
          name,
          symbol,
          transactions: [transaction._id],
        });
        await portfolioCoin.save();
        userPortfolio.coins.push(portfolioCoin._id);
        userPortfolio.save();
      }
    }
    else {
      const portfolioCoin = new PortfolioCoin({
        name,
        symbol,
        transactions: [transaction._id],
      });
      const portfolio = new Portfolio({
        coins: [portfolioCoin._id],
      });
      await portfolio.save();
      await transaction.save();
      await portfolioCoin.save();
      user.portfolio_id = portfolio._id;
    }
    user
      .save()
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });

    // const portfolioCoin = new PortfolioCoin({
    //   name,
    //   symbol,
    //   transactions: [transaction._id],
    // });
    // const portfolio = new Portfolio({
    //   coins: [portfolioCoin._id],
    // });
    // try {
    //   const user = await UserSchema.findById(userID);
    //   // if user have a portfolio
    //   if (user.portfolio_id) {
    //     const userPortfolio = await Portfolio.findById(user.portfolio_id);
    //     console.log(userPortfolio)
    //     const userPortfolioCoin = await PortfolioCoin.findOne({
    //       name,
    //       symbol,
    //     });
    //     // if user have a portfolio coin
    //     if (portfolio.coins) {
    //       await transaction.save();
    //       userPortfolioCoin.transactions.push(transaction._id);
    //       await userPortfolioCoin.save();
    //     } else {
    //       await portfolioCoin.save();
    //       userPortfolio.coins.push(portfolioCoin._id);
    //       await userPortfolio.save();
    //     }
    //   }
    //   else {
    //     await portfolio.save();
    //     await transaction.save();
    //     await portfolioCoin.save();
    //     user.portfolio_id = portfolio._id;
    //   }
    //   user
    //     .save()
    //     .then((user) => {
    //       res.status(200).json(user);
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //       res.status(500).json(err);
    //     });
    // } catch (err) {
    //   console.error(err);
    //   return res.status(500).json(err);
    // }
  }
  async read(req, res) {
    try {
      const portfolio = await Portfolio.findById(req.body.portfolioID).
        populate({
          path: "coins",
          model: "PortfolioCoin",
          populate: {
            path: "transactions",
            model: "Transaction",
          },
        });
      console.log(portfolio)
      res.status(200).json(portfolio);
    }
    catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
  async update(req, res) {
    const { date, type, amount, price, _id } = req.body;
    Transaction.findByIdAndUpdate(
      _id,
      {
        date,
        type,
        amount,
        price,
      },
      {},
      (err, transaction) => {
        if (err) {
          console.error(err);
          return res.status(500).json(err);
        }
        res.status(200).json(transaction);
      },
    );
  }
  async delete(req, res) {
    const { _id } = req.body;
    Transaction.findByIdAndDelete(_id, (err, transaction) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      // if portfolio coin has no transactions, delete it
      if (transaction) {
        PortfolioCoin.findById(
          transaction.portfolioCoin,
          (err, portfolioCoin) => {
            if (err) {
              console.error(err);
              return res.status(500).json(err);
            }
            if (portfolioCoin && portfolioCoin.transactions.length === 0) {
              PortfolioCoin.findByIdAndDelete(
                portfolioCoin._id,
                (err, portfolioCoin) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json(err);
                  }
                  res.status(200).json("item deleted");
                },
              );
            }
          },
        );
      }
      res.status(200).json("item deleted");
    });
  }
}

module.exports = new PortfolioController();
