/**
 * Created by jm on 17/12/19.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createPaginationContainer, graphql } from 'react-relay';
import { List, BackTop } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

//import Todo from './Todo2';
const Todo = (props) => {
  return (
    <div>
      Todo {JSON.stringify(props.todo)}
    </div>
  );
};

const TodoListsAntd2 = (props) => {
  //console.log(props);
  const onloadMore = () => {
    console.log(props.relay.hasMore(), props.relay.isLoading());
    if (!props.relay.hasMore() || props.relay.isLoading()) {
      return;
    }

    // Fetch the next 10 feed items
    props.relay.loadMore(10, (e) => {
        console.log('e', e);
      }
    );
  };

  const onRefresh = () => {
    props.relay.refetchConnection(2, (e) => {
      console.log('onRefresh', e);
    });
  };
  const data2 = props.viewer.todos.edges.map(({node}) => node);
  console.log(data2);

  return (
    <div>

      TodoListsAntd2 <span onClick={onRefresh}>Refresh</span>
      <InfiniteScroll
        pageStart={0}
        loadMore={onloadMore}
        hasMore={props.viewer.todos.pageInfo.hasNextPage}
        loader={<div className="loader">Loading ...</div>}
      >
        <List
          size="large"
          dataSource={data2}
          renderItem={item => (
            <List.Item>
              <Todo key={item.id} viewer={props.viewer} todo={item} />
            </List.Item>
          )}
        />
      </InfiniteScroll>
      <div onClick={onloadMore}>loadMore</div>
      <BackTop />
    </div>
  );
};





export default createPaginationContainer(TodoListsAntd2, graphql`
    fragment TodoListsAntd2_viewer on User @argumentDefinitions(
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
      query TodoListsAntd2Query(
        $count: Int!
        $cursor: String
        ) {
            viewer {
                ...TodoListsAntd2_viewer @arguments(count: $count, cursor: $cursor)
            }
        }
    `
  }
);

