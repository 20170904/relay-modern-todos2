import React from 'react';
import ReactDOM from 'react-dom';
import {installRelayDevTools} from 'relay-devtools';

import BrowserProtocol from 'farce/lib/BrowserProtocol';
import queryMiddleware from 'farce/lib/queryMiddleware';
import createFarceRouter from 'found/lib/createFarceRouter';
import createRender from 'found/lib/createRender';
import { Resolver } from 'found-relay';
import environment from './environment.js'
import routes from './routes.js';
import './themes/index.less';


//if(process.env.NODE_ENV !== 'production'){
  // Useful for debugging, but remember to remove for a production deploy.
  //installRelayDevTools();
//}


const Router = createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig: routes,
  render: createRender({}),
});


ReactDOM.render(
  <Router resolver={new Resolver(environment)} />,
  document.getElementById('root')
);
