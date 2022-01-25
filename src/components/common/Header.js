import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Divider,
  Tooltip,
  IconButton,
  Popper,
  Grid,
  Chip,
  Grow,
  Fade,
  Avatar,
  Paper,
  ClickAwayListener,
  MenuItem,
  MenuList,
} from "@material-ui/core";
import { Menu as MenuIcon, AccountCircleOutlined, AccountCircle } from "@material-ui/icons";

import {
  Help,
  
} from "@material-ui/icons";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/dashboardSlice";
import { logOut } from "../../redux/authSlice";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router";
import axios from "axios";
import LinesEllipsis from "react-lines-ellipsis";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(1),
  },
}));

const useStyleschip = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function Header() {
  const currentUser = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const { REACT_APP_WEBSITE_URL } = process.env;

  const classeschip = useStyleschip();

  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = useState([]);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const IconWithTooltip = () => (
    <Tooltip title={data[0].category}>
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOut());
  };

  const handleprofile = () => {
    history.push("/profile");
  };

  const getShopList = async () => {
    await axios
    .get("/mylapay/transaction/shop/list")
    .then((res) => {

      console.log("list header : " + JSON.stringify(res.data.data));
      setData(res.data.data)
      
    })
    .catch((err) => {
      console.log(err);
    });
  };

  useEffect(() => {
    

    getShopList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        style={{ background: "#fff", zIndex: 1201 }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            onClick={() => dispatch(toggleSidebar())}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <a target="_blank" href={REACT_APP_WEBSITE_URL}>
            <img
              className="site-logo"
              src="/logo.svg"
              alt="Mylapay Logo"
              width="50px"
              height="50px"
              style={{ marginBottom: "-7px", marginLeft: "1em", width:"125px" }}
            />
          </a>
          <Box ml="auto" display="flex" alignItems="center" mr={2}>
            <Typography>
              Welcome, {currentUser ? currentUser.email : ""}
            </Typography>

            <div>
              <IconButton
                ref={anchorRef}
                onClick={handleToggle}
                edge="end"
                color="inherit"
              >
                <AccountCircleOutlined />
              </IconButton>
              {/* <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-end"
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: "right top",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open}>
                          <MenuItem to="/profile" component={Link}>
                            Profile
                          </MenuItem>
                          <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper> */}

              <ClickAwayListener onClickAway={handleClose}>
                <Popper 
                
                  open={open} 
                  anchorEl={anchorRef.current}
                  transition
                  role={undefined}
                  disablePortal
                  placement="bottom-end"
                  style={{width:"250px"}}
                  className="accountdetails"
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}
                      style={{
                        transformOrigin: "right top",
                      }}
                    >
                      <Paper>
                        {/* <ClickAwayListener onClickAway={handleClose}> */}

                        {data.length>0?
                          <>
                              
                            <Typography className={classes.typography} style={{textAlign:"center"}}><AccountCircle style={{fontSize:"50px"}}/></Typography>

                            
                            {/* <Typography className={classes.typography}>Category : <span style={{fontWeight:"bold"}}></span></Typography> */}

                            {/* <Typography className={classes.typography} style={{minWidth: "200px", maxWidth: "200px",}}>Category : <LinesEllipsis text={data[0].category} maxLine={1} /></Typography> */}

                            

                            <Typography className={classes.typography}>
                              <Typography className={classes.typography} style={{textAlign:"center"}}>
                                <span style={{fontWeight:"bold"}}>{data[0].businessName} <IconWithTooltip /></span>
                              </Typography>
                            </Typography>


                            <div className={classeschip.root}>

                              <Typography className={classes.typography} style={{textAlign:"center"}}>
                                
                                {/* Merchant Id : <span style={{fontWeight:"bold"}}>{data[0].MID}</span> */}

                              <Chip
                                avatar={<Avatar>M</Avatar>}
                                label={data[0].MID}
                                // onClick={handleClick}
                                variant="outlined"
                              />
                              
                              </Typography>
                            </div>

                            {/* <Divider /> */}
                          </>
                        :
                        null}
                          

                          <Grid container spacing={2}>
                            <Grid item xs={1}>
                            </Grid>
                            <Grid item xs={5}>
                              <Typography onClick={handleprofile} style={{cursor:"pointer", textAlign:"center", width:"90px", backgroundColor:"#2caee4", color:"white" }} className={classes.typography}>
                                
                                
                              Profile
                                
                                </Typography>

                            </Grid>
                            <Grid item xs={5}>
                                <Typography onClick={handleLogout} style={{cursor:"pointer",textAlign:"center",  width:"90px", backgroundColor:"#20295c", color:"white"}} className={classes.typography}>Logout</Typography>
                            </Grid>

                            <Grid item xs={1}>
                            </Grid>
                            {/* <Grid item xs={1}>
                            </Grid> */}
                          </Grid>

                          {/* <MenuList autoFocusItem={open}>
                            <MenuItem to="/profile" component={Link}>
                              Profile
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                          </MenuList> */}
                        {/* </ClickAwayListener> */}
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </ClickAwayListener>

            </div>
          </Box>
        </Toolbar>
        <Divider />
      </AppBar>
    </>
  );
}
