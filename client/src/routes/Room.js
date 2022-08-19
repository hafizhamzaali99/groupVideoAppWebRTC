import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
// import Sidebar from "../components/Sidebar";
import { Button, Grid, Container, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PhoneDisabled,MicOff,VideocamOff } from '@material-ui/icons';


const Container1 = styled.div`
    // padding: 20px;
    display: flex;
    height: 100vh;
    width: 100%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 30%;
    width: 30%;
    padding:20px
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};


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


const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;
    const [streams, setStreams] = useState('')
    // const [close, setClose] = useState(true)

    useEffect(() => {
        socketRef.current = io.connect("/");
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStreams(stream)
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    
    const classes = useStyles()

    async function end(){
        // setClose(true)
        // streams.getTracks().forEach(function (track) { track.stop(); });

        // peersRef.destroy();
        window.location.href="http://localhost:3000/"
        // window.location.reload();
    }
    function mute(){
        streams.getAudioTracks()[0].enabled = !(streams.getAudioTracks()[0].enabled);
    }
    function pause(){
        streams.getVideoTracks()[0].enabled = !(streams.getVideoTracks()[0].enabled);
    }

    return (
        <Container1>
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return (
                        <Video key={index} peer={peer} />
                );
            })}
        
            <Container className={classes.container}>
                <Paper elevation={10} className={classes.paper}>
                    <Grid container className={classes.gridContainer}>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Button variant="contained" fullWidth color="secondary" startIcon={<PhoneDisabled fontSize="large" />} className={classes.margin} onClick={end} >
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
        </Container1>
    );
};

export default Room;
