import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function PrivacyPolicy({ showPrivacy, setShowPrivacy }) {
  return (
    <>
      <Dialog
        open={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        scroll="paper"
      >
        <DialogTitle>Privacy Policy</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            <p>
              Privacy policy Our policy on collection, use and security of
              information We are committed to complying with the current
              legislations and practices, concerning the rights of various
              individuals.
            </p>
            <p>
              INTRODUCTION Mylapay is a trusted and experienced provider of
              payment services and solutions in India. The organization, a part
              of Mindeed Technologies and Services Pvt Ltd, provides business
              solution as a merchant market place company facilitating payment
              acceptance. Mylapay regards the fair and lawful treatment of
              personal information as a critical factor in the success of its
              operations and as a key to the maintenance of the confidence that
              exists between those with whom we deal and ourselves. It (Mylapay)
              acknowledges its legal obligations under the rules of India and
              endorses its requirements.
            </p>
            <p>
              PURPOSE The purpose of this Policy Statement is to ensure that all
              employees of Mylapay and all others given use of, or having access
              to, personal information are fully aware of and abide by their
              duties and responsibilities under the compliant data protection
              procedures in India.
            </p>
            <p>
              POLICY SCOPE This Policy Statement applies to any and all data
              that Mylapay collects and processes relating to identifiable
              living individuals in order to operate efficiently and carry out
              its services and may include, but is not limited to: names of
              individuals, postal addresses, email addresses, mobile phone
              numbers, etc.
            </p>
            <p>
              GUIDING PRINCIPLES Mylapay is committed to ensuring that in its
              businesses activities the organisation complies with the letter
              and the spirit of the law concerning the fundamental rights and
              freedoms of individuals whose personal information is being
              processed, in India. In particular, Mylapay is committed to
              ensuring that: The law requirements in India are properly
              implemented through the establishment of internal policies and
              procedures; Data Protection procedure is incorporated and the
              latter operates independently as a first point of contact for the
              supervisory authority and data subjects, but also internally
              within the organisation; Staff is trained and made aware of the
              law and their obligations under it, including the obligation to
              report internally certain types of data breach; Personal data is
              being collected and processed fairly and lawfully and only to the
              extent that it is needed to fulfil operational functions or to
              comply with any legal requirements; Highest security standards are
              addressed and implemented; Appropriate safeguards are provided and
              personal information is protected against accidental loss,
              alternation, unauthorised disclosure or access.
            </p>
            <p>
              DATA PROTECTION COMPLIANCE FRAMEWORK To facilitate compliance with
              the law requirements in India, Mylapay has developed and
              implemented a robust and transparent data protection compliance
              framework consisting of policies, procedures, internal controls
              and systems. Data protection compliance framework includes
              provisions governing: Promotion of enhanced compliance culture
              throughout the group; Implementation of data protection policies
              and procedures; Appointment of internal control functions
              (Compliance, Internal Audit); Implementation of internal control
              mechanisms for conducting regular risk assessments to identify
              threats and vulnerabilities that can affect data assets; Keeping
              up to date the electronic records of the processing activities and
              the security in operation at the time; Implementation of internal
              control systems for keeping personal information secure and
              protected from unauthorised processing, loss or destruction;
              Reporting of both confirmed and suspected incidents to the data
              breach in-charge of the organisation; Handling queries on personal
              data that are promptly and courteously dealt with.
            </p>
            <p>
              FURTHER INFORMATION If you wish to access or correct or delete any
              of your personal information as held by us, or if you have any
              questions or require further information regarding this Policy
              Statement, please contact info@mindeed.in. The Legal and
              Compliance Department will review its procedures regularly to
              ensure continued compliance with this Policy Statement. At no
              point is Mylapay or any of its group company responsible for
              updation in the privacy policy. It is the sole responsibility of
              the website visitor to check the policies in the website before
              using the website.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPrivacy(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
