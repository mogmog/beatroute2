import React, { Component } from 'react';
import { connect } from 'dva';
import MapHolder from "../../components/Map/MapHolder";
import CardHolder from "../../components/Cards/CardHolder";

import '../../../node_modules/react-16-material-floating-button/mfb.css';

import MFB from 'react-mfb';

import { Carousel } from 'antd';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    image : null
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  showImage(e) {
    this.setState({image : e});
  }

  // /*<MapHolder images={this.props.chart.images3dArray}/>
  render() {

    var effect = 'zoomin',
      pos = 'bl',
      method = 'click';

    return (
      <div>

        <MFB.Menu effect={effect} method={method} position={pos}>
          <MFB.MainButton iconResting="ion-plus-round" iconActive="ion-close-round" />

          <MFB.ChildButton
            icon="ion-social-twitter"
            label="Next"
          />

          <MFB.ChildButton
            icon="ion-social-github"
            label="Previous"
             />

        </MFB.Menu>

        <CardHolder showImage={this.showImage.bind(this)}></CardHolder>
        <pre> test {JSON.stringify(this.state.image)} </pre>
        <MapHolder image={this.state.image} images={this.props.chart.images3dArray}/>
      </div>
    )

  }
}

export default Analysis;
