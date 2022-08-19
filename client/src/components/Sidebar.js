import React from 'react';
import { Button, Grid, Container, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PhoneDisabled,MicOff,VideocamOff } from '@material-ui/icons';
// import MicOffIcon from '@mui/icons-material/MicOff';
// import VideocamOffIcon from '@mui/icons-material/VideocamOff';
// import {} from "react-router";
import { Redirect } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    gridContainer: {
        width: '100%',
        flexWrap:"nowrap",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    container: {
        width: '100%',
        margin: '35px 0',
        display: 'flex',
        alignItems:"center",
        justifyContent: 'center',
        padding: 0,
        [theme.breakpoints.down('xs')]: {
            width: '80%',
        },
    },
    // margin: {
    //     margin: 20,
    // },
    padding: {
        padding:20,
    },
    paper: {
        padding: '10px 20px',
        // border: '2px solid black',
        margin: 20,
    },
}));






const Sidebar = (props) => {
    // const navigate = useNavigate();
    const classes = useStyles()

    async function  end(){
        // await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream)=>{
        //     stream = null
        // })
    }
    function mute(){
        console.log(props.stream.getAudioTracks())
        props.stream.getAudioTracks()[0].enabled = !(props.stream.getAudioTracks()[0].enabled);
    }
    function pause(){
        
    }

    return (
        <Container className={classes.container}>
            <Paper elevation={10} className={classes.paper}>
                    <Grid container className={classes.gridContainer}>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Button variant="contained" fullWidth  color="secondary" startIcon={<PhoneDisabled fontSize="large" />} className={classes.margin} onClick={end} >
                                End
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Button variant="contained" fullWidth color="primary" startIcon={<MicOff fontSize="large" />} className={classes.margin} onClick={mute}>
                                Mute
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Button variant="contained" fullWidth color="primary" startIcon={<VideocamOff fontSize="large" />} className={classes.margin} onClick={pause}>
                                Pause
                            </Button>
                        </Grid>
                    </Grid>
            </Paper>
        </Container>
    );
};

export default Sidebar;