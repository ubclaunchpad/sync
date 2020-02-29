import React from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grow from '@material-ui/core/Grow';

interface Props {
  classes: any;
}

interface State {
  roomList: any;
}

export class Browse extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
      roomList: [],
    };
  }

  async componentDidMount() {
    try {
      var res = await axios.get("http://localhost:8080/rooms");
      this.setState({
        roomList: res.data,
      })
    }
    catch (err) {
      console.log(err);
    }
  }

  renderRoom(room: any, key: any) {
    const youtubeId = key.split(':')[1]
    return (
      <Grow in={true} timeout='auto' key={key}>
        <TableRow hover key={key}>
          <TableCell>
            <img src={`https://img.youtube.com/vi/${room.currVideoId}/default.jpg`} onClick={event => window.location.href = "/rooms/" + youtubeId}></img>
          </TableCell>
          <TableCell>{room.currVideoId}</TableCell>
          <TableCell>{room.name}</TableCell>
          <TableCell>{key}</TableCell>
          <TableCell>
            <Button onClick={event => window.location.href = "/rooms/" + youtubeId}>Go to Room</Button>
          </TableCell>
        </TableRow>
      </Grow>

    )
  }

  render() {
    return (
      <div className="roomList">
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Video Playing</TableCell>
                <TableCell>Video Name</TableCell>
                <TableCell>Room Name</TableCell>
                <TableCell>Room Key</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(this.state.roomList).map((key) => {
                return this.renderRoom(this.state.roomList[key], key);
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

export default Browse;