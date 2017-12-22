/**
 * Created by jm on 17/12/19.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import ChangeTodoStatusMutation from './mutations/ChangeTodoStatusMutation';
import RenameTodoMutation from './mutations/RenameTodoMutation';
import RemoveTodoMutation from './mutations/RemoveTodoMutation';

const Todo = (props) => {
  const onToggleTodoStatus = () => {
    const { relay, viewer, todo } = props;
    //console.log(viewer)
    const complete = !todo.complete;
    const input = {
      id: todo.id,
      complete,
    };
    ChangeTodoStatusMutation.commit(relay.environment, viewer.id, input);
  };

  const onDelete = () => {
    const { relay, viewer, todo } = props;
    const input = {
      id: todo.id,
      complete: todo.complete,
    };
    RemoveTodoMutation.commit(relay.environment, viewer.id, input);
  };

  const onRenameTodo = () => {
    const { relay, viewer, todo } = props;
    //console.log(viewer)
    var value = prompt('输入新的文字：', todo.text);
    if(value == null){
      alert('你取消了输入！');
    }else if(value == ''){
      alert('姓名输入为空，请重新输入！');
      onRenameTodo();
    }else{
      const input = {
        id: todo.id,
        text: value,
      };
      RenameTodoMutation.commit(relay.environment, viewer.id, input);
    }
  };
  return (
    <div>
      Todo {JSON.stringify(props.todo)}
      &nbsp;<span onClick={onToggleTodoStatus}>toggle</span>
      &nbsp;<span onClick={onRenameTodo}>rename</span>
      &nbsp;<span onClick={onDelete}>delete</span>
    </div>
  );
};


export default createFragmentContainer(Todo, graphql`
    fragment Todo_viewer on User {
        id
    }
    fragment Todo_todo on Todo {
        id
        text
        complete
    }`
);


//export default createFragmentContainer(Todo, {
//  viewer: graphql`
//      fragment Todo_viewer on User {
//          id
//      }
//  `,
//  todo: graphql`
//      fragment Todo_todo on Todo {
//          id
//          complete
//          text
//      }
//  `,
//});
