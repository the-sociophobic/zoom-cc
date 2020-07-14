import React, { Component } from 'react'

import NewVersion from 'components/NewVersion'
import OldVersion from 'components/OldVersion'

import 'styles/index.sass'


class App extends Component {
  constructor(props) {
    super(props)

    const currentVersion = window.localStorage.getItem('currentVersion')

    this.state = {
      currentVersion: currentVersion
    }
  }

  setVersion = ver => {
    this.setState({currentVersion: ver})
    window.localStorage.setItem('currentVersion', ver)
  }

  renderButtons = className =>
    <div className={className}>
      <button
        className={`button ${this.state.currentVersion === "new" && "button--selected"}`}
        onClick={() => this.setVersion("new")}
      >
        новая крутая версия <span
          className="emoji"
          role="img"
          aria-label="new"
          title="new"
        >
          ✨
        </span>
      </button>
      <button
        className={`button ${this.state.currentVersion === "old" && "button--selected"}`}
        onClick={() => this.setVersion("old")}
      >
          старая привычная версия <span
          className="emoji"
          role="img"
          aria-label="old"
          title="old"
        >
          👴🏻
        </span>
      </button>
    </div>

  renderHeader = () =>
    this.renderButtons("App__header")

  renderSelect = () =>
    this.renderButtons("App__select")

  render = () => {
    let res

    switch (this.state.currentVersion) {
      case "old":
        res = <OldVersion />
        break;
      case "new":
        res = <NewVersion />
        break;
      default:
        res = this.renderSelect()
    }

    return (
      <div className="App">
        {this.state.currentVersion && this.state.currentVersion.match(/new|old/) && this.renderHeader()}
        {res}
      </div>
    )    
  }
}


export default App
