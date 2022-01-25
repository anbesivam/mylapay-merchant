import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function Pricing({ showPricing, setShowPricing }) {
  return (
    <>
      <Dialog
        open={showPricing}
        onClose={() => setShowPricing(false)}
        scroll="paper"
      >
        <DialogTitle>Pricing</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            <p><strong>Know about your charges:</strong></p>
            <p>It is important to know your charges on every sale for you to set the product pricing appropriately.</p>
            <p><strong>Mylapay Fees</strong></p>
            <p>Mylapay charges you a small flat fee of 2% on every order value for providing its marketplace technology platform including hosting, integrated payment gateway solution and settlements.</p>
            <p><strong>Shipping and Service Notification Charges</strong></p>
            <p>Shipping and service notification fee is charged on actuals received from service partners for every order delivery fulfilled through Mylapay shipping partners.</p>
            
            <p>Shipping rates are calculated based on package weight and destination point</p>
            
            <p>Destination point is classified in four buckets as follows;</p>
            
            <table>
            <tbody>
            <tr>
            <td>
            <p><strong>Destination Zone</strong></p>
            </td>
            <td>
            <p><strong>Definition</strong></p>
            </td>
            </tr>
            <tr>
            <td>
            <p>Local</p>
            </td>
            <td>
            <p>Local within city pickup and delivery</p>
            </td>
            </tr>
            <tr>
            <td>
            <p>Regional1</p>
            </td>
            <td>
            <p>Origin to destination within 500kms</p>
            </td>
            </tr>
            <tr>
            <td>
            <p>National1</p>
            </td>
            <td>
            <p>Origin to destination between 501 - 1400 kms (Metro to metro only)</p>
            </td>
            </tr>
            <tr>
            <td>
            <p>National2</p>
            </td>
            <td>
            <p>Origin to destination between 1401 - 2500 kms (Metro to metro only)</p>
            </td>
            </tr>
            <tr>
            <td>
            <p>National3</p>
            </td>
            <td>
            <p>Origin to destination between 501 - 1400 kms&nbsp; (Metro - Others / Others - Others)</p>
            </td>
            </tr>
            <tr>
            <td>
            <p>National4</p>
            </td>
            <td>
            <p>Origin to destination between 1401 - 2500 kms&nbsp; (Metro - Others / Others - Others)</p>
            </td>
            </tr>
            <tr>
            <td>
            <p>Special Zones</p>
            </td>
            <td>
            <p>NE, J&amp;K and Origin to destination &gt; 2500 kms</p>
            </td>
            </tr>
            </tbody>
            </table>
            
            <p>Package weight is determined by actual weight or volumetric weight of the package whichever is higher.</p>
            
            <p>Volumetric Weight is calculated on the package size using the formula, (Length x Width x Height in centimeters) divided by 4000 to get the Volumetric Weight of a unit in kilograms.</p>
            
            <p>For example, a package size has dimension of 10cm x 10cm x 15cm, the formula to calculate volumetric weight is 10x10x15/4000 = 1.12 KG or 1125 grams.</p>
            
            <p>If a package actual weight is 750 grams but the volumetric weight is 1125 grams, then shipment rate will be calculated on volumetric weight. This is the standard norms followed widely by all carries and cargos.</p>
            
            <p><strong>GST</strong></p>
            <p>Goods and Service Taxes at 18% is applicable on all the above charges.</p>
            
            <p><strong>Note:</strong> The above pricing may undergo a change if there is rate change effected by Government, RBI, Acquiring Banks, Service Partners, or any other business reasons.</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPricing(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
