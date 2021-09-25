import 'bootstrap/dist/css/bootstrap.min.css';
import './Page.scss';
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import UserCard from '../UserCard/UserCard';
import classnames from 'classnames';
import { User } from '../../types/types';
import React from 'react';

interface Props {
  users: User[];
  currentPage: number;
  pagesTotal: number;
}

function Page(props: Props): JSX.Element {
  const emptyUser = {
    name: '', surname: '', desc: '', avatar: null, id: undefined,
  }

  return (
    <div className={'page'}>
      <div className={'page-userCards'}>
        <UserCard user={emptyUser} edit={true}></UserCard>
        {props.users.map(user => (
          <UserCard user={user} key={user.id}></UserCard>
        ))}
      </div>
      
      <ul className="pagination">
        {props.currentPage > 1 ? (
          <li className={classnames("page-item")}>
            <Link
              to={'/' + (props.currentPage - 1)}
              className="page-link"
            >Previous </Link>
          </li>
        ) : (
          <li className={classnames("page-item", 'disabled')}>
            <span
              className="page-link"
            >Previous </span>
          </li>
          )
        }

        {[...Array(props.pagesTotal)]
          .map((e, index) => index + 1 === props.currentPage ? (
            <li className={classnames("page-item", 'active')} key={index + 1}>
              <span
                key={index + 1}
                className={classnames("page-link")}
              >{props.currentPage}</span> 
            </li>
            ) : (
            <li className={classnames("page-item")} key={index + 1}>
              <Link
                to={'/' + (index + 1)}
                key={index + 1}
                className="page-link"
              >{index + 1} </Link>
            </li>
            )
          )
        }
        {props.currentPage < props.pagesTotal ? 
        (
          <li className={classnames("page-item")}>
            <Link
              to={'/' + (props.currentPage + 1)}
              className="page-link"
            >Next </Link>
          </li>
        ) : (
          <li className={classnames("page-item", 'disabled')}>
            <span
              className="page-link"
            >Next </span>
          </li>
        ) }
        

      </ul>
    </div>
  )
}

export default Page;