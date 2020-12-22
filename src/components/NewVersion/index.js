import React from 'react'
import ReactDOM from 'react-dom'

import axios from 'axios'
import { format } from 'date-fns'
import _ from 'lodash'

import model from './models/subtitle'
import Input from 'components/Input'
import serverURL from 'utils/serverURL'
import copyToClipboard from 'utils/copyToClipboard'

import 'styles/index.sass'


axios.defaults.headers.post['Accept'] = "*/*"
axios.defaults.headers.post['Content-Type'] = "json"


class NewVersion extends React.Component {
  constructor(props) {
    super(props)

    const APIToken = window.localStorage.getItem('APIToken')

    this.state = {
      APITokenInput: "",
      APIToken: APIToken || "",
      subtitles: [],
      // APIToken: APIToken || "a",
      // subtitles: [
      //   {id: 1, number: 1, line: "a", posted: true },
      //   {id: 2, number: 2, line: "b" },
      //   {id: 3, number: 3, line: "c" },
      //   {id: 4, number: 4, line: "d" },
      //   {id: 5, number: 5, line: "e" },
      // ],
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
        alert("Error: check the console")
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
          placeholder="Copy the API token from Zoom. Paste it here"
        />
        <button
          className="button button--main mt-3"
          onClick={() => this.login(this.state.APITokenInput)}
        >
          Log in
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
            Log out
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
              placeholder="Enter text and press «save». Each line will be a separate subtitle"
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
              save
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
                    <button
                      className="button button--control button--copy"
                      onClick={() => copyToClipboard(sub.line)}
                      data-toggle="tooltip" data-placement="bottom" title="copy this subtitles text to clipboard"
                    />
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
                        className="button button--control button--add"
                        disabled={!sub.id || index > this.state.subtitles.length - 3}
                        onClick={() => this.insertSubtitle(sub, index)}
                        data-toggle="tooltip" data-placement="bottom" title="add new subtitle after that one"
                      />
                      <button
                        className="button button--control button--remove"
                        disabled={!sub.id}
                        onClick={() => this.deleteSubtitle(sub)}
                        data-toggle="tooltip" data-placement="bottom" title="remove this subtitle"
                      />
                      <button
                        className="button button--control button--down"
                        disabled={!sub.id || index === this.state.subtitles.length - 2}
                        onClick={() => this.swapSubtitles(sub, this.state.subtitles[index + 1])}
                        data-toggle="tooltip" data-placement="bottom" title="move this subtitle down"
                      />
                      <button
                        className="button button--control button--up"
                        disabled={!sub.id || index === 0 || this.state.subtitles[index - 1].posted !== 0}
                        onClick={() => this.swapSubtitles(sub, this.state.subtitles[index - 1])}
                        data-toggle="tooltip" data-placement="bottom" title="move this subtitle up"
                      />
                    </div>
                  </>
                }
              </div>
            )}
      </div>
    </div>


  render = () =>
    <div className="NewVersion">
      {this.state.APIToken ?
        this.renderControl()
        :
        this.renderLogin()}

      {ReactDOM.createPortal(
        this.renderLoading(),
        document.body)}
    </div>
}


export default NewVersion
