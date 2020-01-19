import React, { Component } from "react"
import Identity from "../contracts/Identity.json"
import getWeb3 from "../getWeb3"
import { Form, Button } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
const IPFS = require("ipfs-api")
const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" })

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
      unkey: null,
      ipfsHash: null
    }
  }

  // * Loads Blockchain on Network
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

  // * send image to IPFS and register Person Details
  onIPFSSubmit = async event => {
    event.preventDefault()

    //bring in user's metamask account address
    const accounts = this.state.accounts

    console.log("Sending from Metamask account: " + accounts[0])

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add

    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash)
      //setState by setting ipfsHash to ipfsHash[0].hash
      this.setState({ ipfsHash: ipfsHash[0].hash }, async function() {
        const testData = await this.state.contract.methods
          .addPersonDetails(
            this.state.fname,
            this.state.dob,
            this.state.addr,
            this.state.gender,
            this.state.bloodgroup,
            Number(this.state.mobile),
            this.state.ipfsHash
          )
          .send({ from: accounts[0] })
        let testit
        await this.state.contract.methods
          .uniqueKey()
          .call({ from: accounts[0] })
          .then(function(result) {
            testit = result
          })
          .then(() => {
            this.setState({ unkey: testit })
          })
        if (testData) {
          console.log(testData)
          this.setState({ fname: "", lname: "", mobile: 0, dob: "" })
        }
      })
    })
  }

  // * converting image to buffer
  convertToBuffer = async reader => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result)
    //set this buffer -using es6 syntax
    this.setState({ buffer })
  }

  // * capture file
  captureFile = event => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  }

  // * check for IPFS response
  handleReceiveIPFS(event) {
    event.preventDefault()
    const contract = this.state.contract
    const account = this.state.accounts[0]
    contract.checkInbox({ from: account })
  }

  // * init of add member to blockchain
  addMember = async e => {
    e.preventDefault()

    await this.onIPFSSubmit(e)
    if (this.state.ipfsHash !== null) {
      console.log(this.state)
    }
  }

  // * Change value of state for different input
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
            <Form.Control
              name="gender"
              as="select"
              onChange={this.onChange}
              value={this.state.gender}
            >
              <option name="gender" value="male">
                Male
              </option>
              <option name="gender" value="female">
                Female
              </option>
              <option name="gender" value="other">
                Other
              </option>
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
              placeholder="Mobile"
              onChange={this.onChange}
              name="mobile"
              required
            />
            <Form.Label>Choose Image</Form.Label>
            <Form.Control type="file" onChange={this.captureFile} />
            <Button type="submit" variant="primary">
              Add Member
            </Button>
          </Form.Group>
        </Form>
        {this.state.unkey ? <h2>{this.state.unkey}</h2> : ""}
      </div>
    )
  }
}
export default Register
