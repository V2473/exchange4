import 'bootstrap/dist/css/bootstrap.min.css';
import './PaginationWindow.scss';
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { useEffect } from "react";
import * as actions from "../../redux/actions";
import Page from '../Page/Page';
import React from 'react';



function PaginationWindow(): JSX.Element {
  const dispatch =  useAppDispatch();
  const usersList = useAppSelector(state => state.usersList) || [] ;
  const location = useLocation();
  const currentPage = +location.pathname.slice(1);
  const pagesTotal = Math.ceil(usersList.length / 5);
  const currenUsersList = usersList.slice((currentPage - 1) * 5, ((currentPage - 1) * 5) + 5);

  useEffect(() => {
    dispatch(actions.requestUsersList())
  }, []);

  return (
    <>
      <Page
        users={currenUsersList}
        pagesTotal={pagesTotal}
        currentPage={currentPage} 
      />
    </>
  )
}

export default PaginationWindow;