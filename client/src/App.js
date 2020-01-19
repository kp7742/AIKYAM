import React, { Component } from "react"
import Identity from "./contracts/Identity.json"
import getWeb3 from "./getWeb3"
import { Form, Button } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    fname: "",
    lname: "",
    dob: "",
    addr: "",
    gender: "",
    bloodgroup: "",
    mobile: 0,
    unkey: null
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
      this.setState({ web3, accounts, contract: instance }, )
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
    console.log(this.state)
    // const test = await contract.methods
    const testData = await contract.methods
      .addPersonDetails(
        this.state.fname,
        this.state.dob,
        this.state.addr,
        this.state.gender,
        this.state.bloodgroup,
        Number(this.state.mobile),
        "some random string"
      )
      .send({ from: accounts[0] })
      let testit
    contract.methods.uniqueKey().call({ from: accounts[0] }).then(function(result) {
      testit = result
    }).then(() => {
      this.setState({ unkey: testit })
    })
    if (testData) {
      console.log(testData)
      this.setState({ fname: "", lname: "", mobile: 0, dob: "" })
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className="App">
        <h1>{this.state.accounts[0]}</h1>
        {
          this.state.unkey ? (
          <h2>{this.state.unkey}</h2>
          ): ""
        }
        <Form onSubmit={this.addMember}>
          <Form.Group>
          <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={this.state.fname}
              placeholder="First name"
              onChange={this.onChange}
              name="fname"
              required
            />
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={this.state.lname}
              placeholder="Last name"
              onChange={this.onChange}
              name="lname"
              required
            />
            <Form.Label>Gender</Form.Label>
            <Form.Control name="gender" as="select" onChange={this.onChange} value={this.state.gender}>
              <option name="gender" value="male">Male</option>
              <option name="gender" value="female">Female</option>
              <option name="gender" value="other">Other</option>
            </Form.Control>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={this.state.dob}
              placeholder="Date of Birth"
              onChange={this.onChange}
              name="dob"
              required
            />
            <Form.Label>Blood Group</Form.Label>
            <Form.Control
              type="text"
              value={this.state.bloodgroup}
              placeholder="Blood Group"
              onChange={this.onChange}
              name="bloodgroup"
              required
            />
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              value={this.state.addr}
              placeholder="Address"
              onChange={this.onChange}
              name="addr"
              required
            />
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="number"
              value={this.state.mobile}
              placeholder="Blood Group"
              onChange={this.onChange}
              name="mobile"
              required
            />
            <Button type="submit" variant="primary">
              Add Member
            </Button>
          </Form.Group>
        </Form>
      </div>
    )
  }
}
export default App