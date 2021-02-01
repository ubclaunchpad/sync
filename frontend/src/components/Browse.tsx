import React from "react";
import axios from "axios";
import Link from "@material-ui/core/Link";
import Grow from "@material-ui/core/Grow";
import ParticlesBg from "particles-bg";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { Facebook, Reddit, Twitter } from "@material-ui/icons";
import { WithStyles, withStyles } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import logo from "../assets/logo.png";
import styles from "../styles/Browse";
import { RoomInfo, RoomList } from "../models";

interface Props extends WithStyles {
  classes: ClassNameMap;
}

interface State {
  roomList: RoomList;
  width: number;
  height: number;
}

export class Browse extends React.Component<Props, State> {
  private api: string;
  private SOCIAL_MSG = "Come+watch+videos+together+in+Sync!";
  private REDDIT_SHARE_URL = `https://www.reddit.com/submit?url=${window.location.href}&title=${this.SOCIAL_MSG}`;
  private FACEBOOK_SHARE_URL = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
  private TWITTER_SHARE_URL = `https://twitter.com/intent/tweet?text=${this.SOCIAL_MSG + "%0D" + window.location.href}`;

  constructor(props: Props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      roomList: {}
    };
    this.api = process.env.REACT_APP_API_URL || "http://localhost:8080";
  }

  componentDidMount = async () => {
    window.addEventListener("resize", () => {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    });
    try {
      this.setState({
        roomList: (await axios.get(`${this.api}/api/rooms?public`)).data
      });
    } catch (err) {
      console.error(err);
    }
  };

  getRoomCard = (roomId: string, room: RoomInfo, classes: ClassNameMap) => {
    return (
      <Grow in={true} timeout="auto" key={roomId}>
        <GridListTile className={classes.tile} key={roomId} onClick={(event) => (window.location.href = "/" + roomId)}>
          <img src={`https://img.youtube.com/vi/${room.videoId}/hqdefault.jpg`} alt={room.name} />
          <GridListTileBar style={{ fontWeight: "bold" }} subtitle={room.videoTitle} title={room.name} />
        </GridListTile>
      </Grow>
    );
  };

  render = () => {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <ParticlesBg type="circle" bg={true} />
        <div className={classes.navContainer}>
          <Link href="/">
            <img className={classes.logo} src={logo} alt="logo"></img>
          </Link>
          <div className={classes.infoContainer}>
            <h2 className={classes.heading}>DISCOVER ROOMS</h2>
            <div className={classes.shareBtns}>
              <Tooltip title="Share to Facebook">
                <IconButton target="_blank" href={this.FACEBOOK_SHARE_URL}>
                  <Facebook style={{ color: "rgb(33, 120, 232)" }}></Facebook>
                </IconButton>
              </Tooltip>
              <Tooltip title="Share to Twitter">
                <IconButton target="_blank" href={this.TWITTER_SHARE_URL}>
                  <Twitter style={{ color: "rgb(41, 159, 232)" }}></Twitter>
                </IconButton>
              </Tooltip>
              <Tooltip title="Share to Reddit">
                <IconButton target="_blank" href={this.REDDIT_SHARE_URL}>
                  <Reddit style={{ color: "rgb(246, 69, 29)" }}></Reddit>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className={classes.roomList}>
          <GridList cols={Math.ceil(this.state.width / 400)} spacing={30}>
            {Object.keys(this.state.roomList).map((id) => {
              return this.getRoomCard(id, this.state.roomList[id], classes);
            })}
          </GridList>
        </div>
        <div className={classes.overlay}></div>
      </React.Fragment>
    );
  };
}

export default withStyles(styles)(Browse);
