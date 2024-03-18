import React, { useState, useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useHistory } from 'react-router-dom'

const Transfer = ({ mainuser, setModalDisplay, modalDisplay }) => {
  const [user, setUser] = useState({ to: null, amount: 0 })
  const alert = useAlert()
  const history = useHistory()

  let name
  let value
  const handleInputs = (e) => {
    name = e.target.name
    value = e.target.value
    setUser({ ...user, [name]: value })
  }
  const [data, setData] = useState()
  const getCustomer = async () => {
    try {
      const res = await fetch('http://localhost:8000/customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      const messageData = await res.json()
      setData(messageData)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getCustomer()
  }, [])

  const TransferData = async (e) => {
    e.preventDefault()
    const { to, amount } = user

    if (to === null) {
      alert.error('Please fill the all data')
      history.push('/customer')
      return
    }
    if (amount === 0) {
      alert.error('Amount should be greater then 0')
      history.push('/customer')
      return
    }
    if (amount > mainuser.accountbalance) {
      alert.error('Transaction not possible')
      history.push('/customer')
      return
    }
    if (amount.match('^[0-9]+$') === null) {
      alert.error('Enter valid amount')
      history.push('/customer')
      return
    }
    if (to === mainuser.name) {
      alert.error('Receiver Name must be diffferent')
      history.push('/customer')
      window.location.reload()
      return
    }

    const res = await fetch('http://localhost:8000/transfers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        from: mainuser.name,
        to: to,
        amount: amount,
      }),
    })
      .then((res) => res.json())
      .then((tsdata) => {
        console.log(tsdata.status)
        if (tsdata.status === 500) {
          alert.error('Transfer not successfull')
        } else {
          alert.success('Transfer Successfull')
          history.push('/transaction')
        }
      })

    setModalDisplay(false)
  }
  const onModalClose = () => {
    setUser({
      to: null,
      amount: 0,
    })
    setModalDisplay(false)
    history.push('/customer')
  }
  return (
    <>
      <div
        className={`transfer-form ${modalDisplay ? 'modalShow' : 'modalHide'}`}
      >
        <ul className="list-group p-3 mx-auto text-center">
          <li className="list-group-item text-center ">
            <div className="row">
              <div className="col-auto">
                <div className="formdiv">
                  <form>
                    <div className="d-flex justify-content-center align-items-center font-weight-bold  ">
                      <div className="h2 text-center box text-uppercase">
                        Transfer
                      </div>
                    </div>
                    <div className="d-flex justify-content-end align-items-center">
                      <button className="modalClose" onClick={onModalClose}>
                        &times;
                      </button>
                    </div>
                    <div>
                      <h3 className="username">{mainuser?.name}</h3>
                    </div>
                    <p className="useremail">{mainuser?.email}</p>
                    <div className="modalBalance">
                      <p>Balance</p>
                      <h3>{mainuser?.accountbalance}</h3>
                    </div>

                    <div>
                      <select
                        className="mt-3"
                        defaultValue="DEFAULT"
                        id="to"
                        name="to"
                        onChange={handleInputs}
                      >
                        <option value="DEFAULT" disabled>
                          - Select a Receiver -
                        </option>
                        {data?.map((data) => (
                          <option id="cust_name" key={data._id} value={user.to}>
                            {data.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        className="mt-4"
                        type="number"
                        name="amount"
                        id="amount"
                        autoComplete="off"
                        placeholder="Enter Amount"
                        value={user.amount}
                        onChange={handleInputs}
                      />
                    </div>
                    <button type="submit" id="submit" onClick={TransferData}>
                      Proceed
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}
export default Transfer
