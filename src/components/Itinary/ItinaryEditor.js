import React, {Component} from 'react';

import {EditorState, convertFromRaw, convertToRaw} from 'draft-js'

import createAutosavePlugin from '@jimmycode/draft-js-autosave-plugin';
import Editor from 'draft-js-plugins-editor';

const mySaveFunction = () => { console.log("saving") }

const config = {
  saveFunction: mySaveFunction,
  debounceTime: 1000,
  saveAlways: false
};

console.log(createAutosavePlugin);

const autosavePlugin = createAutosavePlugin(config)

const {
  SavingComponent
} = autosavePlugin;

const raw = {
  "entityMap": {},
  "blocks": [
    {
      "key": "e4brl",
      "text": "Enter today's itinary",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "data": {}
    }

  ]
};

export default class ItinaryEditor extends Component {

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
            plugins={[autosavePlugin]}
            ref={(element) => {
              this.editor = element;
            }}
          />

          <SavingComponent />

        </div>
      </div>
    );
  }
}
