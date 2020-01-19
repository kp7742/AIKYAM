import React from 'react'

class Card extends React.Component {
  render() {
    return (
      <div className="details">
        <div className="card">
          <div className="card-avatar">
            <img
              src="https://avatars0.githubusercontent.com/u/11852869?s=460&v=4"
              alt="Kuldip Patel"
              style="height: 190px; width:190px; margin:7px;"
            />
          </div>
          <div className="card-details">
            <div className="name">Kuldip Patel</div>
            <div className="occupation">7096718415</div>

            <div className="card-about">
              <div className="item">
                <span className="value">Male</span>
                <span className="label">Gender</span>
              </div>
              <div className="item">
                <span className="value">17/02/1999</span>
                <span className="label">Date of Birth</span>
              </div>
              <div className="item">
                <span className="value">O+ve</span>
                <span className="label">Blood Group</span>
              </div>
            </div>
            <div className="skills">
              <span className="label">Address</span>
              <span className="value">surat, Gujarat, India, 39</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
