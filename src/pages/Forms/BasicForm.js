import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import { Row, Col, Divider  } from 'antd';

import { Tabs, Radio, Button } from 'antd';
import LocationDefineMap from "../../components/Map/Admin/LocationDefineMap";
import DescriptionEditor from "../../components/Description/DescriptionEditor";
import ItinaryEditor from "../../components/Itinary/ItinaryEditor";

const TabPane = Tabs.TabPane;

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiderDemo extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh', "background" : "none" }}   >
        <Sider
          theme={"light"}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu defaultSelectedKeys={['1']} mode="inline"    theme={"light"}>

            <Menu.Item key="3">3 Day Jaunt</Menu.Item>
            <Menu.Item key="4">5 Day Adventure</Menu.Item>
            <Menu.Item key="5">28 Day Extreme</Menu.Item>




          </Menu>
        </Sider>
        <Layout    style={{"background" : "none"}}>

          <Menu
            theme={"light"}
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">Trips</Menu.Item>
            <Menu.Item key="2">Config</Menu.Item>
          </Menu>

          <Content style={{ margin: '16px 16px', flex : 'none' }}>

            <div style={{ padding: 24, background: '#fff', minHeight: 100 }}>
              <DescriptionEditor/>
            </div>

          </Content>

          <Content style={{ margin: '16px 16px' }}>

            <div style={{ padding: 24, background: '#fff', minHeight: 100 }}>

            <Tabs defaultActiveKey="1">
              <TabPane tab="Description" key="1">
                Come enjoy the hills of Albania with this short but challenging ride
              </TabPane>

              <TabPane tab="Itinary" key="2">

                <Tabs
                  defaultActiveKey="1"
                  tabPosition={"left"}
                  style={{ height: 600 }}
                >
                  <TabPane tab="Day 1" key="1"> <ItinaryEditor> </ItinaryEditor> </TabPane>
                  <TabPane tab="Day 2" key="2"> <ItinaryEditor> </ItinaryEditor> </TabPane>
                  <TabPane tab="Day 3" key="3"> <ItinaryEditor> </ItinaryEditor> </TabPane>
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

                </Tabs>
              </TabPane>


              <TabPane tab="Location" key="4">
                  <LocationDefineMap />
              </TabPane>

              <TabPane tab="Styling" key="5">
                Define map style here
              </TabPane>

            </Tabs>
            </div>

          </Content>

        </Layout>
      </Layout>
    );
  }
}
export default SiderDemo;
