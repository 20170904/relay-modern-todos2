import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation ChangeTodoStatusMutation($input: ChangeTodoStatusInput!) {
    changeTodoStatus(input: $input) {
      viewer {
        id
        completedCount
      }
      todo {
        id
        complete
      }
    }
  }
`;

function sharedUpdater(store, user, todoProxy) {
  // In principle this could add to the active connection, but such an
  // interaction is not possible from the front end.
  const userProxy = store.get(user.id);
  const status = todoProxy.getValue('complete') ? 'active' : 'completed';
  const connection = ConnectionHandler.getConnection(
    userProxy, 'TodoList_todos', { status },
  );
  if (connection) {
    ConnectionHandler.deleteNode(connection, todoProxy.getValue('id'));
  }
}

let nextClientMutationId = 0;

function commit(environment, viewerId, input) {
  const clientMutationId = nextClientMutationId++;

  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId
      },
    },

    updater(store) {
      //const payload = store.getRootField('changeTodoStatus');
      //sharedUpdater(store, user, payload.getLinkedRecord('todo'));

      const payload = store.getRootField('changeTodoStatus');
      const changedTodo = payload.getLinkedRecord('todo');

      const status = changedTodo.getValue('complete') ? 'active' : 'completed';
      const viewerProxy = store.get(viewerId);
      const connection = ConnectionHandler.getConnection(viewerProxy, 'TodoList_todos', {status});//注意必须加上status
      if (connection) {
        ConnectionHandler.deleteNode(connection, changedTodo.getValue('id'));
      }
    },

    //optimisticUpdater(store) {
    //  const todoProxy = store.get(todo.id);
    //  todoProxy.setValue(complete, 'complete');
    //  sharedUpdater(store, user, todoProxy);
    //
    //  const userProxy = store.get(user.id);
    //  const numCompletedTodos = userProxy.getValue('numCompletedTodos');
    //  if (numCompletedTodos != null) {
    //    userProxy.setValue(
    //      numCompletedTodos + (complete ? 1 : -1), 'numCompletedTodos',
    //    );
    //  }
    //},
  });
}

export default { commit };
