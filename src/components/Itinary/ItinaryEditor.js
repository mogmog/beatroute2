import React, {Component} from 'react';
import {Divider} from 'antd';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js'

import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import createMentionPlugin from 'draft-js-mention-plugin';
import createAutosavePlugin from '@jimmycode/draft-js-autosave-plugin';
import Editor from 'draft-js-plugins-editor';

import gif from './Gif/plugin';

import emojiStyles from './emojiStyles.less';

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton,
} from 'draft-js-buttons';

import Search from "./Search";
import battleComponent from './Plugins/Battle/Component';
import BattleEntry from './Plugins/Battle/Entry';

import editorStyles from './editorStyles.less';
import buttonStyles from './buttonStyles.less';
import toolbarStyles from './toolbarStyles.less';

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

//   battleSearchXHR = (Search('/api/real/content', (data) => {
//     this.setState({
//       battles: [{'name' : 'July'}]
//     });
//   }));
//
//   battleSearch = () => {
//     return () => {
//       this.setState({
//         battles: [{'name' : 'July'}]
//       });
//     }
// }

  constructor(props) {
    super(props);

    this.mySaveFunction = (editorState) => {

      console.log( ( convertToRaw( editorState.getCurrentContent()) ));

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

    this.battlePlugin = createMentionPlugin(
      {
        mentionTrigger: '@B',
        mentionComponent: battleComponent(this.props.showImage),
      }
    );

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

  }

  state = {
    battles : [{latitude : 25.06334876641631, longitude : 121.6330941952765, name : 'The Pass', url : "https://picsum.photos/75/75/?image=1051" }, {latitude : 25.06134876641631, longitude : 121.6320941952765, name : 'Wondferful Roman Early Church', url : "https://picsum.photos/75/75/?image=1052"}],
    editorState: EditorState.createWithContent(this.props.editorState || convertFromRaw(raw )),
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

    const { editorState, saving, battles } = this.state;
    const {Toolbar} = this.toolbarPlugin;

    const BattleSuggestions  = this.battlePlugin.MentionSuggestions;

    return (

      <div>

        <div onClick={this.focus}>

          <Divider/>

          <Editor
            readOnly={false}
            editorState={editorState}
            onChange={this.onChange}
            plugins={[this.autosavePlugin, this.toolbarPlugin, this.battlePlugin ]}
            ref={(element) => {
              this.editor = element;
            }}
          />

          <BattleSuggestions
            key={8}
            entryComponent={BattleEntry}
            onSearchChange={()=> {}}
            suggestions={battles}
            XonClose={() => this.setState({battles: []})}
          />

          {saving && <span>Saving</span>}

        </div>
      </div>
    );
  }
}
