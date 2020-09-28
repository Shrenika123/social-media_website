import React, { useState, useEffect } from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar';
import { db, auth } from '../../until/firebase'
import { Button } from '@material-ui/core'
import firebase from 'firebase'

const Post = ({ postId,user, image, caption, username }) => {
    const [comment, setComment] = useState('')
    const [comments,setComments]=useState([])

    useEffect(() => {
        let unsubscribe
        if (postId) {
            db.collection('posts')
                .doc(postId).collection('comments').orderBy("timestamp", "desc").onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }
        return (() =>
            unsubscribe())
    }, [postId])


    const postComment = (e) => {
        e.preventDefault()
        db.collection('posts').doc(postId).collection('comments').add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className="post">
            <div className="post_header">
                <Avatar
                    className="post_Avatar"
                    alt={username}
                    src="1.png" />
                <h3>{username}</h3>
            </div>
            {/* <img src="https://pbs.twimg.com/profile_images/730612231021322240/Rl0_QYhL_400x400.jpg"/> */}
            <img className="post_img" src={image} />
            <h4 className="post-text"><strong>{username} </strong>{caption}</h4>
            <div>
            {
                comments.map((comments)=>{
                    return(
                        <p className="comments_post"><strong>{comments.username} </strong>{comments.text}</p>
                   )
                })
                
            }
            </div>
            <form className="postcomment">
                <input className="comment_input" value={comment} placeholder="add comment" type="text" onChange={(e) => setComment(e.target.value)} />
                <Button className="submit_input" type="submit"
                    onClick={postComment}
                    disabled={!comment}
                    type="submit"
                >

                    Post
               </Button>
            </form>
        </div>
    )
}



export default Post