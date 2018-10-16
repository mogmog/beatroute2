import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Admin extends Component {
  constructor(props) {
    super(props);
  }

  state = {
  };

  render() {

    return (
      <div>
       I am a admin
      </div>
    )

  }
}

export default Admin;
