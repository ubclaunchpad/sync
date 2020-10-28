import { createStyles } from "@material-ui/core/styles";

export default (theme: any) =>
  createStyles({
    container: {
      textAlign: "center",
      color: "#FFFFFF"
    },
    textField: {
      background: "rgba(255, 255, 255, 0.15)",
      borderRadius: "5px",
      "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
          borderRadius: "5px",
          borderColor: "#FFFFFF"
        }
      }
    },
    input: {
      color: "#FFFFFF"
    },
    inputLabel: {
      fontFamily: "Libre Baskerville",
      color: "#FFFFFF",
      "&.Mui-focused": {
        color: "#FFFFFF"
      }
    },
    button: {
      background: "#FFFFFF",
      borderRadius: "5px",
      color: "#001953",
      padding: "0.5em 2em",
      "&:hover": {
        backgroundColor: "rgb(18 27 78 / 90%)",
        color: "white"
      }
    },
    switchRoot: {
      overflow: "visible",
      width: "52px",
      height: "30px",
      padding: 0,
      margin: theme.spacing(1)
    },
    switchBase: {
      padding: 1,
      "&$checked": {
        transform: "translateX(16px)",
        "& + $track": {
          border: "none"
        }
      },
      "&$focusVisible $thumb": {
        border: "6px solid #fff"
      }
    },
    switchThumb: {
      width: "30px",
      height: "30px"
    },
    switchTrack: {
      borderRadius: "25px",
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      opacity: 1
    }
  });
