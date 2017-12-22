import { commitMutation, graphql } from 'react-relay';

/**
 * renameTodo
 *
 */

const mutation = graphql`
  mutation RenameTodoMutation($input: RenameTodoInput!) {
    renameTodo(input: $input) {
      todo {
        id
        text
      }
    }
  }
`;

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
    //updater(store) {
    //
    //  const payload = store.getRootField('renameTodo');
    //  const changedTodo = payload.getLinkedRecord('todo');
    //
    //  const status = changedTodo.getValue('complete') ? 'active' : 'completed';
    //  const viewerProxy = store.get(viewerId);
    //  const connection = ConnectionHandler.getConnection(viewerProxy, 'TodoList_todos', {status});//注意必须加上status
    //  if (connection) {
    //    ConnectionHandler.deleteNode(connection, changedTodo.getValue('id'));
    //  }
    //},
    optimisticResponse: {
      renameTodo: {
        todo: input,
      },
    },

  });
}

export default { commit };
