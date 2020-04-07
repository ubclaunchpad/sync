import React from "react";
import axios from "axios";

import Grow from "@material-ui/core/Grow";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import logo from "../images/logo.png";
import fetchVideoInfo from "youtube-info";
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

  // var fetchVideoInfo = require('youtube-info');
  // fetchVideoInfo('{videoId}').then(function (videoInfo) {
  //   console.log(videoInfo);
  // });

  async componentDidMount() {
    try {
      const res = await axios.get("http://localhost:8080/api/rooms");
      const numrooms = Object.keys(res.data).length;
      let numParsed = 0;
      for (const key in res.data) {
        fetchVideoInfo(res.data[key].currVideoId).then((title: any) => {
          this.state.vidTitle[res.data[key].currVideoId] = title;
          numParsed++;
          if (numParsed === numrooms) {
            this.setState({
              roomList: res.data
            });
          }
        });
      }
      window.addEventListener("resize", () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
      });
    } catch (err) {
      console.log(err);
    }
  }

  mediaCard(room: any, key: any) {
    const { classes } = this.props;
    const roomId = key.split(":")[1];
    return (
      <Grow in={true} timeout="auto" key={key}>
        <GridListTile
          className="tile"
          key={`https://img.youtube.com/vi/${room.currVideoId}/default.jpg`}
          onClick={event => (window.location.href = "/rooms/" + roomId)}
        >
          <img src={`https://img.youtube.com/vi/${room.currVideoId}/hqdefault.jpg`} alt={room.name} />
          <GridListTileBar title={room.name} />
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
