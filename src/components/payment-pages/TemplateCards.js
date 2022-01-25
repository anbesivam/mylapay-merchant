import { Box } from "@material-ui/core";
import { Card, Grid } from "@material-ui/core";
import {
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function TemplateCards({ shopUrl, iShop, paymentiShop, templateid }) {


  const checkclose = () => {


    Swal.fire({
      // title: "Are you sure?",
      text: "Option has disabled contact administrator",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#20295C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // handleDialog(false);
      } 
    });
  };

  return (
    <Box m={2} className="templatecards-grid">
      

      {/* {templateid!=1 || templateid!=3 ?

        
          <Card style={{ height: "100%" }}>
            <CardActionArea>
              <CardMedia
                style={{ height: "150px" }}
                image={"../../images/manage_online_store.png"}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="h2">
                  {shopUrl
                    ? "Manage your online store"
                    : "Retail Shops and stores"}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Boost your sales by creating your free ecommerce shop, add
                  products with images, descriptions along with shipping details.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>


        :
          <Link
            style={{ textDecoration: "none" }}
            to={
              shopUrl
                ? `/payment-pages/edit?editItem=${shopUrl}&shopId=${iShop}`
                : "/payment-pages/new"
            }
          >
            <Card style={{ height: "100%" }}>
              <CardActionArea>
                <CardMedia
                  style={{ height: "150px" }}
                  image={"../../images/manage_online_store.png"}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h2">
                    {shopUrl
                      ? "Manage your online store"
                      : "Retail Shops and stores"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Boost your sales by creating your free ecommerce shop, add
                    products with images, descriptions along with shipping details.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        } */}

        {templateid>3 ?


          <Card style={{ height: "100%", opacity:"0.5" }}
          
            onClick={() => {
              // handleDialog(false);
              checkclose()
            }}
          >
            <CardActionArea>
              <CardMedia
                style={{ height: "150px" }}
                image={"../../images/manage_online_store.png"}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="h2">
                  {shopUrl
                    ? "Manage your online store"
                    : "Retail Shops and stores"}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Boost your sales by creating your free ecommerce shop, add
                  products with images, descriptions along with shipping details.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        :
          <Link
            style={{ textDecoration: "none" }}
            to={
              shopUrl
                ? `/payment-pages/edit?editItem=${shopUrl}&shopId=${iShop}`
                : "/payment-pages/new"
            }
            >
              <Card style={{ height: "100%" }}>
                <CardActionArea>
                  <CardMedia
                    style={{ height: "150px" }}
                    image={"../../images/manage_online_store.png"}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                      {shopUrl
                        ? "Manage your online store"
                        : "Retail Shops and stores"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Boost your sales by creating your free ecommerce shop, add
                      products with images, descriptions along with shipping details.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
      }

      {templateid==1 || templateid==3 ?

        
        <Card style={{ height: "100%", opacity:"0.5" }} 
          onClick={() => {
            // handleDialog(false);
            checkclose()
          }}
        >
          <CardActionArea>
            <CardMedia
              style={{ height: "150px" }}
              //image="https://thumbs.dreamstime.com/b/flat-design-payment-gateway-illustration-concept-graphics-come-file-types-very-easy-to-apply-any-software-192846873.jpg"
              //image="https://cdn.dribbble.com/users/1322388/screenshots/6480681/online-banking1.jpg"
              image={"../../images/payment web pages.png"}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="h2">
                Payment Web-Pages
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Create or manage payment web pages for single product or
                services and start sharing with your customers to collect
                payment online
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>


        :
          <Link
            style={{ textDecoration: "none" }}
            to={
              paymentiShop
                ? "/payment-web-page/edit?editItem=" + paymentiShop
                : "/payment-web-page/new"
            }
          >
           
            <Card style={{ height: "100%" }}>
              <CardActionArea>
                <CardMedia
                  style={{ height: "150px" }}
                  //image="https://thumbs.dreamstime.com/b/flat-design-payment-gateway-illustration-concept-graphics-come-file-types-very-easy-to-apply-any-software-192846873.jpg"
                  //image="https://cdn.dribbble.com/users/1322388/screenshots/6480681/online-banking1.jpg"
                  image={"../../images/payment web pages.png"}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h2">
                    Payment Web-Pages
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Create or manage payment web pages for single product or
                    services and start sharing with your customers to collect
                    payment online
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        }

        <Link style={{ textDecoration: "none" }} to="/quickpay" >
          <Card style={{ height: "100%" }} >
            <CardActionArea>
              <CardMedia
                style={{ height: "150px" }}
                //image="https://previews.123rf.com/images/r4yhan/r4yhan2008/r4yhan200800122/152924249-flat-design-payment-gateway-illustration-concept.jpg"
                //image="https://www.softwaresuggest.com/blog/wp-content/uploads/2019/09/payment-gateway.png"
                image={"../../images/instant payment link.png"}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="h2">
                  Instant Payment Link
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Create or manage instant payment links and share with your
                  customers to collect payments online instantly.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      
    </Box>
  );
}
