import React, { Component } from "react"
import { Link } from 'react-router-dom'
import Image from '../assets/cover.jpg'

export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <img src={Image} className="bg" alt="cover image"/>
        <h1>BLOCKCHAIN BASED DIGITAL IDENTITY</h1>
        <h2>A totally decentralised single identity platform</h2>
        <div className="links">
          <Link to="/register">Register |</Link>
          <Link to="/details">&nbsp;Get Details</Link>
        </div>
      </div>
    )
  }
}
