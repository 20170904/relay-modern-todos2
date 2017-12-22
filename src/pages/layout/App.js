/**
 * Created by jm on 17/12/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { createFragmentContainer, graphql } from 'react-relay';
import { DatePicker } from 'antd';

const App = (props) => {
  const { children, viewer } = props;
  return (
    <div>
      <span>
        APP <DatePicker />
        {` totalCount ${_.get(viewer, 'totalCount')} `}
        {` completedCount ${_.get(viewer, 'completedCount')} `}
      </span>
      {children}
    </div>
  )
};


export default createFragmentContainer(App, graphql`
    fragment App_viewer on User {
        id
        totalCount
        completedCount
    }
`);
