import React, { Component } from 'react'

import Input from 'components/Input'
import { postCC } from './fns'


class OldVersion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      APIToken: "",
      current: 0,
      counter: parseInt(window.location.hash.replace(/[^0-9]/g, '')) || 0,
      text: "В это текстовое поле можно вбить свои субтитры.\nКаждая новая строка будет отдельным субтитром\nЧтобы в ZOOM отобразилась следующая строка, нажмите NEXT\nЭту страницу не стоит перезагружать, иначе всё может сбиться и сломаться\n"
    }
  }

  next = () => {
    const { current, counter, text, APIToken } = this.state

    if (current >= text.split("\n").length)
      return

    window.history.replaceState(null, null, "/zoom-cc/#" + counter)
    console.log(counter)
    postCC({
      string: text.split("\n")[current],
      count: counter,
      APIToken: APIToken,
    })
    this.setState({current: current + 1, counter: counter + 1})
  }


  render = () =>
    <div className="OldVersion">
      <div className="container">
        <Input
          value={this.state.APIToken}
          onChange={value => this.setState({APIToken: value})}
          label="ZOOM API token"
          placeholder="Скопируйте и вставьте ZOOM API token из приложения"
        />
      </div>
      <div className="container">
        Текущий субтитр: {this.state.current === 0 ?
          ""
          :
          (this.state.current <= this.state.text.split("\n").length && this.state.text.split("\n")[this.state.current - 1])
        }
      </div>
      <div className="container">
        <textarea
          className="LinedTextArea"
          value={this.state.text}
          onChange={e => this.setState({text: e.target.value})}
        />
      </div>
      <div className="container">
        <button
          disabled={this.state.APIToken.length === 0 ||
            this.state.text.length === 0 ||
            this.state.current >= this.state.text.split("\n").length
          }
          className="button button--main"
          onClick={() => this.next()}
        >
          NEXT
        </button>
      </div>
    </div>
}


export default OldVersion