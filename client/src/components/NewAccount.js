import React, { useState } from 'react'
import { useAlert } from 'react-alert'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'

function NewAccount({}) {
  const history = useHistory()
  const alert = useAlert()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    accountno: '',
    ifscno: '',
    accountbalance: '',
  })

  const [isError, setIsError] = useState(false) // State to track form submission errors

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if any field is empty (you can add more validation logic here)
    if (
      formData.name === '' ||
      formData.email === '' ||
      formData.phone === '' ||
      formData.accountno === '' ||
      formData.ifscno === '' ||
      formData.accountbalance === ''
    ) {
      setIsError(true)
      return
    }

    try {
      const response = await fetch('http://localhost:8000/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.status === 201) {
        alert.success('Account added successfully')
        history.push('/customer')
      } else {
        console.error('Failed to add account')
        history.push('/add')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p className="h5" style={{ padding: '10px', margin: 'auto 0' }}>
          Fill this form to create a new customer
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'self-start',
          height: '100vh',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            borderRadius: '15px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
            padding: '50px',
            backgroundColor: '#F39C12',
            maxWidth: '500px',
          }}
        >
          {isError && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              Please fill out all fields.
            </div>
          )}
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Account Number:</label>
            <input
              type="number"
              name="accountno"
              value={formData.accountno}
              onChange={handleChange}
              pattern="[0-9]{15}"
              required
            />
          </div>
          <div>
            <label>IFSC Number:</label>
            <input
              type="text"
              name="ifscno"
              value={formData.ifscno}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Account Balance:</label>
            <input
              type="number"
              name="accountbalance"
              value={formData.accountbalance}
              onChange={handleChange}
              required
            />
          </div>
          <button className="sendspan" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewAccount
