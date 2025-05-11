import React, { useState, useRef, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import {
  Logo,
  OverlayLoader,
} from '../../components/index';
import fetchConf from '../../fetchConfig';



const useStyles = makeStyles((theme) => ({
  paper: {
    writingDirection: 'rtl',
    // marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    paddingBottom: theme.spacing(0),
    // backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));




export default function Login(
  {
    view,
    setView,
    setOrderPageFun,
    setShowNavFun,
    Modal,
    setShowOverlayLoader,
    setUser
  }) {
  const classes = useStyles();
  const [modalContent, setModalContent] = useState({});
  const [showModal, setShowModal] = useState(false);
  const userNameRef = useRef('');
  const passWordRef = useRef('');
  const { height } = Dimensions.get('window');
  const container_ref = useRef(null);
  const [container_width, setContainerWidth] = useState(0);


  const loginUser = async (WorkerName, PassWord) => {
    const data = {
      WorkerName: WorkerName,
      PassWord: PassWord,
      timeout: 5000
    }
    try {
      // const result = await axios.post('http://192.168.31.159:3000/Login', data)
      const result = await axios.post(`${fetchConf}/Login`, data)
      // console.log(result);
      if (!(result.data == "not found")) {
        if (result.data) {
          setView(false)
          // console.log(view);
          setShowOverlayLoader(false)
          // setOrderPageFun(true)
          setShowNavFun(true);
          setUser(result.data);
          return;
        }
        setModalContent({
          title: "שגיאה",
          content: "פרטי המשתמש שגויים.",
        })
        setShowModal(true);
      } else {
        setModalContent({
          title: "שגיאה",
          content: "לא נמצא משתמש",
        })
        setShowModal(true);
      }
      setShowOverlayLoader(false)
    } catch (e) {
      setShowOverlayLoader(false)
      setModalContent({
        title: "שגיאה",
        content: "בעיה עם משיכת נתוני הלקוח, אנא פנה למנהל האפליקציה",
      })
      setShowModal(true);
      console.log(e);
    }
  }


  useLayoutEffect(() => {
    setContainerWidth(container_ref.current.offsetWidth);
  }, []);

  if (view) {
    return (
      <View
        style={{
          writingDirection: 'rtl',
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '5px',
          BorderColor: 'black',
          width: '80%',
          maxHeight: (height * 0.6),
          boxShadow: 'rgba(100, 100, 111, 0.4) 0px 7px 29px 0px'
        }}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Modal
            show={showModal}
            content={modalContent.content}
            title={modalContent.title}
            buttonText="אישור"
            toggleShowModal={setShowModal}
            speacilFunction={modalContent.speacilFunction}
          >
          </Modal>
          <div ref={container_ref} className={classes.paper}>
            <div className={classes.avatar}>
              <Logo
                parentWidth={container_width}
              />
            </div>
            <Typography component="h1" variant="h5">
              התחבר
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user_name"
                label="שם משתמש"
                name="uset_name"
                autoComplete="user_name"
                autoFocus
                inputRef={userNameRef}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="סיסמא"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={passWordRef}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={(e) => {
                  e.preventDefault();
                  setShowOverlayLoader(true);
                  loginUser(userNameRef.current.value, passWordRef.current.value);
                  // setOrderPageFun(true);
                }}
              >
                התחברות
              </Button>
            </form>
          </div>
        </Container>
      </View>

    );
  }
  else
    return null;
}