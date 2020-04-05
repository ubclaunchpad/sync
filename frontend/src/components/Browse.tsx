import React from "react";
import axios from "axios";

// import Button from "@material-ui/core/Button";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";

import { createStyles, withStyles } from "@material-ui/core";
// import Card from "@material-ui/core/Card";
// import CardActionArea from "@material-ui/core/CardActionArea";
// import CardActions from "@material-ui/core/CardActions";
// import CardContent from "@material-ui/core/CardContent";
// import CardMedia from "@material-ui/core/CardMedia";
// // import Button from '@material-ui/core/Button';
// import Typography from "@material-ui/core/Typography";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import logo from "../images/logo.png";

import "../styles/Browse.css";

interface Props {
  classes: any;
}

interface State {
  roomList: any;
  vidTitle: any;
  width: any;
  height: any;
}

const materialUiStyles = createStyles({
  // root: {
  //   maxWidth: 345
  // },
  // media: {
  //   height: 140
  // },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden"
    // backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
});

export class Browse extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      roomList: [],
      vidTitle: {},
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.mediaCard = this.mediaCard.bind(this);
  }

  async componentDidMount() {
    try {
      const res = await axios.get("http://localhost:8080/api/rooms");
      this.setState({
        roomList: res.data
      });
      window.addEventListener("resize", () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
      });
    } catch (err) {
      console.log(err);
    }
  }

  mediaCard(room: any, key: any) {
    console.log(this.state);
    const { classes } = this.props;
    const roomId = key.split(":")[1];
    return (
      <Grow in={true} timeout="auto" key={key}>
        <GridListTile
          key={`https://img.youtube.com/vi/${room.currVideoId}/default.jpg`}
          onClick={event => (window.location.href = "/rooms/" + roomId)}
        >
          <img src={`https://img.youtube.com/vi/${room.currVideoId}/default.jpg`} alt={room.name} />
          <GridListTileBar
            title={room.name}
            subtitle={<span>Room ID: {roomId}</span>}
            actionIcon={
              <IconButton aria-label={`info about ${room.name}`} className={classes.icon}>
                <InfoIcon />
              </IconButton>
            }
          />
        </GridListTile>
      </Grow>
    );
  }

  render() {
    return (
      <div className="browse">
        <div className="title">
          <img className="logo" src={logo}></img>
          <h2 className="heading">DISCOVER ROOMS</h2>
        </div>
        <div className="roomList">
          <GridList cols={Math.ceil(this.state.width / 400)} spacing={30}>
            {Object.keys(this.state.roomList).map(key => {
              return this.mediaCard(this.state.roomList[key], key);
            })}
          </GridList>
        </div>
      </div>
    );
  }
}

export default withStyles(materialUiStyles)(Browse);
