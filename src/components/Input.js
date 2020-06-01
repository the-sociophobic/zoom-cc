import React, { Component } from 'react'


export default class Input extends Component {
  constructor(props) {
    super(props)
    this.inputFieldRef = props.inputFieldRef || React.createRef()
  }

  focus = () => this.inputFieldRef.current && this.inputFieldRef.current.focus()
  blur = () => this.inputFieldRef.current && this.inputFieldRef.current.blur()

  onKeyDown = e => {
    const value = "" + this.props.value
    
    if (this.props.number)
      if (this.props.value && value.match(/[^0-9]/g))
        this.props.onChange(value.replace(/[^0-9]/g, ''))
    this.props.onKeyDown && this.props.onKeyDown(e)
  }
  onFocus = e => {
    this.props.onFocus && this.props.onFocus(e)
  }
  onBlur = e => {
    this.props.onBlur && this.props.onBlur(e)
  }

  render = () => (
    <div
      className={"form-group " +
        this.props.className + " " +
        (this.props.errorMessage && "form-group--error")
      }
    >
      <input
        ref={this.inputFieldRef}
        type={this.props.number ? "number" : "text"}
        className="form-group__input"
        placeholder={this.props.placeholder}
        required={this.props.required}
        value={this.props.value}
        onChange={event => this.props.onChange(event.target.value)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        disabled={this.props.disabled}
      />
      {this.props.label &&
        <label className="form-group__label">
          {this.props.label}
        </label>}
    </div>
  )
}
