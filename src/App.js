import React, { Component } from 'react'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0
    }
  }

  next = () => {
    window.history.replaceState(null, null, "/" + (this.state.current + 1))
    this.setState({current: this.state.current + 1})
  }

  render = () =>
    <div className="App">
      <div className="container">
        <div className="d-flex flex-column justify-content-around">
          <div className="">
            
          </div>
          <div className="">

          </div>
          <div
            className="button"
            onClick={() => this.next()}
          >
            NEXT
          </div>
        </div>
      </div>
    </div>
}


export default App
