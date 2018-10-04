import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';
import MapHolder from "../../../components/Map/MapHolder";

@connect(({ loading, user, project }) => ({
  currentUser: user.currentUser,
  project,
}))
class Center extends PureComponent {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
  };

  render() {

    return (
      <GridContent className={styles.userCenter}>
        <MapHolder/>
      </GridContent>
    );
  }
}

export default Center;
