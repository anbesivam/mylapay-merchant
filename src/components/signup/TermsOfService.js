import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function TermsOfService({ showTerms, setShowTerms }) {
  return (
    <>
      <Dialog
        open={showTerms}
        onClose={() => setShowTerms(false)}
        scroll="paper"
      >
        <DialogTitle>Terms &amp; Conditions of Service</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            <p>
              This is the official website Mylapay. This website{" "}
              <a href="https://mylapay.com/">https://mylapay.com/</a> may
              specify from time to time, (&quot;website&quot;) is owned and
              operated by Mindeed technologies and services Pvt. Ltd. The access
              to and use of this website is subject to the following terms and
              conditions of use (&quot;terms&quot;). Please read the terms very
              carefully as they shall apply to all users of this website. A user
              may opt for services through this website only if he accepts and
              abides by all of the terms. Mylapay may periodically change these
              terms without notice.
            </p>
            <p>
              Definitions For the purpose of these terms, the following words
              and phrases shall have the meaning assigned to them under this
              article. &quot;services&quot; means the service provided by
              Mylapay and service providers to users, whereby a user can (i)
              receive payments from their customers or other payers; or (ii)
              make payment to suppliers, beneficiaries or other payees, by (a)
              IMPS/NEFT/RTGS; or (b) credit/ debit card; or (c) net banking; or
              (d) any other mode of payment through banks, that may be accepted
              by Mylapay from time to time in these terms.
            </p>
            <p>
              User Shall mean any person who is boarded on the Mylapay platform
              for using this website and/or who transacts or avails of the
              services through this website, to make or to receive payments to
              or from third parties. The term &quot;user&quot; shall also cover
              such personnel of any user who are authorized to avail of the
              services on behalf of the user.
            </p>
            <p>
              Nodal Account Means such bank account maintained by Mylapay as
              required by the RBI guidelines.
            </p>
            <p>
              Payee Means any person to whom a payment is made, using the
              services, (and the term includes a user who uses the services to
              receive payment.
            </p>
            <p>
              Payer Means any person who makes a payment, using the services
              (and the term includes a user who uses the services to make
              payment).
            </p>
            <p>
              Products Mean any services or products which are purchased/
              offered for sale by a user to third parties from time to time,
              using these services. Products shall not include those banned
              products and services that are listed in annexure a.
            </p>
            <p>
              Service Provider Means a bank, association, facility provider,
              card issuing institution, acquiring bank, other financial
              institution, card processor, clearing house networks whose
              facilities or services are utilized in the provision of these
              services.
            </p>
            <p>
              Transaction Means a payment instruction that results in the
              successful transfer of monies (a) from a user to a payee; or (b)
              from a payer to a user.
            </p>
            <p>
              Transaction Amount Means the total amount payable/ receivable by a
              user/payee. This amount shall include all taxes, charges,
              interest, delivery costs, commissions, etc.
            </p>
            <p>
              Eligibility The website and services are intended solely for
              persons who can form legally binding contracts under Indian law
              and who are 18 years of age or older. Any access to or use of the
              website or services by anyone under 18 is expressly prohibited. By
              using the website or services user represents and warrants that he
              is 18 or older and is competent to contract. User also agrees that
              his payer/ payee is similarly competent to contract.{" "}
            </p>
            <p>
              A user represents and warrants that he has full power and
              authority for using the services and is in strict compliance of
              all laws.{" "}
            </p>
            <p>
              These Terms and Conditions as accepted by user shall be read along
              with and in addition to any terms and conditions in force from
              time to time and issued by any service provider. They will also be
              read in conjunction with the privacy policy{" "}
            </p>
            <p>
              A user may use the services and this website only if he accepts
              and abides by all of the following terms and conditions.
            </p>
            <p>
              Registration: In order to avail the services, user must be
              registered with Mylapay and the service providers. User shall
              provide Mylapay with all such documents as may be required by
              Mylapay and the service provider. The user is strictly prohibited
              to use our services for the websites/business not registered with
              Mylapay and the services providers. The user shall keep Mylapay
              and the service provider fully indemnified in the event this
              clause is breached.
            </p>
            <p>
              By registering with Mylapay, user agrees to provide true,
              accurate, current and complete information failing which Mylapay
              may at any time reject user’s registration and terminate his right
              to use or access the website and/or services. When user registers
              with Mylapay, a user account will be created, that is associated
              with user’s user name, password and other identifying information.
              User shall be responsible for anything that happens through his
              user account.
            </p>
            <p>
              Use of Services: The services may be used by user for making and
              receiving payments from / to third parties.{" "}
            </p>
            <p>
              To enable the user to use the services, a link with login
              credentials will be communicated to the user on his mobile phone
              or email address and the user irrevocably and unconditionally
              accepts the sole responsibility for use, confidentiality and
              protection of said login credentials, including passwords, as well
              as for all orders and information changes entered into the mobile/
              e mail account using such login credentials.{" "}
            </p>
            <p>
              Mylapay. Has no obligation to verify the authenticity of the
              transaction other than by means of verification of the user’s
              basic KYC information. The user shall at all times take all
              appropriate steps, including those as mentioned herein, to
              maintain the security and confidentiality of the information.
              Mylapay shall not be liable for any mistake or misuse of the
              services by either the user or by any person authorized by the
              user, or by any person gaining access to the services through the
              user. User agrees that Mylapay accepts all instructions
              originating from his account in good faith and in a manner
              consistent with commercially reasonable security standards. User
              shall indemnify and hold Mylapay harmless for direct or indirect
              losses sustained as a result of the disclosure of sensitive
              information by or through user.{" "}
            </p>
            <p>
              On receiving the necessary details from the service provider,
              Mylapay shall initiate the required payment to payee/user/ as
              instructed by user/ payer.{" "}
            </p>
            <p>
              Confirmation of the transaction performed using valid login
              credentials shall be conclusive evidence of a transaction being
              effected. User is responsible to furnish Mylapay with correct and
              current payee information. In the event that the payment is in
              respect of a purchase of products by the user/payee, Mylapay shall
              not be required to ensure that the purchased products have been
              duly delivered. In the event a user chooses to complain about a
              transaction, the same should be communicated to Mylapay within 10
              (ten) days of the transaction.
            </p>
            <p>
              User Obligations: Each user shall be responsible to (i) furnish
              correct and accurate information of the payer/ payee as may be
              required, on an independent basis; (ii) furnish to Mylapay
              forthwith on demand, the original copy/copies of proof of delivery
              of products, invoices or other records pertaining to any
              transaction; (iii) ensure that all licenses and registrations
              required by him are in full force and effect to enable them to
              carry on the business of sale/ purchase of products.{" "}
            </p>
            <p>
              User shall not (i) carry out any activity, which is banned,
              illegal or immoral, (ii) use the services in any manner or in
              furtherance of any activity, which constitutes a violation of any
              law or regulation or which may cause Mylapay to be subject to
              investigation, prosecution or legal action.{" "}
            </p>
            <p>
              User undertakes and assures to Mylapay that payments shall not be
              made/ received in respect of any products mentioned in the banned
              items list set out in annexure a hereto.{" "}
            </p>
            <p>
              User shall not sell, provide, exchange, or otherwise disclose to
              third parties or use themselves (other than for the purpose of
              completing a transaction, or as specifically required by law) any
              personal information about any third party, including the account
              details and mobile number, without obtaining the prior written
              consent of such third party.{" "}
            </p>
            <p>
              User shall take all precautions as may be feasible or as may be
              directed by Mylapay to ensure that there is no breach of security
              and that the integrity of the link between their systems/ site,
              the website and the payment mechanism is maintained at all times.
              In the event of any loss being caused as a result of the link
              being breached or as a consequence of the link being improper or
              being in violation of the provisions of this clause, the loss
              shall be to the account of the user and the user shall indemnify
              and keep indemnified Mylapay and the service providers from any
              loss as may be caused in this regard.{" "}
            </p>
            <p>
              User shall bear and be responsible for the payment of all relevant
              taxes, surcharge, levies (including any applicable withholding
              taxes) as may be due.{" "}
            </p>
            <p>
              A user shall not at any time require any other user to provide him
              with any details of the accounts held by the other users with any
              banks including, the passwords, account number, card numbers,
              mobile phone numbers and pin which may be assigned to them by the
              banks from time to time.{" "}
            </p>
            <p>
              A user shall use the information regarding a payee/ payer
              (including name, address, e-mail address, telephone numbers and
              other data) conveyed to him whist using the services, only for the
              purpose of completing the transaction for which it was furnished,
              and not to sell or otherwise furnish such information to others
              unless he has an independent source of such information or obtains
              the express consent of such payee/ payer.{" "}
            </p>
            <p>
              A user shall inform Mylapay. Of any change in his email address,
              mobile number, address, ownership or legal status or his cessation
              of business in writing 60 working days in advance of such change.{" "}
            </p>
            <p>
              User shall not interfere with or damage the website, including,
              without limitation, through the use of viruses, cancel bots,
              trojan horses, harmful code, flood pings, denial-of-service
              attacks, backdoors, packet or IP spoofing, forged routing or
              electronic mail address information or similar methods or
              technology; Mylapay offers an ecommerce platform to all merchant
              and business types (user) to showcase their business and start
              selling their services/products. The products provided by the user
              is available for purchase to the consumers. There is no
              responsibility shared by Mylapay to manage any user’s business or
              the problems associated with their business. However, Mylapay can
              certainly deboard a user if the user is found with any suspicious
              or illegal business activity.
            </p>
            <p>
              Mylapay has the right to investigate and prosecute violations of
              any of the above to the fullest extent of the law.
            </p>
            <p>
              Fees The acquiring bank will authenticate, authorize, and process
              the payment instructions given by the payer in respect of a
              transaction upon fulfilment of valid criteria as set forth by the
              acquiring bank from time to time and accordingly transfer such
              approved transaction amount from the payer’s bank account to the
              account(s) maintained by Mylapay in accordance with the RBI.{" "}
            </p>
            <p>
              In consideration of the services rendered by Mylapay to the user,
              the user shall pay to Mylapay a fee that is agreed upon in the fee
              schedule defined in the merchant agreement or proposed by Mylapay
              over email to the registered email address.{" "}
            </p>
            <p>
              Mylapay shall deduct its transaction fees plus service GST per
              successful transaction, and make payment of the balance of the
              transaction amount to user/ payee’s designated bank account. All
              other taxes, duties or charges shall be borne and paid by user,
              unless otherwise agreed between the parties. Mylapay reserves the
              right to alter / modify / change the discount / commission rate at
              its discretion. Mylapay also reserves the right to forthwith
              revise the transaction fee payable in the event of any revision in
              the rates charges by the acquiring banks or card associations or
              guidelines issued by the RBI from time to time. It is also
              important to note that the Merchant (user) takes complete
              responsibility of the shipment cost and delivery process as per
              the understanding with Mylapay to ship their goods to their
              customers.
            </p>
            <p>
              It is hereby agreed and acknowledged by the parties that the
              transaction fees charged by Mylapay in respect of a transaction
              that has been confirmed shall not be returned or repaid by Mylapay
              to the user or any other person irrespective of the transaction
              being rejected, charged back, refunded or disputed.
            </p>
            <p>
              Specific Terms Mylapay will not be responsible for any disputes
              between the users and the payers/ payees, including issues
              regarding prices, delivery, non-delivery or delay in delivery of
              the products, quality of products or otherwise. All such disputes
              will be dealt with by and between the user and the payer/ payee
              directly, and Mylapay shall not be a party to such disputes.{" "}
            </p>
            <p>
              Mylapay cannot and does not guarantee the timings of any payments
              made or received as such timing is dependent upon user’s bank,
              card issuing bank/ card processor (where a credit/ debit card is
              used), acquiring financial institution and other service
              providers. Mylapay assumes no liability and shall not be held
              responsible for any delays in delivery of payment or availability
              of funds when using the services. Also, Mylapay will follow RBI
              guidelines on settlement where the delivery of goods proof is
              essential to get the payment.
            </p>
            <p>
              Mylapay shall not be a party to the agreement between the user and
              any payer/ payee in any manner whatsoever. All contracts are
              directly between users and their payers/ payees.{" "}
            </p>
            <p>
              User shall be responsible for any miscommunication or incorrect
              user/ third party/ other information that may be provided to
              Mylapay at the time of enabling the services for the user.{" "}
            </p>
            <p>
              Mylapay/ service provider reserve the right to impose limits on
              the number of transactions which may be charged on an individual
              credit card or other account during any time period, and reserve
              the right to refuse to make payments in respect of transactions
              exceeding such limit. Mylapay/ service provider also reserve the
              right to refuse to make payments in respect of transactions by
              users with a prior history of questionable charges.
            </p>
            <p>
              Security Subject to the provisions stated herein and as specified
              by Mylapay from time to time, the user will not hold Mylapay
              liable in case of any improper/ fraudulent/unauthorized/
              duplicate/erroneous use of his mobile and/or the web-based access.
              Mylapay will also not be liable for any consequences connected
              with the use/ misuse of user’s mobile/ e mail account by any third
              party. If any third parties gain access to the services, the user
              will be responsible and shall indemnify Mylapay against any
              liability, costs or damages arising out of such misuse / use by
              third parties based upon or relating to such access and use, or
              otherwise.{" "}
            </p>
            <p>
              The user shall be fully liable for: (a) any unauthorised use of
              his mobile/ email account; and/or (b) all authorised transactions
              on his mobile/email account.{" "}
            </p>
            <p>
              Without prejudice to the remedies available to Mylapay and these
              terms, Mylapay shall be under no liability whatsoever to the user
              in respect of any loss or damage arising directly or indirectly
              out of:
            </p>
            <ul>
              <li>any defect in any Products supplied to them;</li>
              <li>
                any inability of a third party to supply or deliver the required
                Products in the necessary numbers or types;
              </li>
              <li>
                the refusal of any person (including a Service Provider) to
                honour or accept a payment;
              </li>
              <li>the malfunction of any computer terminal or equipment;</li>
              <li>
                the utilization of the Services by any person other than by the
                User;
              </li>
              <li>
                any mis-statement, error or omission in any details disclosed to
                Mylapay.
              </li>
              <li>
                any actions taken by Mylapay or the Service Provider in
                reasonably good faith to avoid violation of a law, rule or
                regulation of any governmental authority or to prevent fraud;
              </li>
              <li>any circumstances beyond Mylapay’s control.</li>
            </ul>
            <p>
              Refunds/ Chargebacks A chargeback shall mean a transaction that is
              uncollectible and returned to service provider/ Mylapay by user/
              payee or acquiring bank for a refund to the concerned payer / user
              due to any of the following reasons:{" "}
            </p>
            <p>
              any payment which the user/ payer refuses to honour or demands a
              refund of because the products purchased or the delivery thereof,
              was not as promised or was defective, deficient, incomplete and
              /or unsatisfactory for any reason whatsoever, or that payment for
              the same has already been made.{" "}
            </p>
            <p>
              any payments by a user/ payer using the services, which is
              returned by the acquiring bank for any reason whatsoever.{" "}
            </p>
            <p>
              any charge/debit arising out of any alleged hacking breach of
              security or encryption that may be utilized by service provider/
              Mylapay / payee from time to time.{" "}
            </p>
            <p>any transaction that is unsuccessful. </p>
            <p>
              As a result of the rapid nature of movements of funds, once a
              payment has been initiated through the services, it may not be
              possible to retract the same using the services. If user wishes to
              attempt to chargeback/ retract a payment, he must notify his bank
              and Mylapay immediately and provide all required information.
              Mylapay cannot however guarantee that the payment will be
              retracted. It may be possible to charged back/ retract a payment
              in case of a payment by debit/ credit card, if the instruction is
              given to user’s bank and Mylapay within the prescribed time.
              However, it would not be possible to do so in case of any other
              mode of payment.{" "}
            </p>
            <p>
              In the event of a chargeback situation arising in case of any
              products purchased by a user or payer, for which payment has not
              yet been made to the payee or user by service provider, the user
              or payer shall be advised by Mylapay to resolve the issue with the
              payee or user or service provider and Mylapay shall then settle
              the payment in accordance with the solution agreed upon by the
              parties.{" "}
            </p>
            <p>
              In such event, if the payee and the payer are unable to arrive at
              a satisfactory resolution of the problem, Mylapay / service
              provider shall be entitled to make a direct credit to the
              disputing payer’s account for the disputed amount. Such a debit to
              the payee’s account and the direct credit to the disputing payer’s
              account shall not be disputed by the payee in any manner
              whatsoever. In the event of the payee and the payer arriving at a
              settlement, Mylapay / service provider shall deal with the said
              monies in accordance with the terms of the settlement arrived at.{" "}
            </p>
            <p>
              In the event of a chargeback situation arising in case of any
              products purchased by a user/ payer, for which payment has been
              made to the payee/user / service provider, the user/ payer shall
              be advised to resolve the issue with the payee/user / service
              provider and shall then settle the payment in accordance with the
              solution agreed upon by the parties.{" "}
            </p>
            <p>
              Mylapay shall not be responsible to make payments in respect of
              any chargeback unless it has received the requisite amounts from
              the concerned acquiring bank/ service provider/ payee/ user.
              Mylapay shall not be responsible for any claims, disputes,
              penalties arising in connection with such chargeback, Mylapay
              shall be indemnified against the same. In the event of the receipt
              by Mylapay of an amount of a chargeback from the acquiring bank /
              service provider, Mylapay shall pass on to user/ payer such amount
              received by them within 7 days.{" "}
            </p>
            <p>
              In the event that the parties have agreed that user/ payer is
              entitled to chargeback any transaction, Mylapay may at its
              discretion, give effect to such chargeback entitlement in any one
              or more of the following methods:{" "}
            </p>
            <p>
              Deduction of the relevant amount or any part thereof from any
              amounts to the payee;{" "}
            </p>
            <p>
              Billing the concerned party for the relevant amount or any part
              thereof.
            </p>
            <p>
              Termination If either Mylapay or service provider suspects, on
              reasonable grounds, that a user has committed a breach of these
              terms or any other agreement with Mylapay or any act of dishonesty
              or fraud against Mylapay / any service provider, Mylapay shall be
              entitled to (a) suspend all payment under these terms; (b)
              deactivate/ suspend your user account and disable your password;
              and (c) terminate user’s access to the website or the services
              with or without giving any notice of such termination to the user;
              pending enquiries by Mylapay. User may cancel his user account at
              any time by sending an email to Mylapay. Please note that once
              your account is cancelled, Mylapay does not have any obligation to
              return any data or information that may reside on its servers or
              other equipment.
            </p>
            <p>
              Indemnity User shall keep Mylapay indemnified from and against any
              and all liability (including but not limited to liabilities,
              judgments, damages, losses, claims, costs and expenses,), fines,
              penalties or any other loss that may occur, arising from or
              relating to any claim, suit or proceeding brought against Mylapay
              by another user/ service provider/ third party for reasons
              including, but not limited to (i) delivery, non-delivery or delay,
              deficiency or mistake in respect of the products sold; (ii) a
              breach, non-performance, non-compliance or inadequate performance
              by the user of any of the terms, conditions, representations,
              obligations or warranties made by him; (iii) any acts, errors,
              misrepresentations, wilful misconduct or negligence of the user,
              or his employees, subcontractors and agents in performance of
              their obligations under these terms.{" "}
            </p>
            <p>
              The user shall comply with all such terms and conditions as
              Mylapay or any service provider may prescribe from time to time
              with regard to the services. All transactions effected by or
              through this website, shall constitute legally binding and valid
              transactions when done in adherence to and in compliance with the
              terms and conditions prescribed by Mylapay or seller/ service
              provider.
            </p>
            <p>
              Confidentiality: User agrees not to disclose or attempt to use or
              personally benefit from any non- public information that he may
              learn on the website or through the services. This obligation
              shall continue until such time as the non-public information has
              become publicly known through no action of your own. If you are
              compelled by order of a court or other governmental or legal body
              (or have notice that such an order is being sought) to divulge any
              such non-public information, you agree to promptly and diligently
              notify Mylapay and cooperate fully with Mylapay in protecting such
              information to the extent possible under applicable law.{" "}
            </p>
            <p>
              Mylapay may access, preserve and disclose any of your information
              if required to do so by law, or if we believe in good faith that
              it is reasonably necessary to (i) respond to claims asserted
              against Mylapay or to comply with legal process, (ii) for fraud
              prevention, risk assessment, investigation, customer support,
              product development and de-bugging purposes, or (iii) protect the
              rights, property or safety of Mylapay, its users or members of the
              public.
            </p>
            <p>
              Intellectual Property Rights The website content and the
              trademarks, service marks and logos contained therein
              (&quot;marks&quot;) are owned by or licensed to Mylapay, subject
              to copyright and other intellectual property rights under the law
              and international conventions. Such website content may not be
              copied, reproduced, distributed, transmitted, broadcast,
              displayed, sold, licensed, uploaded, or otherwise exploited
              without the prior written consent of Mylapay.
            </p>
            <p>
              Privacy Policy User understands that his access to the website
              will result in the collection, use and storage of his information
              which is subject to Mylapay s privacy policy. Through his access
              of the website user consents to the collection, use and storage of
              such information, which will be held by Mylapay and may be
              processed and stored by service providers. For an explanation of
              Mylapay’s practices and policies related to the collection, use,
              and storage of users’ information, please read our privacy policy
            </p>
            <p>
              Disclaimer of Warranties: The content and functionality on the
              website is provided with the understanding that Mylapay is not
              herein engaged in itself for making payments. Mylapay is an
              intermediary between banks, service providers and users. All
              content and functionality on the website is provided &quot;as
              is,&quot; without warranty of any kind, either express or implied,
              including, without limitation, implied warranties of
              merchantability, fitness for a particular purpose, title and
              non-infringement. Mylapay makes no warranties, express or implied,
              as to the accuracy, or adequacy of the website or that the
              services provided or the functionality on this website will be
              uninterrupted or error-free or free from any virus or other
              malicious, destructive or corrupting code, program or macro.{" "}
            </p>
            <p>
              User hereby acknowledges that his use of this website and the
              services is at his sole risk. Under no circumstances shall Mylapay
              or any of its predecessors, successors, parents, subsidiaries,
              affiliates, officers, directors, shareholders, investors,
              employees, agents, representatives, attorneys and their respective
              heirs, successors or assigns be liable for any damages, including
              direct, incidental, punitive, special, consequential or exemplary
              damages that directly or indirectly result from the use of, or the
              inability to use, this website or the services, including for
              viruses alleged to have been obtained from the website, even if
              Mylapay has been advised of the possibility of such damages or
              losses and regardless of the theory of liability.
            </p>
            <p>
              Limitation of Liability: User acknowledges and agrees that, to the
              maximum extent permitted by law, the entire risk arising out of
              your access to and use of the website and services, remains with
              you. Neither Mylapay nor any other party involved in providing or
              delivering the website or services will be liable for any
              incidental, special, exemplary or consequential damages, including
              lost profits, loss of data or loss of goodwill, service
              interruption, computer damage or system failure or the cost of
              substitute services, or in connection with these terms, as a
              result of your use of the website or services, whether based on
              warranty, contract, tort (including negligence), product liability
              or any other legal theory, and whether or not Mylapay has been
              informed of the possibility of such damage, even if a limited
              remedy set forth herein is found to have failed of its essential
              purpose.{" "}
            </p>
            <p>
              Except for Mylapay obligations to make payments through the nodal
              account as envisaged herein, in no event will Mylapay&#39;s
              aggregate liability arising out of or in connection with these
              terms and user’s use of the website and services, exceed the
              amount of rupees 1000.
            </p>
            <p>
              General Terms Unless otherwise set out, all payments may only be
              made in Indian rupees.{" "}
            </p>
            <p>
              Mylapay may, if required by law, change any fee or charge or
              institute new fees or charges. The user agrees to pay all fees and
              charges so levied. Mylapay reserves the right to vary any of the
              terms contained herein by posting the revised terms on Mylapay’s
              website without notice to the user.{" "}
            </p>
            <p>
              The user hereby accepts that he may, from time to time, receive
              from Mylapay or its associates, communications such as service
              announcements, advertisements or administrative communications.{" "}
            </p>
            <p>
              All information provided by the user to Mylapay shall be accurate,
              current and complete. User shall be solely responsible for the
              accuracy and correctness of all information provided by him.
              Mylapay shall not be liable for any loss or costs incurred by any
              party due to any incorrect or mistaken information provided by
              user.{" "}
            </p>
            <p>
              Mylapay shall not be liable for any direct, indirect, punitive,
              incidental, exemplary, special or consequential damages or any
              loss of profit, business, revenue, goodwill or anticipated savings
              or any damages whatsoever arising out of or in any way connected
              with the use of the website by user or otherwise.{" "}
            </p>
            <p>
              Mylapay or service provider shall in no event be liable to a user
              or any third party for any loss or damage whatsoever or howsoever
              caused arising directly or indirectly in connection with the
              website and services, including without limitation any:{" "}
            </p>
            <p>
              A. Loss of data; B. Interruption or stoppage to the user’s access
              to and/or use of the website and services; C. Any consequential
              loss or damage or loss of profit, business, revenue, goodwill or
              anticipated savings, arising out of the performance of the
              services or otherwise.{" "}
            </p>
            <p>
              Mylapay makes no representation or warranty, whether express or
              implied, written or oral, about the quality, suitability,
              reliability, availability, merchantability, fitness for a purpose,
              delivery, lack of viruses or other harmful components or accuracy
              of information relating to the products sought to be purchased by
              the user. Each user acknowledges that Mylapay &#39;s or a service
              provider’s services may not be uninterrupted or error free. A user
              also acknowledges that the services provided by any service
              provider to Mylapay, which is passed on to the user under these
              terms, can be brought to an abrupt end in any event whatsoever by
              any of the service providers for any reason whatsoever.{" "}
            </p>
            <p>
              Mylapay’s sole obligation and user’s sole and exclusive remedy in
              the event of interruption to the payment services or loss of use
              and/or access to the payment services, shall be to use all
              reasonable endeavours to restore the payment services as soon as
              reasonably possible.{" "}
            </p>
            <p>
              In no event shall Mylapay or a service provider be liable to a
              user or any other third party for any applicable taxes and
              government levies.{" "}
            </p>
            <p>
              In no event will Mylapay’s total liability to user for all
              liabilities, losses, and causes of action arising out of or
              relating to these terms and conditions; or the user’s use of the
              website; however caused, exceed the amount paid by user, if any,
              for utilising the website or one thousand rupees (rs.1000),
              whichever is lesser.{" "}
            </p>
            <p>
              Any link on the Mylapay website to a third-party site is not an
              endorsement of that website. The use or browsing by a user of any
              other website shall be subject to the terms and conditions in each
              such website.{" "}
            </p>
            <p>
              Mylapay does not endorse any advertiser or merchant linked to its
              website. The user must verify all information provided by the
              merchants/ advertisers before arriving at his decision to purchase
              any product.{" "}
            </p>
            <p>
              The user’s participation in any event/ contest/ promotion shall be
              governed by the terms and conditions mentioned in the respective
              event/ contest/ promotion along with these terms.{" "}
            </p>
            <p>
              Mylapay shall not be liable for any unauthorised access to the
              user’s data or any unauthorized transmissions sent through the
              Mylapay services.
            </p>
            <p>Mylapay shall have the right, at its sole discretion, to:</p>
            <ul>
              <li>restrict or terminate a User’s access to its Services;</li>
              <li>modify or discontinue its Services or any part thereof;</li>
              <li>
                require a User to provide details in respect of any transactions
                and any other details as required by Mylapay from time to time;
                without incurring any liability therefor.
              </li>
            </ul>
            <p>
              Mylapay shall have the right, in its sole discretion, for any or
              no reason, and without penalty, to suspend or terminate a user’s
              use of the website and its services or any part thereof, with or
              without notice.{" "}
            </p>
            <p>
              The user shall not (whether on-line or otherwise): describe itself
              as agent or representative of Mylapay or make any representations
              to any customer or any third party or give any warranties which
              may require Mylapay or service provider to undertake to or be
              liable for, whether directly or indirectly, any obligation and/or
              responsibility to customer or any third party.{" "}
            </p>
            <p>
              Mylapay shall not be liable for any breach of these terms due to
              any force-majeure event such as act of god, governmental
              policy/authority, fire, lightning, explosion, flood, inclement
              weather conditions, power failures, failure in any communication
              systems, equipment breakdown, strikes, lock-out, earthquakes,
              riots, war (declared and undeclared), rebellion, sabotage,
              computer hacking, unauthorized access to computer data and storage
              devices, computer crashes or any other cause beyond the control of
              Mylapay.{" "}
            </p>
            <p>
              If any part of these terms is determined to be invalid or
              unenforceable pursuant to applicable law including, but not
              limited to, the warranty disclaimers and liability limitations set
              forth herein, then the invalid or unenforceable provision will be
              deemed superseded by a valid, enforceable provision that most
              closely matches the intent of the original provision and the
              remainder of the terms shall continue in effect.{" "}
            </p>
            <p>
              Mylapay may assign or transfer its rights and obligations to any
              other party.{" "}
            </p>
            <p>
              In case of any dispute between the parties on the interpretation
              or implementation of these terms, the appropriate court in Chennai
              shall have exclusive jurisdiction.{" "}
            </p>
            <p>
              No failure or delay by Mylapay in exercising any right, power or
              privilege shall operate as a waiver thereof.
            </p>
            <p>For any queries / details users can contact: </p>
            <p>info@mindeed.in customersupport@mylapay.com</p>
            <p>
              Annexure A: Banned items 1) Adult goods and services which
              includes pornography and other sexually suggestive materials
              (including literature, imagery and other media); escort or
              prostitution services.{" "}
            </p>
            <p>
              2) Alcohol which includes alcohol or alcoholic beverages such as
              beer, liquor, wine, or champagne.{" "}
            </p>
            <p>3) Body parts which includes organs or other body parts. </p>
            <p>
              4) Bulk marketing tools which includes email lists, software, or
              other products enabling unsolicited email messages (spam).{" "}
            </p>
            <p>
              5) Cable descramblers and black boxes which includes devices
              intended to obtain cable and satellite signals for free.
            </p>
            <p>
              6) Child pornography which includes pornographic materials
              involving minors.{" "}
            </p>
            <p>
              7) Copyright unlocking devices which includes mod chips or other
              devices designed to circumvent copyright protection.{" "}
            </p>
            <p>
              8) Copyrighted media which includes unauthorized copies of books,
              music, movies, and other licensed or protected materials.
            </p>
            <p>
              9) Copyrighted software which includes unauthorized copies of
              software, video games and other licensed or protected materials,
              including OEM or bundled software.
            </p>
            <p>
              10) Counterfeit and unauthorized goods which includes replicas or
              imitations of designer goods; items without a celebrity
              endorsement that would normally require such an association, fake
              autographs, counterfeit stamps, and other potentially unauthorized
              goods.
            </p>
            <p>
              11) Drugs and drug paraphernalia which includes illegal drugs and
              drug accessories, including herbal drugs like salvia and magic
              mushrooms.
            </p>
            <p>
              12) Drug test circumvention aids which includes drug cleansing
              shakes, urine test additives, and related items.
            </p>
            <p>
              13) Endangered species which includes plants, animals or other
              organisms (including product derivatives) in danger of extinction.
            </p>
            <p>
              14) Gaming/gambling which includes lottery tickets, sports bets,
              memberships/ enrolment in online gambling sites, and related
              content.
            </p>
            <p>
              15) Government ids or documents which includes fake ids,
              passports, diplomas, and noble titles.
            </p>
            <p>
              16) Hacking and cracking materials which includes manuals, how-to
              guides, information, or equipment enabling illegal access to
              software, servers, watomites, or other protected property.
            </p>
            <p>
              17) Illegal goods which includes materials, products, or
              information promoting illegal goods or enabling illegal acts.
            </p>
            <p>
              18) Miracle cures which includes unsubstantiated cures, remedies
              or other items marketed as quick health fixes.
            </p>
            <p>
              19) Offensive goods which includes literature, products or other
              materials that: a) defame or slander any person or groups of
              people based on race, ethnicity, national origin, religion, sex,
              or other factors b) encourage or incite violent acts c) promote
              intolerance or hatred.
            </p>
            <p>
              20) Offensive goods, crime which includes crime scene photos or
              items, such as personal belongings, associated with criminals.
            </p>
            <p>
              21) Prescription drugs or herbal drugs or any kind of online
              pharmacies which includes drugs or other products requiring a
              prescription by a licensed medical practitioner.
            </p>
            <p>
              22) Pyrotechnic devices and hazardous materials which includes
              fireworks and related goods; toxic, flammable, and radioactive
              materials and substances.
            </p>
            <p>
              23) Regulated goods which includes air bags; batteries containing
              mercury; freon or similar substances/refrigerants,
              chemical/industrial solvents, government uniforms, car titles or
              logos, license plates, police badges and law enforcement
              equipment, lock- picking devices, pesticides; postage meters,
              recalled items, slot machines, surveillance equipment; goods
              regulated by government or other agency specifications.
            </p>
            <p>
              24) Securities, which includes stocks, bonds, or related financial
              products.
            </p>
            <p>
              25) Tobacco and cigarettes which includes cigarettes, cigars,
              chewing tobacco, and related products.{" "}
            </p>
            <p>
              26) Traffic devices which includes radar detectors/ jammers,
              license plate covers, traffic signal changers, and related
              products.
            </p>
            <p>
              27) Weapons which includes firearms, ammunition, knives, brass
              knuckles, gun parts, and other armaments.
            </p>
            <p>
              28) Wholesale currency which includes discounted currencies or
              currency exchanges.
            </p>
            <p>
              29) Live animals or hides/skins/teeth, nails and other parts etc
              of animals.
            </p>
            <p>30) Multi-level marketing collection fees.</p>
            <p>31) Matrix sites or sites using a matrix scheme approach.</p>
            <p>32) Work-at-home information.</p>
            <p>33) Drop-shipped merchandise.</p>
            <p>
              34) Any product or service which is not in compliance with all
              applicable laws and regulations whether federal, state, local or
              international including the laws of India.
            </p>
            <p>
              35) The merchant shall not sell, purchase, provide or exchange a
              cardholder’s name or Mastercard / visa account number information
              in any form obtained by reason of a Mastercard/ visa card
              transaction to any third party other than its Mastercard/ visa
              acquiring member-citrus pay, or pursuant to a government/statutory
              or competent body’s request.
            </p>
            <p>
              36) Pyrotechnic devices, combustibles, corrosives and hazardous
              materials which includes explosives, fireworks and related goods;
              toxic, flammable, and radioactive materials and substances
            </p>
            <p>
              37) Regulated goods which includes air bags; batteries containing
              mercury; freon or similar substances/refrigerants;
              chemical/industrial solvents; government uniforms; car titles;
              license plates; police badges and law enforcement equipment;
              lock-picking devices; pesticides; postage meters; recalled items;
              slot machines; surveillance equipment; goods regulated by
              government or other agency specifications Mylapay is a next
              generation merchant marketplace and payment gateway solution that
              helps Indian businesses collect and disburse payments via 100+
              payment methods including VISA, Mastercard, Rupay, UPI, IMPS,
              NEFT, Paytm &amp; other wallets, pay later and various EMI
              options.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTerms(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
