import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles, createStyles } from "@material-ui/core/styles";
import axios from "axios";

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
  roomlist: any;
}

export class Browse extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
      roomlist: [],
    };
  }

  async componentDidMount() {
    try {
      var res = await axios.get("http://localhost:8080/rooms");
      console.log(res)
      this.setState({
        roomlist: res.data,
      })
    }
    catch (err) {
      console.log(err);
      console.log("Failed to retrieve list of rooms");
    }
  }

  renderRoom(room: any, key: any) {
    const youtubeid = key.split(':')[1]
    return (
      <Grow in={true} timeout='auto'>
        <TableRow hover key={key}>
          <TableCell>
            <img src={`https://img.youtube.com/vi/${room.currVideoId}/default.jpg`} onClick={event => window.location.href = "/rooms/" + youtubeid}></img>
          </TableCell>
          <TableCell>{room.currVideoId}</TableCell>
          <TableCell>{room.name}</TableCell>
          <TableCell>{key}</TableCell>
          <TableCell>
            <Button onClick={event => window.location.href = "/rooms/" + youtubeid}>Go to Room</Button>
          </TableCell>
        </TableRow>
      </Grow>

    )
  }

  render() {
    return (
      <div className="roomlist">
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
              {Object.keys(this.state.roomlist).map((key) => {
                return this.renderRoom(this.state.roomlist[key], key);
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

export default Browse;