import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation MarkAllTodosMutation($input: MarkAllTodosInput!, $status: String!) {
    markAllTodos(input: $input) {
      viewer {
        id
        todos(status: $status) {
            edges {
                node {
                    id
                    complete
                    text
                }
            }
        }
        completedCount
      }
      changedTodos {
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
        complete: input.complete,
        clientMutationId
      },
      status: input.status
    },

    updater(store) {
      const {status} = input;
      const payload = store.getRootField('markAllTodos');
      //const changedTodos = payload.getLinkedRecords('changedTodos');//注意区别getLinkedRecords和getLinkedRecord
      //console.log(changedTodos);
      const allNewTodos = payload.getLinkedRecord('viewer').getLinkedRecord('todos', { status }).getLinkedRecords('edges');//注意必须加上status
      const viewerProxy = store.get(viewerId);
      const connection = ConnectionHandler.getConnection(viewerProxy, 'TodoList_todos', {status});//注意必须加上status
      if (connection) {
        connection.setLinkedRecords(allNewTodos, 'edges');
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
