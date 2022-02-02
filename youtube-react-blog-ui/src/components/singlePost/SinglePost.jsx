import {Link, useLocation} from "react-router-dom";
import "./singlePost.css";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Context} from "../../context/Context";

export default function SinglePost() {
  const PF = 'http://localhost:5000/images/'

  const location = useLocation()
  const path = location.pathname.split('/')[2]
  const [post, setPost] = useState({})
  const {user} = useContext(Context)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [updateMode, setUpdateMode] = useState(false)

  const handleDelete = async e => {
    e.preventDefault()
    try {
      await axios.delete(`/posts/${post._id}`, {data: {
        username: user.username
      }})//Такая запись, отправляет данные сразу же.
      window.location.replace('/')
    } catch (e) {
      console.log(e)
    }
  }

  const handleUpdate = async e => {
     try {
       await axios.put(`/posts/${post._id}`, {

           username: user.username,
           title,
           desc

       })
       window.location.reload()
     } catch (e) {
       console.log(e)
     }
  }

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get('/posts/' + path)
      setPost(res.data)
      setTitle(res.data.title)
      setDesc(res.data.desc)
    }
    getPost()
  }, [path])

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && (
            <img
                className="singlePostImg"
                src={PF + post.photo}
                alt=""
            />
        )}
        {updateMode ? <input onChange={e => setTitle(e.target.value)} autoFocus className='singlePostTitleInput' type="text" value={title}/> : (
            <h1 className="singlePostTitle">
              {title}
              {post.username === user?.username && (
                  <div className="singlePostEdit">
                    <i onClick={() => setUpdateMode(true)} className="singlePostIcon far fa-edit"></i>
                    <i className="singlePostIcon far fa-trash-alt" onClick={handleDelete}></i>
                  </div>
              )}
            </h1>
        )}
        <div className="singlePostInfo">
          <span>
            Author:
            <b className="singlePostAuthor">
              <Link className="link" to={`/?user=${post.username}`}>
                {post.username}
              </Link>
            </b>
          </span>
          <span>{new Date(post.createdAt).toDateString()}</span>
        </div>
        {
          updateMode ? (
              <textarea onChange={e => setDesc(e.target.value)} value={desc} className='singlePostDescInput' />
          ) : (
              <p className="singlePostDesc">
                {desc}
              </p>
          )
        }
        {
          updateMode && <button onClick={handleUpdate} className='singlePostBtn'>Update</button>
        }
      </div>
    </div>
  );
}
