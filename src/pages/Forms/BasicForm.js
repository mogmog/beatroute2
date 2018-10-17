import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import { Row, Col, Divider  } from 'antd';

import { Tabs, Radio, Button } from 'antd';
import {connect} from "dva/index";
import StoryMenu from "../../components/Story/StoryMenu";
import StoryTabs from "../../components/Story/StoryTabs";

const TabPane = Tabs.TabPane;

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;


@connect((namespaces) => {

  return {
    story: namespaces.story,
  }
})

class SiderDemo extends React.Component {
  state = {
    collapsed: false,
    selectedStory : null
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'story/fetchall',
      payload: { }
    });
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

  selectStory = (story) => {
    this.setState({"selectedStory" : story});
  }

  render() {

    const { story  } = this.props;
    const {selectedStory} = this.state;

    return (
      <Layout style={{ minHeight: '100vh', "background" : "none" }}   >
        <Sider
          theme={"light"}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />

          <StoryMenu selectStory={this.selectStory} list={story.list}/>

        </Sider>
        <Layout    style={{"background" : "none"}}>

          {selectedStory && (<div>
            <Content style={{margin: '16px 16px', flex: 'none'}}>

              <div style={{padding: 24, background: '#fff', minHeight: 100}}>
                {selectedStory && <h1>{selectedStory.title}</h1>}
              </div>

            </Content>

            <Content style={{margin: '16px 16px'}}>

              <div style={{padding: 24, background: '#fff', minHeight: 100}}>
                <StoryTabs selectedStory={selectedStory}/>
              </div>

            </Content>
          </div>)}

        </Layout>
      </Layout>
    );
  }
}
export default SiderDemo;
