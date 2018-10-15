import React, {Component} from 'react';

import Editor from 'draft-js-plugins-editor';

import createToolbarPlugin from 'draft-js-static-toolbar-plugin';

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton,
} from 'draft-js-buttons';

import editorStyles from './editorStyles.less';
import buttonStyles from './buttonStyles.less';
import toolbarStyles from './toolbarStyles.less';

import createMentionPlugin from 'draft-js-mention-plugin';

import Search from "./Plugins/Search";

import actorComponent from './Plugins/Actor/Component';
import ActorEntry from './Plugins/Actor/Entry';

export default class CustomMentionEditor extends Component {

  actorSearch = (Search('/api/real/content', (data) => {
    this.setState({
      actors: [
        {name: "ABC"},
        {name: "DEF"}
      ],
    });
  }));

  constructor(props) {
    super(props);

    this.toolbarPlugin = createToolbarPlugin({

      theme: {buttonStyles, toolbarStyles},

      structure: [
        BoldButton,
        ItalicButton,
        UnderlineButton,
        UnorderedListButton,
        OrderedListButton,
      ]
    });

    this.actorPlugin = createMentionPlugin(
      {
        mentionTrigger: '@A',
        mentionComponent: actorComponent,
      }
    );

  }

  state = {
    actors : [],
  };

  focus = () => {
    this.editor.focus();
  };

  render() {

    const {editorState, onChange,  readOnly} = this.props;
    const {  actors } = this.state;

    const ActorSuggestions = this.actorPlugin.MentionSuggestions;

    const {Toolbar} = this.toolbarPlugin;

    return (

      <div>


        <div className={editorStyles.editor} onClick={this.focus}>

          <Editor
            editorState={editorState}
            onChange={onChange}
            plugins={[ this.actorPlugin ]}
            ref={(element) => {
              this.editor = element;
            }}
          />


        </div>
      </div>
    );
  }
}
