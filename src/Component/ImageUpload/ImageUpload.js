import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import { db, storage } from '../../until/firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({username}) {
    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState(null)
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
        else{alert(e.error.message)}
    }

    const uploadHandle = () => {
        const uploadTast = storage.ref(`/images/${image?.name}`).put(image)
        uploadTast.on("state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setProgress(progress)
            }, (error) => alert(error.message),
            () => {
                storage.ref('images').child(image.name).getDownloadURL()
                .then((url)=>{
                    db.collection('posts').add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        image:url,
                        caption:caption,
                        username:username
                    })
                    setProgress(0)
                    setImage(null)
                    setCaption('')
                })
            })
            
    }
    return (
        <div className="image_upload">
            {/* UserNAme*/}
            {/*Image*/}
            {/* Caption*/}
            <progress className="imageupload__progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a caption" onChange={(e) => setCaption(e.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button className="imageupload__button" onClick={uploadHandle}>
                Uplaod
            </Button>
        </div>

    )
}

export default ImageUpload
