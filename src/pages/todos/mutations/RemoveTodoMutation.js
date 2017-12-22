import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation RemoveTodoMutation($input: RemoveTodoInput!) {
    removeTodo(input: $input) {
      viewer {
        totalCount
        completedCount
      }
      deletedTodoId
    }
  }
`;

function sharedUpdater(store, user, deletedId) {
  const userProxy = store.get(user.id);

  ['any', 'active', 'completed'].forEach((status) => {
    const connection = ConnectionHandler.getConnection(
      userProxy, 'TodoList_todos', { status },
    );
    if (connection) {
      ConnectionHandler.deleteNode(connection, deletedId);
    }
  });
}
let nextClientMutationId = 0;

function commit(environment, viewerId, input) {

  const clientMutationId = nextClientMutationId++;
  const {complete} = input;
  const status = complete ? 'completed' : 'active';
  //console.log(input, viewerId, status);
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        id: input.id,
        clientMutationId,
      }
    },

    updater(store) {
      //const payload = store.getRootField('removeTodo');
      //sharedUpdater(store, user, payload.getValue('deletedId'));


      const payload = store.getRootField('removeTodo');
      const deletedTodoId = payload.getValue('deletedTodoId');//注意是payload.getValue,不是getLinkedRecord(字段是getValue,object是getLinkedRecord,[object]是getLinkedRecords)
      const viewerProxy = store.get(viewerId);

      const connection = ConnectionHandler.getConnection(viewerProxy, 'TodoList_todos', {status: 'any'});//注意必须加上status, 是any
      if (connection) {
        ConnectionHandler.deleteNode(connection, deletedTodoId);
      }
    },

    //optimisticUpdater(store) {
    //  sharedUpdater(store, user, todo.id);
    //
    //  const userProxy = store.get(user.id);
    //  const numTodos = userProxy.getValue('numTodos');
    //  if (numTodos != null) {
    //    userProxy.setValue(numTodos - 1, 'numTodos');
    //  }
    //  const numCompletedTodos = userProxy.getValue('numCompletedTodos');
    //  if (numCompletedTodos != null) {
    //    if (todo.complete != null) {
    //      if (todo.complete) {
    //        userProxy.setValue(numCompletedTodos - 1, 'numCompletedTodos');
    //      }
    //    } else if (numTodos != null) {
    //      // Note this is the old numTodos.
    //      if (numTodos - 1 < numCompletedTodos) {
    //        userProxy.setValue(numTodos - 1, 'numCompletedTodos');
    //      }
    //    }
    //  }
    //},
  });
}

export default { commit };
