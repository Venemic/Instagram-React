import React, {useState, useEffect} from 'react';
import './App.css';
import logo from './logo.png';
import Post from './components/Post';
import { db, auth } from './Firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
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
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setopenSignIn] = useState(false);
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //LOGGED IN
        setUser(authUser);
        if(authUser.displayName){ 
            //dont update username
        }
        else{
            //we just created someone
            return authUser.updateProfile({
              displayName: username,
            }); 
        }
      }
      else
      {
        //LOGGED OUT
        setUser(null);
      }
    })
    return () => {
      //perform clean up action
      unsubscribe();
    }
  },[user, username]);
  useEffect(()=>{
        db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot => {
          setPosts(snapshot.docs.map(doc => ({
            id: doc.id,
            post: doc.data()
          })));
        })
  },[])

  const signup = (event) => {
      event.preventDefault();

      auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
      setOpen(false);
  }
  const signin = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setopenSignIn(false);
}
  return (
    

   <div className="app">
        
       

        <Modal
        open={open}
        onClose={()=> setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
      
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
      <img className="app__header-image" src={logo} alt="logo" width="150px"/>
      <Input placeholder="Name" type="text" value={username} onChange={(e)=> setUsername(e.target.value)}/>
      <Input placeholder="Email" type="email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
      <Input placeholder="Password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
       <Button type="submit" onClick={signup}>Sign Up</Button>
    
      </form>
      </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=> setopenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
      
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
      <img className="app__header-image" src={logo} alt="logo" width="150px"/>
      <Input placeholder="Email" type="email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
      <Input placeholder="Password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
       <Button type="submit" onClick={signin}>Sign In</Button>
    
      </form>
      </div>
      </Modal> 
     <div className="app__header">
        <img className="" src={logo} alt="logo" width="150px"/>
        {user ? <Button onClick={()=> auth.signOut()}>Sign Out</Button>: (<div className="app__loginContainer"><Button onClick={()=> setopenSignIn(true)}>Sign In</Button><Button onClick={()=> setOpen(true)}>Sign Up</Button></div>)}
      
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} user={user}/>
          ))
      }
        </div >
      <div className="app__postsRight">

      <InstagramEmbed
      url='https://instagr.am/p/HLLj2RgURT/'
      clientAccessToken='123|456'
      maxWidth={320}
      hideCaption={false}
      containerTagName='div'
      protocol=''
      injectScript
      onLoading={() => {}}
      onSuccess={() => {}}
      onAfterRender={() => {}}
      onFailure={() => {}}
    />

      </div>

      </div>
      
          

      {user?.displayName ? (
                  <ImageUpload username={user.displayName}/> 
              ):(console.log(''))}
      </div>
  );
}
export default App;
