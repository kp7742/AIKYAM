# AIKYAM(ऐक्यम्)
![logo][0]

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

## What is AIKYAM?
AIKYAM provides a decentralized way to securely store a unique identification of Person through Blockchain Technology. AIKYAM is Sanskrit Word,which means Identity, Sameness or Oneness.

## Features
- Generate Unique Identification for Person
- Decentralized Data Storage
- Verification of Identity for KYC like Processes
- Easy and Secure Access through APIs

[0]: https://github.com/kp7742/AIKYAM/blob/master/logo.png?raw=true

## Tech Stack
- Truffle
- Ethereum
- IPFS (InterPlanetary File System)
- React 
- Metamask browser extension


## Running it locally
  1. Install nodejs and ganache (for local blockchain network) if you haven't
  2. clone the repository
  ```
   git clone https://github.com/kp7742/AIKYAM.git
  ```
  3. Install truffle globally and install all node dependencies
  ```
   npm install -g truffle
   npm install 
  ```
  4. Compile and migrate to local blockchain network
  ```
   truffle compile
   truffle migrate
  ```
  5. Running the client on localhost:3000
  ```
   cd client
   npm run start
  ```
