import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation RemoveCompletedTodosMutation($input: RemoveCompletedTodosInput!) {
    removeCompletedTodos(input: $input) {
      viewer {
        totalCount
        completedCount
      }
      deletedTodoIds
    }
  }
`;

function sharedUpdater(store, user, deletedIds) {
  const userProxy = store.get(user.id);

  ['any', 'completed'].forEach((status) => {
    const connection = ConnectionHandler.getConnection(
      userProxy, 'TodoList_todos', { status },
    );
    if (connection) {
      deletedIds.forEach((deletedId) => {
        ConnectionHandler.deleteNode(connection, deletedId);
      });
    }
  });
}

function commit(environment, viewerId, input) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {},
    },

    updater(store) {
      //const payload = store.getRootField('removeCompletedTodos');
      //sharedUpdater(store, user, payload.getValue('deletedIds'));

      const {status} = input;
      const payload = store.getRootField('removeCompletedTodos');
      const deletedTodoIds = payload.getValue('deletedTodoIds');

      const viewerProxy = store.get(viewerId);
      const connection = ConnectionHandler.getConnection(viewerProxy, 'TodoList_todos', {status});//注意必须加上status
      if (connection) {
        deletedTodoIds.forEach(id => {
          ConnectionHandler.deleteNode(connection, id);
        })
      }
    },

    //optimisticUpdater(store) {
    //  const userProxy = store.get(user.id);
    //
    //  let deletedIds;
    //  if (todos && todos.edges) {
    //    deletedIds = todos.edges
    //      .filter(({ node }) => node.complete)
    //      .map(({ node }) => node.id);
    //    sharedUpdater(store, user, deletedIds);
    //  }
    //
    //  const numTodos = userProxy.getValue('numTodos');
    //  if (deletedIds) {
    //    userProxy.setValue(numTodos - deletedIds.length, 'numTodos');
    //  } else {
    //    const numCompletedTodos = userProxy.getValue('numCompletedTodos');
    //    userProxy.setValue(numTodos - numCompletedTodos, 'numTodos');
    //  }
    //
    //  userProxy.setValue(0, 'numCompletedTodos');
    //},
  });
}

export default { commit };
