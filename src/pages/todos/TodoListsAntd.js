/**
 * Created by jm on 17/12/19.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createPaginationContainer, graphql } from 'react-relay';
import { Table, BackTop } from 'antd';
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
    <div>

      TodoListsAntd <span onClick={onRefresh}>Refresh</span>
      <InfiniteScroll
        pageStart={0}
        loadMore={onloadMore}
        hasMore={props.viewer.todos.pageInfo.hasNextPage}
        loader={<div className="loader">Loading ...</div>}

      >
        <Table
          columns={columns}
          dataSource={data2}
          pagination={false}
          rowKey={ (record) => (record.id) }
        />
      </InfiniteScroll>

      <div onClick={onloadMore}>loadMore</div>
      <BackTop />
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

