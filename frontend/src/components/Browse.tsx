import React from "react";
import axios from "axios";
import Link from "@material-ui/core/Link";
import Grow from "@material-ui/core/Grow";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import logo from "../assets/logo.png";
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
        axios.get(`${this.api}/api/youtubeinfo/` + res.data[key].currVideoId).then((title: any) => {
          this.state.vidTitle[res.data[key].currVideoId] = title.data;
          this.setState({ vidTitle: this.state.vidTitle });
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

  mediaCard(room: any, key: any) {
    const { classes } = this.props;
    const roomId = key.split(":")[1];
    console.log(roomId, this.state.vidTitle);
    return (
      <Grow in={true} timeout="auto" key={key}>
        <GridListTile
          className="tile"
          key={`https://img.youtube.com/vi/${room.currVideoId}/default.jpg`}
          onClick={event => (window.location.href = "/rooms/" + roomId)}
        >
          <img src={`https://img.youtube.com/vi/${room.currVideoId}/hqdefault.jpg`} alt={room.name} />
          <GridListTileBar
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
    console.log("rendering");
    return (
      <div className="browse">
        <div className="title">
          <Link href="/">
            <img className="logo" src={logo}></img>
          </Link>
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
