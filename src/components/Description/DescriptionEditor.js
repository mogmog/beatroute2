import React, {Component} from 'react';

import {EditorState, convertFromRaw, convertToRaw} from 'draft-js'

import Editor from 'draft-js-plugins-editor';

const MAX_LENGTH = 10;

const raw = {
  "entityMap": {},
  "blocks": [
    {
      "key": "e4brl",
      "text": "3 Day Jaunt",
      "type": "header-one",
      "depth": 0,
      "entityRanges": [],
      "data": {}
    }

  ]
};

export default class DescriptionEditor extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    editorState: EditorState.createWithContent(convertFromRaw( raw )),
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {

    const { editorState } = this.state;

    return (

      <div>

        <div onClick={this.focus}>

          <Editor
            readOnly={false}
            editorState={editorState}
            onChange={this.onChange}
            plugins={[]}
            ref={(element) => {
              this.editor = element;
            }}
          />

        </div>
      </div>
    );
  }
}
