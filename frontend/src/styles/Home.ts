import { createStyles } from "@material-ui/core";

export default (theme: any) =>
  createStyles({
    home: {
      textAlign: "center"
    },
    overlay: {
      background: "#030B1E",
      height: "100vh",
      width: "100vw",
      opacity: "0.88"
    },
    navContainer: {
      height: "200px",
      textAlign: "left",
      [theme.breakpoints.down("md")]: {
        height: "170px",
        textAlign: "center"
      },
      [theme.breakpoints.down("sm")]: {
        height: "120px"
      }
    },
    logo: {
      height: "80%",
      paddingTop: "30px",
      paddingLeft: "100px",
      [theme.breakpoints.down("md")]: {
        paddingTop: "15px",
        paddingLeft: "0px"
      }
    },
    btn: {
      height: "340px",
      width: "250px",
      background: "#000000",
      fontSize: "18px",
      margin: "50px 80px",
      paddingTop: "20px",
      border: "1px solid #07101f",
      boxShadow: "0px 0px 10px rgba(0, 0, 0)",
      opacity: "1 !important",
      color: "white",
      transition: "transform 1s ease-in-out",
      "&:hover": {
        transform: "scale(1.05) translateY(-1vh);",
        color: "#F4F7FC"
      },
      [theme.breakpoints.down("md")]: {
        height: "230px",
        width: "250px",
        fontSize: "16px"
      },
      [theme.breakpoints.down("sm")]: {
        height: "140px",
        width: "250px",
        fontSize: "14px",
        margin: "20px 80px"
      }
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      background: "rgba(34,34,34,0.99)",
      border: "1px solid #000",
      maxWidth: "700px",
      height: "400px",
      borderRadius: "20px",
      outline: "none",
      padding: "2em"
    },
    footer: {
      position: "absolute",
      bottom: "0",
      width: "100%",
      marginBottom: "10px",
      fontSize: "10px",
      "& p": {
        color: "#fff",
        "& a": {
          color: "#fff",
          fontWeight: "bold",
          textDecoration: "none"
        }
      }
    }
  });
