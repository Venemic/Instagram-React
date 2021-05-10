import { Button, Input } from '@material-ui/core';
import React, {useState} from 'react';
import {storage, db} from './Firebase';
import './ImageUpload.css';
import firebase from 'firebase';
function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange = (e) =>{
        setImage(e.target.files[0]);
    }
    const handleUpload = () =>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function ....
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) *100
                );
                setProgress(progress);
            },
            (error) =>{
                // error function
                alert(error.message);
            },
            () => {
                //complete function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then (url =>{
                        //post image inside the database
                        db.collection("posts").add({
                            caption: caption,
                            imageUrl: url,
                            username: username,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
            
                        });
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    })
            }
        )
    }
    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress}  max="100"/>
            <Input type="text" placeholder="   Enter a caption..." onChange={event => setCaption(event.target.value) } caption={caption}/>
            <Input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload</Button>
        </div>
        
    )
}

export default ImageUpload
