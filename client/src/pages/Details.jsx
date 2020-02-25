import React from 'react'
import QRCode from 'qrcode.react'
import Identity from '../contracts/Identity.json'
import getWeb3 from '../getWeb3'
import { Form, Button } from 'react-bootstrap'

import '../details.scss'
const IPFS = require('ipfs-api')
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Details extends React.Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    uniqueKey: '',
    data: {},
    dataExist: false,
    imageUrl: '',
    error: ''
  }
  componentDidMount = async () => {
    try {
      // * Get network provider and web3 instance.
      const web3 = await getWeb3()
      // * Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()
      // * Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = Identity.networks[networkId]
      const instance = new web3.eth.Contract(
        Identity.abi,
        deployedNetwork && deployedNetwork.address,
      )
      // * Set web3, accounts, and contract to the state, and then proceed with an
      // * example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance })
    } catch (error) {
      // * Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error)
    }
  }

  getDetails = async e => {
    e.preventDefault()
    // * reset error 
    this.state.error = ''
    const { accounts, contract } = this.state

    try {
      let imageUrl = ''
      const that = this
      const data = await contract.methods
        .getPersonDetails(this.state.uniqueKey)
        .call({ from: accounts[0] })
      this.setState({ data, dataExist: true })
      ipfs.files.cat(this.state.data['6'], function(err, file) {
        imageUrl = 'data:image/png;base64,' + file.toString('base64')
        that.setState({ imageUrl })
      })
    } catch (error) {
      this.setState({ error : 'No user found with the key' })
    }
  }
  render() {
    return (
      <div className="details">
        {this.state.dataExist ? (
          <div className="card">
            <div className="card-avatar">
              <img
                id="remoteimg"
                src={this.state.imageUrl}
                alt="image"
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
              <div className="qr">
                <QRCode value={this.state.uniqueKey} size={128} />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2>Account Address: {this.state.accounts}</h2>
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
              <Button type="submit" className="center">Get Details</Button>
            </Form>
          </div>
        )}
        {this.state.error ? (
          <h1 style={{color: 'red', fontSize: '20px'}}>{this.state.error}</h1>
        ): ''}
      </div>
    )
  }
}

export default Details
