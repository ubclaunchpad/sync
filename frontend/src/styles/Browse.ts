import { createStyles } from "@material-ui/core";

export default (theme: any) =>
  createStyles({
    overlay: {
      zIndex: -1,
      position: "absolute",
      background: "#080D19",
      height: "100vh",
      width: "100vw",
      opacity: "0.88",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    navContainer: {
      height: "200px",
      textAlign: "left",
      marginBottom: "50px",
      [theme.breakpoints.down("md")]: {
        marginBottom: "100px",
        height: "170px",
        textAlign: "center"
      },
      [theme.breakpoints.down("sm")]: {
        height: "120px"
      }
    },
    logo: {
      float: "left",
      height: "80%",
      paddingTop: "30px",
      paddingLeft: "100px",
      [theme.breakpoints.down("md")]: {
        float: "none",
        paddingTop: "15px",
        paddingLeft: "0px"
      }
    },
    infoContainer: {
      float: "right",
      paddingTop: "30px",
      paddingRight: "100px",
      [theme.breakpoints.down("md")]: {
        paddingTop: "0px",
        paddingRight: "0px",
        float: "none"
      }
    },
    heading: {
      color: "white",
      letterSpacing: "3px"
    },
    shareBtns: {
      float: "right",
      [theme.breakpoints.down("md")]: {
        float: "none",
        textAlign: "center"
      }
    },
    roomList: {
      margin: "50px 50px 10px 50px"
    },
    tile: {
      cursor: "pointer",
      "& img": {
        opacity: "0.75",
        transition: "0.3s"
      },
      "&:hover": {
        "& img": {
          filter: "brightness(120%)",
          opacity: "1"
        }
      }
    }
  });
