/**
 * Created by jm on 17/12/19.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import Todo from './Todo';

const TodoListsLatest = (props) => {

  const onRefresh = () => {
    props.relay.refetch();
    //props.relay.refetch(
    //  null,  // Our refetchQuery needs to know the `itemID`
    //  null,  // We can use the refetchVariables as renderVariables
    //  () => { console.log('Refetch done') },
    //  {force: true},  // Assuming we've configured a network layer cache, we want to ensure we fetch the latest data.
    //);
  };

  return (
    <div>
      TodoListLoadMore
      {
        props.viewer.todos.edges.map(({node}) => <Todo key={node.id} todo={node} />)
      }
      <div onClick={onRefresh}>Refresh</div>
    </div>
  );
};





export default createRefetchContainer(TodoListsLatest, graphql`
    fragment TodoListsLatest_viewer on User {
        id
        todos (
          status: "completed"
          first: 2147483647
        ) @connection(key: "TodoListsLatest_todos") {
            edges {
                node {
                    id
                    ...Todo_todo #from Todo.js
                }
            }
        }
    }`,
    graphql`
        query TodoListsLatestQuery {
            viewer {
                ...TodoListsLatest_viewer
            }
        }
  `,
);

