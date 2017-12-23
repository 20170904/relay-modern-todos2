/**
 * Created by jm on 17/12/23.
 */
import { Form, Row, Col, Input, Button, Icon } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Filter.less';

const FormItem = Form.Item;
const Search = Input.Search;

class AdvancedSearchForm extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  // To generate mock Form.Item
  getFields() {
    const count = this.state.expand ? 10 : 2;
    const { getFieldDecorator } = this.props.form;
    const children = [(
      <Col key={11} span={8}>
        <FormItem>
          {getFieldDecorator('keywords', {initialValue: ''})(
            <Search placeholder="请输入搜索关键字" onSearch={(e)=>console.log(e)}/>)
          }
        </FormItem>
      </Col>)];
    for (let i = 0; i < 10; i++) {
      children.push(
        <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
          <FormItem label={`Field ${i}`}>
            {getFieldDecorator(`field-${i}`)(
              <Input placeholder="placeholder" />
            )}
          </FormItem>
        </Col>
      );
    }
    return children;
  }

  render() {
    return (
      <Form
        className={styles["ant-advanced-search-form"]}
        onSubmit={this.handleSearch}
      >
        <Row>
          <Col span={22}>
            <Row gutter={24}>{this.getFields()}</Row>
          </Col>
          <Col span={2}>
            <a style={{ fontSize: '14px', height: '32px', lineHeight: '32px' }} onClick={this.toggle}>
              更多 <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);

export default WrappedAdvancedSearchForm;
