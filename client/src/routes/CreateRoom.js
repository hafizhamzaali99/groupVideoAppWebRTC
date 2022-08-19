import React from "react";
import { v1 as uuid } from "uuid";
import { Button, Grid, Container, Paper,Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';


const useStyles = makeStyles((theme) => ({
    gridContainer: {
        width: '100%',
        // flexWrap: "nowrap",
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    container: {
        // width: '100%',
        height:"100vh",
        // margin: '35px 0',
        display: 'flex',
        alignItems: "center",
        justifyContent: 'center',
        // padding: 0,
        [theme.breakpoints.down('xs')]: {
            width: '80%',
        },
    },
    margin: {
        margin: 20,
    },
    // padding: {
    //     padding: 20,
    // },
    paper: {
        padding: '10px 20px',
        // border: '2px solid black',
        margin: 20,
    },
}));
const CreateRoom = (props) => {
    const classes = useStyles()

    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
        <Container className={classes.container}>
            <Paper elevation={10} className={classes.paper}>
                <Typography variant="h3">Video Chat App</Typography>
                <Grid container className={classes.gridContainer}>
                    <Button variant="contained" onClick={create} fullWidth color="secondary" startIcon={<AddCircleOutlineIcon fontSize="large" />} className={classes.margin}>
                        Create Room
                    </Button>
                </Grid>
            </Paper>
        </Container>
    );
};

export default CreateRoom;
