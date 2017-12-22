/**
 * Created by jm on 17/12/19.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import Todo from './Todo';
import AddTodoMutation from './mutations/AddTodoMutation';
import MarkAllTodosMutation from './mutations/MarkAllTodosMutation';
import RemoveCompletedTodosMutation from './mutations/RemoveCompletedTodosMutation';


const TodoList = (props, context) => {
  //console.log(props);

  const onAddTodo = () => {
    const { relay, viewer } = props;
    const input = {
      text: 'text',
    };
    AddTodoMutation.commit(relay.environment, viewer.id, input);
  };

  //onToggleAllChange = (e) => {
  //  const { relay, viewer } = this.props;
  //  const { variables } = this.context.relay;
  //  const complete = e.target.checked;
  //
  //  MarkAllTodosMutation.commit(
  //    relay.environment, viewer, viewer.todos, complete, variables.status,
  //  );
  //};

  const onMarkAllTodos = () => {
    const { relay, viewer } = props;
    const {totalCount, completedCount} = viewer;
    const { relay: {variables: {status} } } = context;
    const complete = totalCount === completedCount;
    const input = {
      complete: !complete,
      status,
    };
    MarkAllTodosMutation.commit(relay.environment, viewer.id, input);
  };

  const onRemoveCompletedTodos = () => {
    const { relay, viewer } = props;
    const { relay: {variables: {status} } } = context;
    const input = {
      status,
    };
    RemoveCompletedTodosMutation.commit(relay.environment, viewer.id, input);
  };


  return (
    <div>
      <span onClick={onAddTodo}>AddTodo</span>
      &nbsp;<span onClick={onMarkAllTodos}>markAllTodos</span>
      &nbsp;<span onClick={onRemoveCompletedTodos}>removeCompletedTodos</span>
      TodoList
      {
        props.viewer.todos.edges.map(({node}) => <Todo key={node.id} viewer={props.viewer} todo={node} />)
        //注意注意: 凡是Todo里面的props需要在父容器传递
      }
    </div>
  );
};

const contextTypes = {
  relay: PropTypes.shape({
    variables: PropTypes.shape({
      status: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
TodoList.contextTypes = contextTypes;

export default createFragmentContainer(TodoList, graphql`
    fragment TodoList_viewer on User {
        id
        totalCount
        completedCount
        ...Todo_viewer
        todos(
          status: $status
          first: 2147483647
        )  @connection(key: "TodoList_todos") {
            edges {
                node {
                    id
                    ...Todo_todo
                }
            }
        }
    }
`);

