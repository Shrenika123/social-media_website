import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Component/Posts/Post'
import { db, auth } from './until/firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Input } from '@material-ui/core';
import ImageUpload from './Component/ImageUpload/ImageUpload'
import InstagramEmbed from 'react-instagram-embed'



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles()
  const [posts, setPosts] = useState([])
  const [toggle, setToggle] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [signin, setSignIn] = useState(false)

  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser)
        setUser(authUser)
      }
      else
        setUser(null)
    })
    return (() => {
      unsubscribe()
    })

  }, [user])

  useEffect(() => {
    db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot => {
      setPosts(snapshot.docs.map((doc) => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [posts])

  // const handleClose=()=>{
  //   setToggle(!toggle)
  // }

  const handleSignIn = (e) => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(email, password).catch((e) => alert(e.message))
    setSignIn(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password).then((authUser) => {
      console.log(authUser)
      // alert(authUser)
      return authUser.user.updateProfile({
        displayName: username
      })
    }).catch((e) => {
      alert(e)
    })
    setToggle(false)
  }
  return (
    <div className="app">



      <Modal
        open={toggle}
        onClose={() => setToggle(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>

          <form className="app_form">
            <center>

              <img alt="Instagram" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" srcset="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png 2x" />
            </center>

            <Input
              type="text"
              value={username}
              placeholder="username"

              onChange={(e) => setUsername(e.target.value)} />
            <Input
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={handleSubmit}>Sign Up </Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={signin}
        onClose={() => setSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>

          <form className="app_form">
            <center>

              <img alt="Instagram" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" srcset="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png 2x" />
            </center>


            <Input
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={handleSignIn}>Sign In </Button>
          </form>
        </div>
      </Modal>
      {/* <Button onClick={() => setToggle(true)}>Sign Up </Button> */}
      <div className="app_header" >
        <img alt="Instagram" class="s4Iyt" className="InstaImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" srcset="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png 2x" />
        {user ? (<div><Button className="button_auth" onClick={() => auth.signOut()}>Logout</Button></div>) : (
          <div>
            <Button className="button_auth" onClick={() => setToggle(true)}>Sign Up</Button>
            <Button className="button_auth" onClick={() => setSignIn(true)}>Sign In</Button>
          </div>
        )}
      </div>

      <div className="posts">
        <div className="post_left">
        {
          posts.map(({ id, post }) => {
            return (<Post
              key={id}
              postId={id}
              user={user}
              image={post.image}
              caption={post.caption}
              username={post.username}
            />)
          })
        }
        </div>
        <div className="post_right">
        <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => { }}
          onSuccess={() => { }}
          onAfterRender={() => { }}
          onFailure={() => { }}
        />
      </div>
      </div>
      {user?.displayName ?
        <ImageUpload username={user.displayName} /> : (<h5>Please login to upload</h5>)

      }
    </div>
  );
}

export default App;
