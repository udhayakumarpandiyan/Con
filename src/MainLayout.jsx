import React, { Fragment } from "react";
import { Redirect } from 'react-router-dom';
import AsyncComponent from './AsyncComponent';
// import { ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
const Header = AsyncComponent(() => import('./components/header/Header').then(module => module.default));
const SideBar = AsyncComponent(() => import('./components/sideBar/SideBar').then(module => module.default));
const MainLayout = (props) => (

  <Fragment>
    {/* {localStorage.getItem('userId') ? ( */}
    <Fragment>
      <Header {...props.children?.props} />
      <div className='body-container'>
        <SideBar />
        <div className='body-widgets'>
          {props.children}
          {/* <ToastContainer
          transition='slide'
          /> */}
        </div>
      </div>
    </Fragment>
    {/* ) : (
        <Redirect to="/login" />
      )
      } */}
  </Fragment>
);

export { MainLayout };
