import { Card, Container, Grid } from "@material-ui/core";
import {
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";

export default function TemplatePopup({ setTemplatesPopup }) {
  return (
    <div className="payment-template-overlays">
      <div className="payment-template-close">
        <IconButton
          onClick={() => setTemplatesPopup(false)}
          style={{ color: "#fff" }}
        >
          <Close />
        </IconButton>
      </div>
      <div className="payment-templates-inner">
        <Container>
          <Grid container spacing={4} style={{ alignItems: "center" }}>
            <Grid item xs={12} md={4}>
              <Link to={"/payment-pages/new"}>
                <Card>
                  <CardActionArea>
                    <CardMedia
                      style={{ height: "200px" }}
                      image="https://picsum.photos/200/300"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        Retail Shops and stores
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Boost your sales by creating your free ecommerce shop,
                        add products with images, descriptions along with
                        shipping details.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardActionArea>
                  <CardMedia
                    style={{ height: "200px" }}
                    image="https://picsum.photos/200/300"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Payment Web-Pages
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      Create payment web pages for single product or services
                      and start sharing with your customers to collect payment
                      online
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Link to="/quickpay/new">
                <Card>
                  <CardActionArea>
                    <CardMedia
                      style={{ height: "200px" }}
                      image="https://picsum.photos/200/300"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        Instant Payment Link
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Create instant payment links and share with your
                        customers to collect payments online instantly.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
}
