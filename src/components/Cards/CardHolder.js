import React, {Component} from 'react';
import {Carousel} from 'antd';
import styles from './CardHolder.less';
import CustomMentionEditor from "./DraftJS/CustomComponentMentionEditor";

import Swipeable from 'react-swipeable';

import {Motion, spring} from 'react-motion';

import {EditorState, convertFromRaw, convertToRaw} from 'draft-js'

class CardHolder extends Component {
  constructor(props) {
    super(props);
  }

  state = { cardsUp: false, editorState : EditorState.createWithContent(convertFromRaw({"blocks":[{"key":"aod7o","text":"Day 1 we leave the hotel and begin the trip","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":15,"key":0}],"data":{}}],"entityMap":{"0":{"type":"mention","mutability":"SEGMENTED","data":{"mention":{"name":"Shabazz Suleman","link":"https://twitter.com/mrussell247","avatar":"https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg"}}}}})) };

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
        <CustomMentionEditor onChange={this.onChange.bind(this)} editorState={ this.state.editorState } />
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
