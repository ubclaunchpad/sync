import React from "react";
import axios from "axios";

import Grow from "@material-ui/core/Grow";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
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
          className="tile"
          key={`https://img.youtube.com/vi/${room.currVideoId}/default.jpg`}
          onClick={event => (window.location.href = "/rooms/" + roomId)}
        >
          <img src={`https://img.youtube.com/vi/${room.currVideoId}/default.jpg`} alt={room.name} />
          <GridListTileBar title={room.name} subtitle={<span>Room ID: {roomId}</span>} />
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

export default Browse;
