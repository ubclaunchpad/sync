import React from "react";
import axios from "axios";
import Link from "@material-ui/core/Link";
import Grow from "@material-ui/core/Grow";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import logo from "../assets/logo.png";
import "../styles/Browse.css";

interface State {
  roomList: any;
  vidTitle: any;
  width: any;
  height: any;
}

export class Browse extends React.Component<{}, State> {
  private api: string;

  constructor(props: {}) {
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

  mediaCard(room: any, key: any) {
    const roomId = key.split(":")[1];
    return (
      <Grow in={true} timeout="auto" key={key}>
        <GridListTile
          className="tile"
          key={`https://img.youtube.com/vi/${room.currVideoId}/default.jpg`}
          onClick={(event) => (window.location.href = "/rooms/" + roomId)}
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
    return (
      <div className="browse">
        <div className="title">
          <Link href="/">
            <img className="logo" src={logo} alt="logo"></img>
          </Link>
          <h2 className="heading">DISCOVER ROOMS</h2>
        </div>
        <div className="roomList">
          <GridList cols={Math.ceil(this.state.width / 400)} spacing={30}>
            {Object.keys(this.state.roomList).map((key) => {
              return this.mediaCard(this.state.roomList[key], key);
            })}
          </GridList>
        </div>
      </div>
    );
  }
}

export default Browse;
