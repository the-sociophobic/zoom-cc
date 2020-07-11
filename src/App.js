import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import axios from 'axios'
import { format } from 'date-fns'

import Input from 'components/Input'

import 'styles/index.sass'


axios.defaults.headers.post['Accept'] = "*/*"
axios.defaults.headers.post['Content-Type'] = "json"

const serverURL = process.env.NODE_ENV === 'production' ?
  "https://schedule.tochkadostupa.spb.ru/zoom-cc/"
  :
  "http://localhost:3000/zoom-cc/"


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

    const APIToken = window.localStorage.getItem('APIToken')

    this.state = {
      APIToken: APIToken || "",
      APITokenInput: "",
      subtitles: [],
      loading: false,
    }
  }

  componentDidMount = () =>
    this.login(this.state.APIToken)

  activateLoader = async fn => {
    this.setState({loading: true})
    await fn()
    this.setState({loading: false})
  }

  tryPost = async (URL, props) =>
    await this.activateLoader(async () => {
      const res = (await axios.post(URL, props)).data

      if (res.error) {
        console.log(res.error)
        return
      }
  
      console.log(res)
      this.setState({
        subtitles: res.map(sub => ({
          ...sub,
          ref: React.createRef()
        }))
      })
    })

  login = async APIToken => {
    if (APIToken) {
      await this.tryPost(
        serverURL + "login",
        { APIToken: APIToken })

      this.setState({APIToken: APIToken})
      window.localStorage.setItem('APIToken', APIToken)
    }
  }

  logout = () => {
    window.localStorage.removeItem('APIToken')
    this.setState({
      APIToken: undefined,
      subtitles: [],
    })
  }

  next = async () =>
    await this.tryPost(
      serverURL + "next",
      { APIToken: this.state.APIToken })

  saveSubtitle = async sub => 
    await this.tryPost(
      serverURL + "save",
      sub)

  deleteSubtitle = async sub => 
    await this.tryPost(
      serverURL + "delete",
      sub)

  swapSubtitles = async (sub0, sub1) =>
    await this.tryPost(
      serverURL + "swap",
      { subtitle0: sub0.id, subtitle1: sub1.id })

  insertSubtitle = index => {
    this.setState({
      subtitles: [
        ...this.state.subtitles.slice(0, index + 1),
        {
          line: "",
          number: index + 1,
          APIToken: this.state.APIToken,
          ref: React.createRef()
        },
        ...this.state.subtitles.slice(index + 1)
      ]
    })
  }


  renderLoading = () =>
    this.state.loading &&
      <div className="loader" />

  renderLogin = () =>
    <div className="login">
      <div className="container">
        <Input
          value={this.state.APITokenInput}
          onChange={value => this.setState({APITokenInput: value})}
          label="ZOOM API token"
          placeholder="Скопируйте и вставьте ZOOM API token из приложения"
        />
        <button
          className="button button--main"
          onClick={() => this.login(this.state.APITokenInput)}
        >
          войти
        </button>
      </div>
    </div>

  renderControl = () =>
    <div className="control">
      <div className="container">
        <div className="control__header">
          <div className="control__header__token">
            {this.state.APIToken}
          </div>
          <button
            className="control__header__exit"
            onClick={() => this.logout()}
          >
            выйти
          </button>
        </div>

        {this.renderSubtitles()}

        <div className="control__next">
          <button
            disabled={this.state.subtitles.filter(sub => !sub.posted).length > 0}
            className="button button--main"
            onClick={() => this.next()}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>

  renderSubtitles = () =>
    <div className="control__subtitles">
      {this.state.subtitles.map((sub, index) =>
        <div className={`control__subtitles__item ${sub.posted && "control__subtitles__item--posted"}`}>
          <div className="control__subtitles__item__number">
            {sub.number}.
          </div>
          <Input
            key={sub.id || sub.number}
            className="control__subtitles__item__input"
            value={sub.line}
            onChange={value => this.setState({
              subtitles: [
                ...this.state.subtitles.slice(0, index),
                {
                  ...sub,
                  line: value,
                },
                ...this.state.subtitles.slice(index + 1),
              ]
            })}
            onBlur={() => this.saveSubtitle(sub)}
          />
          <div className="control__subtitles__item__buttons">
            {sub.posted ?
              format(new Date(sub.posted), 'HH:mm:ss')
              :
              <>
                <button
                  className="button button--transparent"
                  onClick={() => this.insertSubtitle(sub)}
                >
                  +
                </button>
                <button
                  className="button button--transparent"
                  onClick={() => this.deleteSubtitle(sub)}
                >
                  -
                </button>
              </>
            }
          </div>
        </div>
      )}
    </div>


  render = () =>
    <div className="App">
      {this.state.APIToken ?
        this.renderControl()
        :
        this.renderLogin()}

      {ReactDOM.createPortal(
        this.renderLoading(),
        document.body)}
    </div>
}


export default App
