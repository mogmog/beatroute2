import React, { Component } from 'react';

import { Layout, Menu, Breadcrumb, Icon, Tabs, Button, Row, Col, Divider } from 'antd';

import ItinaryEditor from "../../components/Itinary/ItinaryEditor";
import LocationDefineMap from "../../components/Map/Admin/LocationDefineMap";
import DescriptionEditor from "../../components/Description/DescriptionEditor";
import RouteDefineMap from "../Map/Admin/RouteDefineMap";

const TabPane = Tabs.TabPane;

export default class StoryTabs extends Component {

  constructor() {
    super();
  }

  render() {

    const { list, selectedStory, updateStory } = this.props;

    if (!selectedStory) return <span>Select a trip on lhs</span>
    return (

      <Tabs defaultActiveKey="1">
        <TabPane tab="Description" key="1">
          <DescriptionEditor updateStory={updateStory} selectedStory={selectedStory}/>
        </TabPane>

        <TabPane tab="Itinary" key="2">

          <Tabs
            defaultActiveKey="1"
            tabPosition={"left"}
            style={{ height: 600 }}
          >
            <TabPane tab="Day 1" key="1"> <ItinaryEditor> </ItinaryEditor> <RouteDefineMap /> </TabPane>
            <TabPane tab="Day 2" key="2"> <ItinaryEditor> </ItinaryEditor>   </TabPane>
            <TabPane tab="Day 3" key="3"> <ItinaryEditor> </ItinaryEditor>  </TabPane>
            <TabPane tab={ <Button size="small" type="primary" shape="circle" icon="plus" /> } key="4"></TabPane>

          </Tabs>


        </TabPane>


        <TabPane tab="Media" key="3">
          <Tabs
            defaultActiveKey="1"
            tabPosition={"left"}
            style={{ height: 600 }}
          >
            <TabPane tab="Photos" key="1">

              <Row gutter={1}>
                <Col span={6}> <img src="https://picsum.photos/150/150/?image=1056" /> </Col>
                <Col span={6}> <img src="https://picsum.photos/150/150/?image=1057" /> </Col>
                <Col span={6}> <img src="https://picsum.photos/150/150/?image=1052" /> </Col>
                <Col span={6}> <img src="https://picsum.photos/150/150/?image=1051" /> </Col>
              </Row>

              <Row gutter={1}>
                <Col span={32}> <Divider/></Col>
              </Row>

              <Row gutter={1}>
                <Col span={6}> <img src="https://picsum.photos/150/150/?image=1044" /> </Col>
                <Col span={6}> <img src="https://picsum.photos/150/150/?image=1067" /> </Col>
                <Col span={6}> <img src="https://picsum.photos/150/150/?image=1062" /> </Col>
                <Col span={6}>  <Button  type="primary" shape="circle" icon="plus" /> </Col>
              </Row>



            </TabPane>

            <TabPane tab="Videos" key="2"> Videos here </TabPane>
            <TabPane tab="POI" key="3"> Places of interest </TabPane>
            <TabPane tab="Segments" key="4"> Segments</TabPane>

          </Tabs>
        </TabPane>


        <TabPane tab="Location" key="4">
          <LocationDefineMap />
        </TabPane>

        <TabPane tab="Styling" key="5">
          Define map style here
        </TabPane>

      </Tabs>
    )
      ;
  }
}





