import React from "react";
// import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
import { withStyles, createStyles } from "@material-ui/core/styles";
import axios from "axios";

interface Props {
  classes: any;
}

interface State {
  roomlist: Array<any>;
}

export class Browse extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
      roomlist: [],
    };
  }

  async componentDidMount(){
    try{
      var res = JSON.parse(await axios.get("http://localhost:8080/rooms"));
      console.log(res)
      this.setState({
        roomlist: res,
      })
    }
    catch{
      console.log("Failed to retrieve list of rooms");
    }

  }

  renderRoom(room: any){
    var test = room;
    return(
      <div className="card">
        <h1>Browse Rooms</h1>
        <div className="card__header">
          <h1 className="card__title">Rooms</h1>
        </div>
        <div className="room">
          <div className="room__info">
            <div className="room__name">
              <span>Lego</span>
            </div>
            <span className="room__nb-of-people">Seats 2 people</span>
          </div>
          <div className="room__actions">
            <button className="button">Book Room</button>
            <a href="#" className="more">...</a>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return(
      <div className="roomlist">
        {this.state.roomlist.map((item) => {
          return this.renderRoom(item);
        })}
      </div>
    )
  }
}
const materialUiStyles = createStyles({
//   container: {
//     display: "flex",
//     flexWrap: "wrap"
//   },
//   textField: {
//     marginLeft: "0",
//     marginRight: "0",
//     width: "500px"
//   },
//   button: {
//     background: "#001953",
//     boxSizing: "border-box",
//     borderRadius: "5px",
//     color: "white",
//     "&:hover": {
//       backgroundColor: "#001953"
//     },
//     marginTop: "100px",
//     height: "60px",
//     width: "260px"
//   },
//   input: {
//     display: "none"
//   }
});

export default withStyles(materialUiStyles)(Browse);


// export default Browse;
