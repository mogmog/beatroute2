import React, {Component} from 'react';
import {Modal, Row, Col, List, Icon } from 'antd';

const formItemLayout = {
  labelCol: {span: 12},
  wrapperCol: {span: 12},
};

export default class actorComponent extends Component {
  state = {modal: false};

  showModal() {
    this.setState({modal: true});
  }

  render() {

    const {modal} = this.state;
    const {mention} = this.props;

    return (
      <span>

        <Modal getContainer={() => document.getElementById('rowChild14954') || document.body}
               style={{top: '152px', left: '-290px'}} width={800} title={mention.name} visible={modal}
               onCancel={(e) => this.setState({modal: false})} footer={null}>

          <Row>

            <Col span={11}>
              <img alt='' style={{'objectFit': 'cover', 'width': '300px', 'height': '300px'}} src={mention.data.image}/>
            </Col>

            <Col span={13} >

               <List>

                 {mention.data.items.map((e, i) =>
                   <List.Item>

                     <List.Item.Meta title={ <strong> {e.title} </strong> } />
                     <span>{e.value}</span>
                   </List.Item>
                 )}

               </List>

            </Col>
          </Row>

          <p>
              {mention.data.paragraph1}
          </p>

          <p>
              {mention.data.paragraph2}
          </p>

        </Modal>

        <span className={'mention'} onClick={this.showModal.bind(this)}>
              <Icon type={'user'}/>  {mention.name}
        </span>
      </span>
    )
  }
}
