// import { createMuiTheme } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#20295C",
    },
    secondary: {
      main: "#2CAEE4",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h1: {
      fontWeight: "bold",
    },
    h2: {
      fontWeight: "bold",
    },
    h3: {
      fontWeight: "bold",
    },
    h4: {
      fontWeight: "bold",
    },
    h5: {
      fontWeight: "bold",
    },
    h6: {
      fontWeight: "bold",
    },
    button: {
      textTransform: "none",
    },
  },
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        // whiteSpace: "nowrap",
      },
    },
    MUIDataTableHeadCell: {
      root: {
        whiteSpace: "nowrap",
      },
      fixedHeader: {
        backgroundColor: "#eef3ff",
        paddingTop: "10px",
        paddingBottom: "10px",
      },
    },
    MUIDataTableSelectCell: {
      headerCell: {
        backgroundColor: "#eef3ff",
      },
      fixedLeft: {
        backgroundColor: "#fff",
      },
    },
  },
});

export default theme;
