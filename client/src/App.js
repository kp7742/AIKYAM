import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
  } from "react-router-dom";
import Register from './pages/Register'
import Details from './pages/Details'
// import "bootstrap/dist/css/bootstrap.min.css"
// import "./App.css"

class App extends React.Component {
  render() {
    return (
      <div className="app">
      <Router>
        <Switch>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/details">
            <Details />
          </Route>
        </Switch>
    </Router>
    </div>
    )
  }
}

export default App