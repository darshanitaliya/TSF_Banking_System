const express = require('express')
const router = express.Router()
const Transaction = require('../Models/transaction')
const Customers = require('../Models/userSchema')

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

router.get('/customers', async (req, res) => {
  const customers = await Customers.find({}, { _id: 0 })
  res.send(customers)
})

router.post('/add', async (req, res) => {
  try {
    const { name, email, phone, accountno, ifscno, accountbalance } = req.body

    const newCustomer = new Customers({
      name,
      email,
      phone,
      accountno,
      ifscno,
      accountbalance,
    })
    await newCustomer.save()

    res
      .status(201)
      .json({ message: 'Customer added successfully', customer: newCustomer })
  } catch (error) {
    // console.error(error)
    res.status(500).send('Server Error')
  }
})

router.post('/transfers', async (req, res) => {
  const { from, to, amount } = req.body
  try {
    const fromCustomer = await Customers.findOne({ name: `${from}` })
    const newFromBalance = Number(fromCustomer.accountbalance) - Number(amount)
    Customers.updateOne(
      { name: from },
      { accountbalance: newFromBalance },
      (err) => {
        if (err) {
          // console.log('A')
          // console.log(err)
          res.status(500).send('Server Error')
        } else {
          // console.log('UPDATED')
        }
      }
    )
    const toCustomer = await Customers.findOne({ name: `${to}` })
    const newToBalance = Number(toCustomer.accountbalance) + Number(amount)
    Customers.updateOne(
      { name: to },
      { accountbalance: newToBalance },
      (err) => {
        if (err) {
          // console.log('B')
          // console.log(err)
          res.status(500).send('Server Error')
        } else {
          // console.log('UPDATED')
        }
      }
    )
    const transaction = new Transaction({
      from: fromCustomer,
      to: toCustomer,
      amount,
      date: Date.now(),
    })
    transaction.save()
    res.json(transaction)
  } catch (error) {
    // console.log('C')
    // console.log(error)
    res.status(500).send('Server Error')
  }
})

router.get('/transactions', async (req, res) => {
  const transactions = await Transaction.find({}).sort({ date: -1 })
  res.send(transactions)
})

module.exports = router
