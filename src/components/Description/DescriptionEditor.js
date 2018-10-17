import React, {Component} from 'react';

import {EditorState, convertFromRaw, convertToRaw} from 'draft-js'

import Editor from 'draft-js-plugins-editor';

export default class DescriptionEditor extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    editorState : EditorState.createEmpty()
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  componentDidUpdate(prevProps) {
    if (this.props.selectedStory !== prevProps.selectedStory) {
      this.setState({editorState : EditorState.createWithContent(convertFromRaw(this.props.selectedStory.description))});
    }
  }

  render() {

    const {selectedStory} = this.props;


    return (

      <div>

        <div onClick={this.focus}>

          <Editor
            readOnly={false}
            editorState={this.state.editorState}
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
