import React, { Component } from 'react'

import Input from 'components/Input'
import LinedTextArea from 'components/LinedTextArea'
import { postCC } from 'utils/fns'

import 'styles/index.sass'


const testCC = [
  "Я в рот ебал твою мать, ",
  "Пойду насру ей на грудь.",
  "Я не хочу её ебать,",
  "Лучше мочи пойти хлебнуть.",
  "Говно вкусней её стряпни.",
  "А пук лучше звучит,",
  "Чем голос этой хуерги.",
  "Пойди и ёбни ей с ноги.",
].map(string => ({
  string: string,
  ref: React.createRef()
}))

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      APIToken: "",
      current: 0,
      counter: parseInt(window.location.pathname.replace(/[^0-9]/g, '')) || 1,
      lines: testCC,
      text: "В это текстовое поле можно вбить свои субтитры.\nКаждая новая строка будет отдельным субтитром\nЧтобы в ZOOM отобразилась следующая строка, нажмите NEXT\nЭту страницу не стоит перезагружать, иначе всё может сбиться и сломаться\n"
    }
  }

  next = () => {
    const { current, counter, lines, text, APIToken } = this.state

    if (current >= text.split("\n").length)
      return

    window.history.replaceState(null, null, "/zoom-cc/" + counter)
    postCC({
      // string: lines[current].string,
      string: text.split("\n")[current],
      count: counter,
      APIToken: APIToken,
    })
    this.setState({current: current + 1, counter: counter + 1})
  }

  addLineAt = props =>
    this.setState({
      lines: [
        ...this.state.lines.slice(0, props.index),
        props.line,
        ...this.state.lines.slice(props.index + 1),
      ]})

  updateLineAt = props =>
    this.setState({
      lines: [
        ...this.state.lines.slice(0, props.index - 1),
        props.line,
        ...this.state.lines.slice(props.index + 1),
      ]})

  deleteLine = index =>
    this.setState({
      lines: [
        ...this.state.lines.slice(0, index),
        ...this.state.lines.slice(index + 1),
      ]})


  render = () =>
    <div className="App">
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
          (this.state.current < this.state.text.split("\n").length && this.state.text.split("\n")[this.state.current - 1])
        }
      </div>
      <div className="container">
        {/* <LinedTextArea
          lines={this.state.lines}
          current={this.state.current}
          addLineAt={this.addLineAt}
          updateLineAt={this.updateLineAt}
          deleteLine={this.deleteLine}
        /> */}
        <textarea
          className="LinedTextArea"
          value={this.state.text}
          onChange={value => this.setState({text: value})}
        />
      </div>
      <div className="container">
        <button
          disabled={this.state.APIToken.length === 0 || this.state.lines.length === 0}
          className="button button--main"
          onClick={() => this.next()}
        >
          NEXT
        </button>
      </div>
    </div>
}


export default App
