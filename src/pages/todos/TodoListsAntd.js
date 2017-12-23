/**
 * Created by jm on 17/12/19.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createPaginationContainer, graphql } from 'react-relay';
import { Table, Breadcrumb, Row, Col, Button, } from 'antd';

import Filter from '../../components/Filter';
import InfiniteScroll from 'react-infinite-scroller';


const TodoListsAntd = (props) => {
  //console.log(props);
  const onloadMore = () => {
    console.log(props.relay.hasMore(), props.relay.isLoading());
    if (!props.relay.hasMore()) {
      return;
    }
    //if (!props.relay.hasMore() || props.relay.isLoading()) {
    //  return;
    //}

    // Fetch the next 10 feed items
    props.relay.loadMore(10, (e) => {
        console.log('e', e);
      }
    );
  };

  const onRefresh = () => {
    props.relay.refetchConnection(10, (e) => {
      console.log('onRefresh', e);
    });
  };

  const columns = [{
    width: 150,
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => (<a href="#">{text}</a>),
  }, {
    title: '名字',
    dataIndex: 'text',
    key: 'text',
  }, {
    title: '是否完成',
    dataIndex: 'complete',
    key: 'complete',
    render: (text) => (text.toString()),
  }];
  const data2 = props.viewer.todos.edges.map(({node}) => node);
  //console.log(data2);
  //console.log(props.viewer.todos.pageInfo.hasNextPage)
  return (
    <div style={{ width: '100%', height: '100%', display:'flex', flexDirection: 'column'}}>
      <Row style={{ marginBottom: '16px' }}>
        <Col span={5}>
          <Breadcrumb >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={19}>
          <Row gutter={16}>
            <Col offset={18} span={3} style={{textAlign: 'right'}}>
              <Button icon="plus" type="primary">新增</Button>
            </Col>
            <Col span={3} style={{textAlign: 'right'}}>
              <Button icon="download" type="primary">导出</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <div style={{ flex: 1, background: '#fff', padding: '24px 24px 0 24px', display:'flex', flexDirection: 'column'}}>
        {
          //TodoListsAntd <span onClick={onRefresh}>Refresh</span>
        }
        <Filter />
        <div style={{flex: 1}}>
          <div style={{ position: 'relative', width: '100%', height: '100%'}}>
            <div style={{position: 'absolute', top: 0, bottom: 0, left:0, right:0  }}>
              <div style={{width: '100%', height:'100%', overflow:'auto'}}>
                <InfiniteScroll
                  pageStart={0}
                  loadMore={onloadMore}
                  hasMore={props.viewer.todos.pageInfo.hasNextPage}
                  loader={<div className="loader">Loading ...</div>}
                  useWindow={false}
                >
                  <Table
                    columns={columns}
                    dataSource={data2}
                    pagination={false}
                    rowKey={ (record) => (record.id) }
                  />
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
        {
          //<div onClick={onloadMore}>loadMore</div>
        }
      </div>
    </div>
  );
};





export default createPaginationContainer(TodoListsAntd, graphql`
    fragment TodoListsAntd_viewer on User @argumentDefinitions(
      count: {type: Int, defaultValue: 10}
      cursor: {type: String}
    ) {
        id
        todos (
        first: $count
        after: $cursor
        ) @connection(key: "TodoListsPagination_todos") {
            edges {
                node {
                    id
                    text
                    complete
                }
            }
        }
    }`,
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.todos;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, {count, cursor}, fragmentVariables) {
      return {
        count,
        cursor,
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
      };
    },
    query: graphql`
      query TodoListsAntdQuery(
        $count: Int!
        $cursor: String
        ) {
            viewer {
                ...TodoListsAntd_viewer @arguments(count: $count, cursor: $cursor)
            }
        }
    `
  }
);

