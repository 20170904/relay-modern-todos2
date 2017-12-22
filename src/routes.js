import makeRouteConfig from 'found/lib/makeRouteConfig';
import Route from 'found/lib/Route';
import React from 'react';
import { graphql } from 'react-relay';

import TodoList from './pages/todos/TodoList';
import TodoListLoadMore from './pages/todos/TodoListLoadMore';
import TodoListsLatest from './pages/todos/TodoListsLatest';
import TodoListsPagination from './pages/todos/TodoListsPagination';
import TodoListsAntd from './pages/todos/TodoListsAntd';
import TodoListsAntd2 from './pages/todos/TodoListsAntd2';
import Form from './pages/todos/Form';
import App from './pages/layout/App';

const AppQuery = graphql`
    query routes_App_Query {
        viewer {
            ...App_viewer
        }
    }
`;

const TodoListQuery = graphql`
    query routes_TodoList_Query ($status: String!) {
        viewer {
            ...TodoList_viewer
        }
    }
`;

const TodoListLoadMoreQuery = graphql`
    query routes_TodoListLoadMore_Query ($count: Int) {
        viewer {
            ...TodoListLoadMore_viewer @arguments(count: $count)
        }
    }
`;
const TodoListLoadMoreQuery2 = graphql`
    query routes_TodoListLoadMore_Query{
        viewer {
            ...TodoListLoadMore_viewer
        }
    }
`;

const TodoListsLatestQuery = graphql`
    query routes_TodoListsLatest_Query {
        viewer {
            ...TodoListsLatest_viewer
        }
    }
`;
const TodoListsPaginationQuery = graphql`
    query routes_TodoListsPagination_Query {
        viewer {
            ...TodoListsPagination_viewer
        }
    }
`;
const TodoListsAntdQuery = graphql`
    query routes_TodoListsAntd_Query {
        viewer {
            ...TodoListsAntd_viewer
        }
    }
`;

export default makeRouteConfig(
  <Route
    path="/"
    Component={App}
    query={AppQuery}
  >

    {
      /*
       <Route
       Component={TodoListsPagination}
       query={TodoListsPaginationQuery}
       />
      */
    }
    {
       <Route
         path="/form"
         Component={Form}
       />
    }
    {
       <Route
         path="/antd"
         Component={TodoListsAntd}
         query={TodoListsAntdQuery}
       />
    }
    {
       <Route
         path="/antd2"
         Component={TodoListsAntd2}
         query={TodoListsAntdQuery}
       />
    }
    {
      /*
      <Route
        Component={TodoListsLatest}
        query={TodoListsLatestQuery}
      />
      */
    }
    {
      /*
      <Route
        Component={TodoListLoadMore}
        query={TodoListLoadMoreQuery2}
      />
      */
      /*
      <Route
        Component={TodoListLoadMore}
        query={TodoListLoadMoreQuery}
        prepareVariables={params => ({ ...params, count: 1 })}
      />
      */
    }
    {
      <Route
        Component={TodoList}
        query={TodoListQuery}
        prepareVariables={params => ({ ...params, status: 'any' })}
      />

    }
    {
      /*
      <Route
        path=":status"
        Component={TodoList}
        query={TodoListQuery}
      />
      */
    }



  </Route>
);

