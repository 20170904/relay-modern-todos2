import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
    mutation AddTodoMutation($input: AddTodoInput!) {
        addTodo(input: $input) {
            viewer {
                id
                totalCount
            }
            todoEdge {
                node {
                    id
                    complete
                    text
                }
            }
        }
    }
`;

function sharedUpdater(store, user, todoEdge) {
  const userProxy = store.get(user.id);

  ['any', 'active'].forEach((status) => {
    const connection = ConnectionHandler.getConnection(
      userProxy, 'TodoList_todos', { status },
    );
    if (connection) {
      ConnectionHandler.insertEdgeAfter(connection, todoEdge);
    }
  });
}

let nextClientMutationId = 0;

function commit(environment, viewerId, input) {
  const clientMutationId = nextClientMutationId++;

  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId//必须加上该参数,否则多次添加会覆盖最后一条数据
      },
    },
    onCompleted: (response) => {console.log(response)},
    onError: (error) => {console.error(error)},
    updater(store) {
      //const payload = store.getRootField('addTodo');
      //sharedUpdater(store, user, payload.getLinkedRecord('todoEdge'));
      //
      const payload = store.getRootField('addTodo');
      const newTodoEdge = payload.getLinkedRecord('todoEdge');
      const viewerProxy = store.get(viewerId);
      const connection = ConnectionHandler.getConnection(viewerProxy, 'TodoList_todos', {status: 'any'});//注意必须加上status
      ConnectionHandler.insertEdgeAfter(connection, newTodoEdge);
    },

    optimisticUpdater(store) {
      const id = `client:addTodo:Todo:${clientMutationId}`;
      const todo = store.create(id, 'Todo');
      const {text} = input;
      todo.setValue(text, 'text');
      todo.setValue(id, 'id');

      const newTodoEdge = store.create(
        `client:addTodo:TodoEdge:${clientMutationId}`, 'TodoEdge',
      );
      newTodoEdge.setLinkedRecord(todo, 'node');

      const viewerProxy = store.get(viewerId);
      const connection = ConnectionHandler.getConnection(viewerProxy, 'TodoList_todos', {status: 'any'});//注意必须加上status
      ConnectionHandler.insertEdgeAfter(connection, newTodoEdge);

      const numTodos = viewerProxy.getValue('numTodos');
      if (numTodos != null) {
        viewerProxy.setValue(numTodos + 1, 'numTodos');
      }
    },
  });
}

export default { commit };
