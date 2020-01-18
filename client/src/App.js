import React, { Component } from 'react'
import Identity from './contracts/Identity.json'
import getWeb3 from './getWeb3'

import './App.css'

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    fname: '',
    lname: '',
    age: 0,
    date: ''
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()

      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = Identity.networks[networkId]
      const instance = new web3.eth.Contract(
        Identity.abi,
        deployedNetwork && deployedNetwork.address
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance })
      console.log(accounts)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.error(error)
    }
  }

  addMember = async e => {
    e.preventDefault()
    const { accounts, contract } = this.state

    const testData = await contract.methods
      .addMember(
        this.state.fname,
        this.state.lname,
        this.state.age,
        this.state.date
      )
      .send({ from: accounts[0] })
      if (testData) {
        this.setState({ fname: '', lname: '', age: 0, date: '' })
      }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render () {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className='App'>
        <h1>{this.state.accounts[0]}</h1>
        <form onSubmit={this.addMember}>
          <input
            type='text'
            value={this.state.fname}
            placeholder='First name'
            onChange={this.onChange}
            name='fname'
          />
          <input
            type='text'
            value={this.state.lname}
            placeholder='Last name'
            onChange={this.onChange}
            name='lname'
          />
          <input
            type='number'
            value={this.state.age}
            placeholder='Age'
            onChange={this.onChange}
            name='age'
          />
          <input
            type='text'
            value={this.state.date}
            placeholder='date'
            onChange={this.onChange}
            name='date'
          />
          <button type='submit'>Add Member</button>
        </form>
      </div>
    )
  }
}

export default App
