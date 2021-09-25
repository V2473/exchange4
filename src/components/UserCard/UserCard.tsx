import 'bootstrap/dist/css/bootstrap.min.css';
import './UserCard.scss';
import { useState, useEffect } from 'react';
import * as actions from "../../redux/actions";
import classnames from 'classnames';
import { User } from '../../types/types';
import { useAppDispatch } from '../../hooks/hooks'
import React from 'react';


interface Props {
  user: User;
  edit?: boolean;
}

const UserCard = (props: Props): JSX.Element => {
  const [user, setUser] = useState({ ...props.user })
  const [editMode, setEditMode] = useState(props.edit)
  const [isEmptyField, setIsEmptyField] = useState(true)

  const dispatch =  useAppDispatch();
  const deleteUser = () => dispatch(actions.deleteUser(user.id))
  const editUser = () => dispatch(actions.editUser(user))
  const createUser = () => dispatch(actions.createUser(user))

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value  }))
  }

  useEffect(() => {
    if( !user.name || !user.surname || !user.desc ) {
      setIsEmptyField(true)
    } else {
      setIsEmptyField(false)
    }
  }, [user])

  useEffect(() => {
    setUser({ ...props.user })
  }, [props.user])


  return (
    <div className={classnames('card', "userCard")}>
      <div className="userCard-avatar">
        {user.avatar ? (
          <div className="userCard-avatar-img"/>
        ) : (
          <div className="userCard-avatar-none" />
        )}
      </div>
      <div className="userCard-id">
        <span className="userCard-id-text">ID: 
          {user ? user.id : ''} 
        </span>

        {user.id ? (
          <>
            {editMode ? (
              <>
                <button onClick={() => {
                  setEditMode(false)
                  setUser({...props.user})
                }}
                  className={classnames('btn', 'btn-outline-info')}
                >CANCEL</button>

                <button onClick={() => {
                  editUser();
                  setEditMode(false)
                  setUser({...props.user})
                }}
                  className={classnames('btn', 'btn-success')}
                  disabled={isEmptyField}
                >SAVE</button>

              <button
                  className={classnames('btn', 'btn-danger')}
                  onClick={deleteUser}>DEL</button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className={classnames('btn', 'btn-outline-warning')}
              >EDIT</button>
            )}
          </>
        ) : (
          <>
            <button onClick={() =>{
            createUser();
            setUser(prev => ({...prev, name: '', surname: '', desc: ''}))
            }}
            className={classnames('btn', 'btn-success')}
            disabled={isEmptyField}
            >CREATE USER</button>
          </>
        )}
      </div>
      <div className="userCard-info">
        {editMode ? (
          <form>
          <label htmlFor="name">
            <span className="userCard-info-name">Name: 
          </span>
            <input
              type='text'
              name='name'
              value={user.name}
              onChange={inputHandler}
              className={classnames('form-control')}
              placeholder='required field'
            ></input>
          </label>
          <br />
          <label htmlFor="surname">
            <span className="userCard-info-surname">Surname: </span>
            <input
              type='text'
              name='surname'
              value={user.surname}
              onChange={inputHandler}
              className={classnames('form-control')}
              placeholder='required field'
            ></input>
          </label>
          <br />
          <label htmlFor="desc">
            <span className="userCard-info-desc">Desc: </span>
            <input
              type='text'
              name='desc'
              value={user.desc}
              onChange={(e) => inputHandler(e)}
              className={classnames('form-control')}
              placeholder='required field'
            ></input>   
          </label>
        </form>
        ) : (
          <form>
          <label htmlFor="name">
            <span className="userCard-info-name">Name: {user.name} 
          </span>
          </label>
          <br />
          <label htmlFor="surname">
            <span className="userCard-info-surname">Surname: {user.surname}  
        </span>
          </label>
          <br />
          <label htmlFor="desc">
            <span className="userCard-info-desc">Desc: {user.desc} 
        </span> 
          </label>
        </form>
        )}
        
      </div>

    </div>
  )
}

export default UserCard;