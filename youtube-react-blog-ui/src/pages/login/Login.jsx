import "./login.css";
import {useContext, useRef, useState} from "react";
import {Context} from "../../context/Context";
import axios from "axios";

export default function Login() {

    const userRef = useRef()
    const passwordRef = useRef()
    const [error, setError] = useState(false)
    const {dispatch, isFetching} = useContext(Context)

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch({type: 'LOGIN_START'})
        try {
            const res = await axios.post('/auth/login', {
                username: userRef.current.value,
                password: passwordRef.current.value
            })
            dispatch({type: 'LOGIN_SUCCESS', payload: res.data})
        } catch (e) {
            dispatch({type: 'LOGIN_FAILURE'})
            setError(true)
        }
    }

  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input ref={userRef} className="loginInput" type="text" placeholder="Enter your username..." />
        <label>Password</label>
        <input ref={passwordRef} className="loginInput" type="password" placeholder="Enter your password..." />
        <button className="loginButton" type={'submit'} disabled={isFetching}>Login</button>
          {
              error && <span style={{color: 'green'}}>Wrong Credentials!</span>
          }
      </form>
        <button className="loginRegisterButton">Register</button>
    </div>
  );
}
