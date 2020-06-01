import React, { Component } from 'react'

import Input from 'components/Input'


class LinedTextArea extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inputString: "",
      inputIndex: this.props.lines.length,
      newLineFocused: false,
    }

    this.lastLineRef = React.createRef()
    this.focusedLineRef = React.createRef()
  }

  renderLine = (line, index, newLine) => {
    const {
      current,
      lines,
      addLineAt,
      updateLineAt,
      deleteLine,
    } = this.props
    const {
      inputString,
      inputIndex,
      newLineFocused,
    } = this.state
    // const hasFocus = index && lines[index].ref.current && lines[index].ref.current.hasFocus()
    const lastLine = index === lines.length
    const hasFocus = newLineFocused ? (newLine && inputIndex === index) : (!newLine && inputIndex === index)
    const string = hasFocus ?
      inputString
      :
      newLineFocused ? line.string : (lines[index] ? lines[index].string : "")
    const ref = hasFocus ? this.focusedLineRef : line.ref
    const props = {
      line: {
        string: string,
        ref: line.ref,
      },
      index: inputIndex
    }
    
    const nextFocus = () => {
      const nextLine = !lastLine &&
        (index < lines.length - 1 ? lines[index + 1].ref : this.lastLineRef)

      nextLine && nextLine.current && nextLine.focus()
    }
      

    const pushLine = () =>
      newLine ?
        (string.length > 0 && addLineAt(props))
        :
        updateLineAt(props)

    const onKeyDown = e => {
      if (!hasFocus)
        return

      switch(e.keyCode) {
        case 13: //ENTER
          pushLine()
          this.setState({
            inputString: "",
            inputIndex: index,
            newLineFocused: true,
          })
          setTimeout(() => this.focusedLineRef.current && this.focusedLineRef.current.focus(), 100)
          return
        case 27: //ESC
          ref.current && ref.current.blur()
          console.log(ref)
          return

        default:
      }
    }

    const onBlur = () => {
      pushLine()
      this.setState({
        newLineFocused: false,
        inputIndex: -1,
      })
    }

    return (
      <div
        className={"LinedTextArea__line " + (index < current && "LinedTextArea__line--past")}
        // onClick={() => ref && ref.current && ref.current.focus()}
      >
        <div
          className="LinedTextArea__line__index"
          // onClick={() => ref && ref.current && ref.current.focus()}
        >
          {newLine ? "+" : (index + 1)}
        </div>
        {!(lastLine && string.length === 0) &&
          <button
            disabled={index < current}
            className="LinedTextArea__line__delete"
            onClick={() => newLine ?
              this.setState({newLineFocused: false, inputIndex: -1})
              :
              deleteLine(index)
            }
          />
        }
        <Input
          inputFieldRef={ref}
          disabled={index < current}
          className="LinedTextArea__line__Input"
          value={string}
          onChange={value => this.setState({inputString: value})}
          // onKeyDown={e => e.keyCode === '13' && line.line.length > 0 && this.addLine("", index + 1)}
          onKeyDown={onKeyDown}
          onFocus={() => this.setState({inputString: string, inputIndex: index, newLineFocused: lastLine})}
          onBlur={onBlur}
        />
      </div>
    )
  }

  render = () => {
    const { inputString, inputIndex, newLineFocused } = this.state
    const { lines } = this.props
    const mappedLines = lines
      .map((line, index) =>
        this.renderLine(line, index))

    return (
      <div className="LinedTextArea">
        <div className="LinedTextArea__content">
          {newLineFocused ?
            <>
              {mappedLines.slice(0, inputIndex)}
              {this.renderLine({string: inputString, ref: this.focusedLineRef}), inputIndex, true}
              {mappedLines.slice(inputIndex)}
            </>
            :
            mappedLines
          }
          {this.renderLine({string: "", ref: this.lastLineRef}, lines.length, true)}
        </div>
      </div>
    )
  }
}


export default LinedTextArea