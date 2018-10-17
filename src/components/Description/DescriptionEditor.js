import React, {Component} from 'react';

import {EditorState, convertFromRaw, convertToRaw} from 'draft-js'

import Editor from 'draft-js-plugins-editor';
import createAutosavePlugin from "@jimmycode/draft-js-autosave-plugin/lib/index";

export default class DescriptionEditor extends Component {

  constructor(props) {
    super(props);

    this.mySaveFunction = (editorState) => {

      const updatedStory = this.props.selectedStory;
      updatedStory.description =  convertToRaw(editorState.getCurrentContent());

      console.log(updatedStory);

      this.props.updateStory(updatedStory);

      this.setState({saving : true});

      setTimeout((x) => {
        this.setState({saving : false});
      }, 500)

    };

    const config = {
      saveFunction: this.mySaveFunction,
      debounceTime: 400,
      saveAlways: false
    };


    this.autosavePlugin = createAutosavePlugin(config);

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

  componentDidMount() {
    if (this.props.selectedStory ) {
      this.setState({editorState : EditorState.createWithContent(convertFromRaw(this.props.selectedStory.description))});
    }
  }

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
            plugins={[this.autosavePlugin]}
            ref={(element) => {
              this.editor = element;
            }}
          />

        </div>
      </div>
    );
  }
}
