import { createStyles } from "@material-ui/core/styles";

export default createStyles({
  container: {
    textAlign: "center",
    color: "#FFFFFF"
  },
  textField: {
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "5px",
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#FFFFFF"
      }
    }
  },
  input: {
    color: "#FFFFFF"
  },
  inputLabel: {
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
  }
});
