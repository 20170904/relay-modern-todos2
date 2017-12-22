/**
 * Created by jm on 17/12/19.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createPaginationContainer, graphql } from 'react-relay';
import Todo from './Todo';

const TodoListsPagination = (props) => {
  //console.log(props);
  const onloadMore = () => {
    console.log(props.relay.hasMore(), props.relay.isLoading());
    if (!props.relay.hasMore() || props.relay.isLoading()) {
      return;
    }

    // Fetch the next 10 feed items
    props.relay.loadMore(1, (e) => {
        console.log('e', e);
      }
    );
  };

  const onRefresh = () => {
    props.relay.refetchConnection(2, (e) => {
      console.log('onRefresh', e);
    });
  };

  return (
    <div>

      TodoListsPagination <span onClick={onRefresh}>Refresh</span>
      {
        props.viewer.todos.edges.map(({node}) => <Todo key={node.id} todo={node} />)
      }
      <div onClick={onloadMore}>loadMore</div>
    </div>
  );
};





export default createPaginationContainer(TodoListsPagination, graphql`
    fragment TodoListsPagination_viewer on User @argumentDefinitions(
      count: {type: Int, defaultValue: 1}
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
                    ...Todo_todo #from Todo.js
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
        query TodoListsPaginationQuery(
          $count: Int!
          $cursor: String
        ) {
            viewer {
                ...TodoListsPagination_viewer @arguments(count: $count, cursor: $cursor)
            }
        }
    `
  }
);

