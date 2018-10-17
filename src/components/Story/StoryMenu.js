import React, { Component } from 'react';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';

export default class StoryMenu extends Component {

  constructor() {
    super();
  }

  render() {

    const { list, selectStory } = this.props;

    return (
      <Menu defaultSelectedKeys={['0']} mode="inline" theme={"light"}>
        { list.map((item, i) => <Menu.Item key={i} onClick={() => {selectStory(item)}}> {item.title}</Menu.Item>)}
      </Menu>
      )
    ;
  }
}


