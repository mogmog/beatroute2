import React, {Component} from 'react';
import {Carousel} from 'antd';
import styles from './CardHolder.less';
import CustomMentionEditor from "./DraftJS/CustomComponentMentionEditor";

import Swipeable from 'react-swipeable';

import {Motion, spring} from 'react-motion';

import {EditorState, convertFromRaw, convertToRaw} from 'draft-js'
import ItinaryEditor from "../Itinary/ItinaryEditor";

class CardHolder extends Component {
  constructor(props) {
    super(props);
  }

  state = { cardsUp: false, editorState : (convertFromRaw({"blocks":[{"key":"e4brl","text":"The Pass and Wondferful Roman Early Church ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":8,"key":0},{"offset":13,"length":29,"key":1}],"data":{}}],"entityMap":{"0":{"type":"@Bmention","mutability":"SEGMENTED","data":{"mention":{latitude : 25.06334876641631, longitude : 121.6330941952765, name : 'The Pass', url : "https://picsum.photos/512/512/?image=1051" }}},"1":{"type":"@Bmention","mutability":"SEGMENTED","data":{"mention":{latitude : 25.06134876641631, longitude : 121.6010941952765, "name":"Wondferful Roman Early Church","url":"https://picsum.photos/512/512/?image=1052"}}}}})) };

  componentDidMount() {
    const {dispatch} = this.props;
  }

  componentWillUnmount() {
  }

  swipedDown() {
    alert("down");
    this.setState({cardsUp: false});
  }

  swipedUp() {
    this.setState({cardsUp: true});
  }

  onChange = (editorState) => {
    this.setState({ 'editorState': editorState });
  }

  render() {

    const { cardsUp } = this.state;

    return (
      <div className={styles.roleInfo} >
        <ItinaryEditor showImage={this.props.showImage} editorState={ this.state.editorState } />
      </div>

    );


    return (
      <div className={styles.card}>


                  <Carousel accessibility={false} infinite={false}>



                    <div><h2>Day 2</h2></div>
                    <div><h2>Day 3</h2></div>
                  </Carousel>


      </div>
    )

  }
}

export default CardHolder;
