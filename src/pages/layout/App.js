/**
 * Created by jm on 17/12/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { createFragmentContainer, graphql } from 'react-relay';
import styles from './App.less';

import { Layout, Menu, Icon, Breadcrumb } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    collapsed: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });

  }
  render() {
    const {children} = this.props;
    return (
      <Layout
        style={{ height: '100vh',}}
      >
        <Sider
          width={200}
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          style={{ overflow: 'auto', height: '100%', }}
        >
          <div className={styles.logo} />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
          >
            <SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span>User</span></span>}
            >
              <Menu.Item key="1">Tom</Menu.Item>
              <Menu.Item key="2">Bill</Menu.Item>
              <Menu.Item key="3">Alex</Menu.Item>
            </SubMenu>


            <Menu.Item key="4">
              <Icon type="bar-chart" />
              <span className="nav-text">nav 4</span>
            </Menu.Item>
            <Menu.Item key="5">
              <Icon type="cloud-o" />
              <span className="nav-text">nav 5</span>
            </Menu.Item>
            <Menu.Item key="6">
              <Icon type="appstore-o" />
              <span className="nav-text">nav 6</span>
            </Menu.Item>
            <Menu.Item key="7">
              <Icon type="team" />
              <span className="nav-text">nav 7</span>
            </Menu.Item>
            <Menu.Item key="8">
              <Icon type="shop" />
              <span className="nav-text">nav 8</span>
            </Menu.Item>
            <Menu.Item key="9">
              <Icon type="team" />
              <span className="nav-text">nav 9</span>
            </Menu.Item>
            <Menu.Item key="10">
              <Icon type="shop" />
              <span className="nav-text">nav 10</span>
            </Menu.Item>
            <Menu.Item key="11">
              <Icon type="team" />
              <span className="nav-text">nav 11</span>
            </Menu.Item>
            <Menu.Item key="12">
              <Icon type="shop" />
              <span className="nav-text">nav 12</span>
            </Menu.Item>
            <Menu.Item key="13">
              <Icon type="team" />
              <span className="nav-text">nav 13</span>
            </Menu.Item>
            <Menu.Item key="14">
              <Icon type="shop" />
              <span className="nav-text">nav 14</span>
            </Menu.Item>
            <Menu.Item key="15">
              <Icon type="team" />
              <span className="nav-text">nav 15</span>
            </Menu.Item>
            <Menu.Item key="16">
              <Icon type="shop" />
              <span className="nav-text">nav 16</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ height: '100%'}}>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className={styles.trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content style={{ position: 'relative', margin: '16px 16px 0 16px', }}>
            <div style={{position: 'absolute', top: 0, bottom: 0, left:0, right:0 }}>
              {children}
            </div>
          </Content>
          {
             <div style={{ textAlign: 'center' }}>
             Ant Design ©2016 Created by Ant UED
             </div>
          }
        </Layout>
      </Layout>
    );
  }

};

export default createFragmentContainer(App, graphql`
    fragment App_viewer on User {
        id
        totalCount
        completedCount
    }
`);
