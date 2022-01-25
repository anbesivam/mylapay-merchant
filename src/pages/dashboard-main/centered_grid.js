
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {Timeline,AddShoppingCart,AccountCircle,AttachMoney} from '@material-ui/icons';
import React from 'react';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function CenteredGrid({Box_data}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={`${classes.paper} box1`}>
          
            <Box className="left_box" justifyContent="flex-start">
              <div className="cart_outer"><AddShoppingCart style={{width:"32px",height:"32px",marginTop:"20%"}}/>  </div>
              <div className="orders">Total</div>
            </Box>  
            <Box className="right_box" justifyContent="flex-end">
              <div className="box_right_top">{Box_data.Box_1 ? Box_data.Box_1 : 0}</div>
              <div className="box_right_bottom">₹{Box_data.totalAmount ? Box_data.totalAmount : 0}</div>
            </Box>  
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={`${classes.paper} box2`}>
            <Box className="left_box" justifyContent="flex-start">
        
              <div className="cart_outer"><AccountCircle style={{width:"32px",height:"32px",marginTop:"15%"}}/>  </div>
              <div className="orders">Pending</div>
            </Box>  
            <Box className="right_box" justifyContent="flex-end">
              <div className="box_right_top">{Box_data.Box_2 ? Box_data.Box_2 : 0}</div>
              <div className="box_right_bottom">₹{Box_data.pendingAmount ? Box_data.pendingAmount : 0}</div>
            </Box>  
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={`${classes.paper} box3`}>
            <Box className="left_box" justifyContent="flex-start">
              <div className="cart_outer"><Timeline style={{width:"32px",height:"32px",marginTop:"15%"}}/>  </div>
              <div className="orders">Successful</div>
            </Box>  
            <Box className="right_box" justifyContent="flex-end">
              <div className="box_right_top">{Box_data.Box_3 ? Box_data.Box_3 : 0}</div>
              <div className="box_right_bottom">₹{Box_data.successAmount ? Box_data.successAmount : 0}</div>
            </Box>  
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={`${classes.paper} box4`}>
            <Box className="left_box" justifyContent="flex-start">
              <div className="cart_outer"> <AttachMoney style={{width:"32px",height:"32px",marginTop:"15%"}}/> </div>
              <div className="orders">Failed </div>
            </Box>  
            <Box className="right_box" justifyContent="flex-end">
              <div className="box_right_top">{Box_data.Box_4 ? Box_data.Box_4 : 0}</div>
              <div className="box_right_bottom">₹{Box_data.failedAmount ? Box_data.failedAmount : 0}</div>
            </Box>  
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
