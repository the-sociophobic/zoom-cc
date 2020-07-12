import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import axios from 'axios'
import { format } from 'date-fns'
import _ from 'lodash'

import model from 'utils/models/subtitle'
import Input from 'components/Input'

import 'styles/index.sass'


axios.defaults.headers.post['Accept'] = "*/*"
axios.defaults.headers.post['Content-Type'] = "json"

const serverURL = process.env.NODE_ENV === 'production' ?
  "https://schedule.tochkadostupa.spb.ru/zoom-cc/"
  :
  "http://localhost:3000/zoom-cc/"



class App extends Component {
  constructor(props) {
    super(props)

    const APIToken = window.localStorage.getItem('APIToken')

    this.state = {
      APIToken: APIToken || "",
      APITokenInput: "",
      subtitles: [],
      initialText: "",
      loading: false,
    }
  }

  componentDidMount = () =>
    this.login(this.state.APIToken)

  activateLoader = async fn => {
    this.setState({loading: true})
    await fn()
    this.state.subtitles
      .forEach(sub =>
        sub.ref.current &&
          (sub.ref.current.style = ''))
    this.setState({loading: false})
  }

  tryPost = async (URL, props) =>
    await this.activateLoader(async () => {
      const res = (await axios.post(URL, props)).data

      if (res.error) {
        console.log(res.error)
        alert("Произошла ошибка. Проверьте консоль")
        return
      }
  
      this.setState({
        subtitles: [
          ...res,
          {
            APIToken: this.state.APIToken,
            number: res.length === 0 ? 1 : res[res.length - 1].number + 1,
            line: ""
          }
        ].map(sub => ({
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
      APITokenInput: "",
      initialText: "",
    })
  }

  next = async () =>
    await this.tryPost(
      serverURL + "next",
      { APIToken: this.state.APIToken })

  saveSubtitle = async sub =>
    await this.tryPost(
      serverURL + "save",
      { subtitle: _.pick(sub, _.keys(model)) })

  deleteSubtitle = async sub => 
    await this.tryPost(
      serverURL + "delete",
      { subtitle: _.pick(sub, _.keys(model)) })

  swapSubtitles = async (sub0, sub1) =>
    await this.tryPost(
      serverURL + "swap",
      { subtitle0: sub0.id, subtitle1: sub1.id })

  insertSubtitle = (prevSub, index) => {
    this.setState({
      subtitles: [
        ...this.state.subtitles.slice(0, index + 1),
        {
          line: "",
          number: prevSub.number + 1,
          APIToken: this.state.APIToken,
          ref: React.createRef(),
        },
        ...this.state.subtitles.slice(index + 1)
      ]
    })
    setTimeout(() =>
      this.state.subtitles[index + 1].ref.current.focus()
    , 200)
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
          className="button button--main mt-3"
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
            {this.state.APIToken
              .slice(this.state.APIToken.indexOf('id'))}
          </div>
          <button
            className="control__header__exit"
            onClick={() => this.logout()}
          >
            выйти
          </button>
        </div>
      </div>

      <div className="control__content">
        {this.renderSubtitles()}
      </div>

      <div className="control__next">
        <div className="container">
          <button
            disabled={
              this.state.subtitles.filter(sub => !sub.posted).length === 0 ||
              !this.state.subtitles.filter(sub => !sub.posted)[0].id}
            className="button button--main"
            onClick={() => this.next()}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>

  renderSubtitles = () =>
    <div className="container">
      <div className="control__subtitles">
        {this.state.subtitles.length === 0 || !this.state.subtitles[0].id ?
          <>
            <textarea
              className="control__subtitles__textarea"
              value={this.state.initialText}
              onChange={e => this.setState({initialText: e.target.value})}
              placeholder="введите текст и нажмите сохранить"
            />
            <button
              className="button button--main"
              disabled={this.state.initialText.length === 0}
              onClick={() => this.saveSubtitle({
                line: this.state.initialText,
                APIToken: this.state.APIToken,
                number: 1,
              })}
            >
              сохранить
            </button>
          </>
          :
          this.state.subtitles
            .map((sub, index) =>
              <div
                key={sub.id || sub.number}
                className={`control__subtitles__item ${sub.posted && "control__subtitles__item--posted"}`}
              >
                <div className="control__subtitles__item__number">
                  {sub.id && `${sub.number}.`}
                </div>
                {sub.posted ?
                  <>
                    <div className="control__subtitles__item__input">
                      {sub.line}
                    </div>
                    <div className="control__subtitles__item__posted">
                      {format(new Date(sub.posted), 'HH:mm:ss')}
                    </div>
                  </>
                  :
                  <>
                    <textarea
                      ref={sub.ref}
                      className="control__subtitles__item__input"
                      value={sub.line}
                      rows={1}
                      onKeyDown={e =>
                        e.keyCode === 27 &&
                        (sub.ref.current && sub.ref.current.blur())}
                      onChange={e => {
                        this.setState({
                          subtitles: [
                            ...this.state.subtitles.slice(0, index),
                            {
                              ...sub,
                              line: e.target.value,
                            },
                            ...this.state.subtitles.slice(index + 1),
                          ]
                        })

                        if (e.target.value.includes('\n'))
                          sub.ref.current.style.height = "200px"
                      }}
                      onBlur={() => this.saveSubtitle(sub)}
                    />
                    <div className="control__subtitles__item__buttons">
                      <button
                        className="button button--transparent"
                        disabled={!sub.id || index > this.state.subtitles.length - 3}
                        onClick={() => this.insertSubtitle(sub, index)}
                      >
                        +
                      </button>
                      <button
                        className="button button--transparent"
                        disabled={!sub.id}
                        onClick={() => this.deleteSubtitle(sub)}
                      >
                        -
                      </button>
                      <button
                        className="button button--transparent"
                        disabled={!sub.id || index === this.state.subtitles.length - 2}
                        onClick={() => this.swapSubtitles(sub, this.state.subtitles[index + 1])}
                      >
                        ⇩
                      </button>
                      <button
                        className="button button--transparent"
                        disabled={!sub.id || index === 0 || this.state.subtitles[index - 1].posted !== 0}
                        onClick={() => this.swapSubtitles(sub, this.state.subtitles[index - 1])}
                      >
                        ↑
                      </button>
                    </div>
                  </>
                }
              </div>
            )}
      </div>
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
