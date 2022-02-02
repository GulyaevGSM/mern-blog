import "./settings.css";
import Sidebar from "../../components/sidebar/Sidebar";
import {useContext, useState} from "react";
import {Context} from "../../context/Context";
import axios from "axios";

export default function Settings() {
  const [file, setFile] = useState(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)


  const {user, dispatch} = useContext(Context)
  const PF = 'http://localhost:5000/images/'

  const handleSubmit = async e => {
    e.preventDefault()
    dispatch({type: 'UPDATE_START'})
    const updatedUser = {
      userId: user._id,
      username,
      email,
      password
    }
    if(file) {
      const data = new FormData()
      const filename = Date.now() + file.name
      data.append("name", filename)
      data.append("file", file)
      updatedUser.profilePic = filename
      try {
        await axios.post('/upload', data)
      } catch (e) {
        console.log(e)
      }
    }
    try {
      const res = await axios.put(`/users/${user._id}`, updatedUser)
      setSuccess(true)
      dispatch({type: 'UPDATE_SUCCESS', payload: res.data})
    } catch (e) {
      dispatch({type: 'UPDATE_FAILURE'})
    }
  }

  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsTitleUpdate">Update Your Account</span>
          <span className="settingsTitleDelete">Delete Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              src={file ? URL.createObjectURL(file) : PF+user.profilePic}
              alt=""
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle"></i>{" "}
            </label>
            <input
                onChange={e => setFile(e.target.files[0])}
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              className="settingsPPInput"
            />
          </div>
          <label>Username</label>
          <input onChange={e => setUsername(e.target.value)} type="text" placeholder={user.username} name="name" />
          <label>Email</label>
          <input onChange={e => setEmail(e.target.value)} type="email" placeholder={user.email} name="email" />
          <label>Password</label>
          <input onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" name="password" />
          <button className="settingsSubmitButton" type="submit">
            Update
          </button>
          {
            success && <span style={{color: 'green'}}>Profile has been updated</span>
          }
        </form>
      </div>
      <Sidebar />
    </div>
  );
}
