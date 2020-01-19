import React from 'react'
import Identity from '../contracts/Identity.json'
import getWeb3 from '../getWeb3'
import { Form, Button } from 'react-bootstrap'
import '../details.scss'

class Details extends React.Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    uniqueKey: '',
    data: {},
    dataExist: false,
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
        deployedNetwork && deployedNetwork.address,
      )
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance })
      console.log(accounts)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error)
    }
  }

  getDetails = async e => {
    e.preventDefault()
    const { accounts, contract } = this.state
    console.log(this.state.web3)
    console.log(this.state.uniqueKey)

    const data = await contract.methods
      .getPersonDetails(this.state.uniqueKey)
      .call({ from: accounts[0] })
    this.setState({ data, dataExist: true })
    console.log(data)
  }
  render() {
    return (
      <div className="details">
        {this.state.dataExist ? (
          <div className="card">
            <div className="card-avatar">
              <img
                src={
                  'https://avatars0.githubusercontent.com/u/11852869?s=460&v=4'
                }
                alt="Kuldip Patel"
                style={{ width: '190px', height: '190px', margin: '7px' }}
              />
            </div>
            <div className="card-details">
              <div className="name">{this.state.data['0']}</div>
              <div className="occupation">{this.state.data['5']}</div>

              <div className="card-about">
                <div className="item">
                  <span className="value">{this.state.data['3']}</span>
                  <span className="label">Gender</span>
                </div>
                <div className="item">
                  <span className="value">{this.state.data['1']}</span>
                  <span className="label">Date of Birth</span>
                </div>
                <div className="item">
                  <span className="value">{this.state.data['4']}</span>
                  <span className="label">Blood Group</span>
                </div>
              </div>
              <div className="skills">
                <span className="label">Address</span>
                <span className="value">{this.state.data['2']}</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1>{this.state.accounts}</h1>
            <Form onSubmit={this.getDetails}>
              <Form.Label>Enter Unique Key of Person</Form.Label>
              <Form.Control
                type="text"
                value={this.state.fname}
                placeholder="Unique key"
                onChange={e => this.setState({ uniqueKey: e.target.value })}
                name="fname"
                required
              />
              <Button type="submit">Get Details</Button>
            </Form>
          </div>
        )}
      </div>
    )
  }
}

export default Details
