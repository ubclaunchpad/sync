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
import { withStyles } from "@material-ui/core";
import logo from "../assets/logo.png";
import styles from "../styles/Browse";

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
  private api: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      roomList: [],
      vidTitle: {},
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.mediaCard = this.mediaCard.bind(this);
    this.api = process.env.REACT_APP_API_URL || "http://localhost:8080";
  }

  async componentDidMount() {
    try {
      const res = await axios.get(`${this.api}/api/rooms`);
      for (const key in res.data) {
        axios.get(`${this.api}/api/videotitle/` + res.data[key].currVideoId).then((resp) => {
          this.setState((prevState) => {
            const vidTitle = Object.assign({}, prevState.vidTitle);
            vidTitle[res.data[key].currVideoId] = resp.data;
            return { vidTitle };
          });
        });
      }
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

  mediaCard(room: any, key: any, classes: any) {
    const roomId = key.split(":")[1];
    return (
      <Grow in={true} timeout="auto" key={key}>
        <GridListTile
          className={classes.tile}
          key={`https://img.youtube.com/vi/${room.currVideoId}/default.jpg`}
          onClick={(event) => (window.location.href = "/" + roomId)}
        >
          <img src={`https://img.youtube.com/vi/${room.currVideoId}/hqdefault.jpg`} alt={room.name} />
          <GridListTileBar
            style={{ fontWeight: "bold" }}
            subtitle={
              this.state.vidTitle[room.currVideoId] !== undefined
                ? "Playing: " + this.state.vidTitle[room.currVideoId]
                : "Retrieving Title ... "
            }
            title={room.name}
          />
        </GridListTile>
      </Grow>
    );
  }

  render() {
    const { classes } = this.props;
    const url = window.location.href;
    const shareText = "Come+watch+videos+together+in+Sync!";
    const redditURL = `https://www.reddit.com/submit?url=${url}&title=${shareText}`;
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    const twitterURL = `https://twitter.com/intent/tweet?text=${shareText + "%0D" + url}`;

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
                <IconButton target="_blank" href={facebookURL}>
                  <Facebook style={{ color: "rgb(33, 120, 232)" }}></Facebook>
                </IconButton>
              </Tooltip>
              <Tooltip title="Share to Reddit">
                <IconButton target="_blank" href={redditURL}>
                  <Reddit style={{ color: "rgb(246, 69, 29)" }}></Reddit>
                </IconButton>
              </Tooltip>
              <Tooltip title="Share to Twitter">
                <IconButton target="_blank" href={twitterURL}>
                  <Twitter style={{ color: "rgb(41, 159, 232)" }}></Twitter>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className={classes.roomList}>
          <GridList cols={Math.ceil(this.state.width / 400)} spacing={30}>
            {Object.keys(this.state.roomList).map((key) => {
              return this.mediaCard(this.state.roomList[key], key, classes);
            })}
          </GridList>
        </div>
        <div className={classes.overlay}></div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Browse);
