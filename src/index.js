import React from "react";
import ReactDOM from "react-dom";
/* orch engine */
// import './setupCSP';
import '@patternfly/react-core/dist/styles/base.css';
// import { BrandName } from './variables';
/* orch engine end */
// always import boostrap before App import else own css will override
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap';
import "font-awesome/css/font-awesome.css";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import App from './App.jsx';
import "./main.css";


const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router history={history}>
          {/* <div>
            <SideBar />
            <Header history={history} />
          </div> */}
          <div className='main-body'>
            <div>
              <App history={history} />
            </div>
          </div>
          {/* <div>
            <Footer />
          </div> */}
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
