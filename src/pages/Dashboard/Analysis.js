import React, { Component } from 'react';
import { connect } from 'dva';
import MapHolder from "../../components/Map/MapHolder";

import '../../../node_modules/react-16-material-floating-button/mfb.css';

import MFB from 'react-mfb';

console.log(MFB);

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  constructor(props) {
    super(props);
  }

  state = {
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


  // /*<MapHolder images={this.props.chart.images3dArray}/>
  render() {

    var effect = 'zoomin',
      pos = 'br',
      method = 'hover';

    return (
      <div>

        <MFB.Menu effect={effect} method={method} position={pos}>
          <MFB.MainButton iconResting="ion-plus-round" iconActive="ion-close-round" />
          <MFB.ChildButton
            onClick={function(e){ console.log(e); e.preventDefault(); }}
            icon="ion-social-github"
            label="View on Github"
            href="https://github.com/nobitagit/react-material-floating-button/" />
          <MFB.ChildButton
            icon="ion-social-octocat"
            label="Follow me on Github"
            href="https://github.com/nobitagit" />
          <MFB.ChildButton
            icon="ion-social-twitter"
            label="Share on Twitter"
            href="http://twitter.com/share?text=Amazing Google Inbox style material floating menu as a React component!&url=http://nobitagit.github.io/react-material-floating-button/&hashtags=material,menu,reactjs,react,component" />
        </MFB.Menu>

        <MapHolder images={this.props.chart.images3dArray}/>
      </div>
    )

  }
}

export default Analysis;
