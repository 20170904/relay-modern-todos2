/**
 * Created by jm on 17/12/19.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import Todo from './Todo';

const TodoListLoadMore = (props) => {
  const onLoadMore = () => {
    // Increments the number of stories being rendered by 10.
    const refetchVariables = (fragmentVariables) => {
      console.log(fragmentVariables);
      return {
        ...fragmentVariables,
        count: 5,
      }
    };
    props.relay.refetch(refetchVariables);
  };

  return (
    <div>
      TodoListLoadMore
      {
        props.viewer.todos.edges.map(({node}) => <Todo key={node.id} todo={node} />)
      }
      <div onClick={onLoadMore}>Load More</div>
    </div>
  );
};





export default createRefetchContainer(TodoListLoadMore, graphql`
  fragment TodoListLoadMore_viewer on User @argumentDefinitions(
    count: {type: Int, defaultValue: 1},  # Optional argument
  ) {
      id
      todos(
        first: $count
      )  @connection(key: "TodoListLoadMore_todos") {
          edges {
              node {
                  id
                  ...Todo_todo #from Todo.js
              }
          }
      }
  }`,
    graphql`
      query TodoListLoadMoreQuery ($count: Int) {
          viewer {
              ...TodoListLoadMore_viewer @arguments(count: $count)
          }
      }
  `,
);

