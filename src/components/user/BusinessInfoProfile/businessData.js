const businessData = [
  {
    name: "Individual",
    value: "individual",
    proof: [
      {
        type: "Merchant Personal ID Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "PAN Card",
            value: 1,
          },
        ],
      },
      {
        type: "Merchant Personal Address Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Passport",
            value: 1,
          },
          {
            label: "Election / Voter ID",
            value: 2,
          },
          {
            label: "Driving License",
            value: 3,
          },
          {
            label: "Aadhaar Card",
            value: 4,
          },
        ],
      },
      {
        type: "Business Address Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Telephone Bill (Not older than 3 months)",
            value: 1,
          },
          {
            label: "Internet Bill (Not older than 3 months)",
            value: 2,
          },
          {
            label: "Electricity Bill (Not older than 3 months)",
            value: 3,
          },
          {
            label: "Shop Agreement",
            value: 4,
          },
          {
            label: "Bank Statement (Not older than 3 months)",
            value: 5,
          },
        ],
      },
      {
        type: "Bank Statement",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Bank Statement (Last 3 Months)",
            value: 1,
          },
          {
            label: "Cancelled Cheque Leaf",
            value: 2,
          },
        ],
      },
    ],
  },
  {
    name: "Proprietoryship",
    value: "proprietoryship",
    proof: [
      {
        type: "Merchant Personal ID Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "PAN Card",
            value: 1,
          },
        ],
      },
      {
        type: "Merchant Personal Address Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Passport",
            value: 1,
          },
          {
            label: "Election / Voter ID",
            value: 2,
          },
          {
            label: "Driving License",
            value: 3,
          },
          {
            label: "Aadhaar Card",
            value: 4,
          },
        ],
      },
      {
        type: "Proprietory Company Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "GST Registration Certificate",
            value: 1,
          },
          {
            label: "Latest ITR Ack. of Sole Proprietor",
            value: 2,
          },
          {
            label: "Any Licence or Registration Certificates",
            value: 3,
          },
          {
            label: "Any copy of GST, TDS or PT filed",
            value: 4,
          },
        ],
      },
      {
        type: "Business Address Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Telephone Bill (Not older than 3 months)",
            value: 1,
          },
          {
            label: "Internet Bill (Not older than 3 months)",
            value: 2,
          },
          {
            label: "Electicity Bill (Not older than 3 months)",
            value: 3,
          },
          {
            label: "Shop Agreement",
            value: 4,
          },
          {
            label: "Bank Statement (Not older than 3 months)",
            value: 5,
          },
        ],
      },
      {
        type: "Bank Statement",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Bank Statement (Last 3 Months)",
            value: 1,
          },
          {
            label: "Cancelled Cheque Leaf",
            value: 2,
          },
        ],
      },
    ],
  },
  {
    name: "Partnership & LLP",
    value: "Partnership & LLP",
    proof: [
      {
        type: "Merchant Personal ID Proof (Partner 1)",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "PAN Card",
            value: 1,
            party: "Partner 1",
          },
        ],
      },
      {
        type: "Merchant Personal Address Proof (Partner 1)",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Passport",
            value: 1,
            party: "Partner 1",
          },
          {
            label: "Election / Voter ID",
            value: 2,
            party: "Partner 1",
          },
          {
            label: "Driving License",
            value: 3,
            party: "Partner 1",
          },
          {
            label: "Aadhaar Card",
            value: 4,
            party: "Partner 1",
          },
        ],
      },
      {
        type: "Merchant Personal ID Proof (Partner 2)",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "PAN Card",
            value: 1,
            party: "Partner 2",
          },
        ],
      },
      {
        type: "Merchant Personal Address Proof (Partner 2)",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Passport",
            value: 1,
            party: "Partner 2",
          },
          {
            label: "Election / Voter ID",
            value: 2,
            party: "Partner 2",
          },
          {
            label: "Driving License",
            value: 3,
            party: "Partner 2",
          },
          {
            label: "Aadhaar Card",
            value: 4,
            party: "Partner 2",
          },
        ],
      },
      {
        type: "Company Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "GST Registration Certificate",
            value: 1,
          },
          {
            label: "Latest ITR Ack. of Sole Proprietor",
            value: 2,
          },
          {
            label: "Any Licence or Registration Certificates",
            value: 3,
          },
          {
            label: "Any copy of GST, TDS or PT filed",
            value: 4,
          },
          {
            label: "Company PAN Card",
            value: 5,
          },
        ],
      },
      {
        type: "Business Address Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Telephone Bill (Not older than 3 months)",
            value: 1,
          },
          {
            label: "Internet Bill (Not older than 3 months)",
            value: 2,
          },
          {
            label: "Electicity Bill (Not older than 3 months)",
            value: 3,
          },
          {
            label: "Shop Agreement",
            value: 4,
          },
          {
            label: "Bank Statement (Not older than 3 months)",
            value: 5,
          },
        ],
      },
      {
        type: "Bank Statement",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Bank Statement (Last 3 Months)",
            value: 1,
          },
          {
            label: "Cancelled Cheque Leaf",
            value: 2,
          },
        ],
      },
    ],
  },
  {
    name: "Public or Pvt Ltd Comp",
    value: "publicorpvtltd",
    proof: [
      {
        type: "Merchant Personal ID Proof (Director 1)",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "PAN Card",
            value: 1,
            party: "Director 1",
          },
        ],
      },
      {
        type: "Merchant Personal Address Proof (Director 1)",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Passport",
            value: 1,
            party: "Director 1",
          },
          {
            label: "Election / Voter ID",
            value: 2,
            party: "Director 1",
          },
          {
            label: "Driving License",
            value: 3,
            party: "Director 1",
          },
          {
            label: "Aadhaar Card",
            value: 4,
            party: "Director 1",
          },
        ],
      },
      {
        type: "Merchant Personal ID Proof (Director 2)",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "PAN Card",
            value: 1,
            party: "Director 2",
          },
        ],
      },
      {
        type: "Merchant Personal Address Proof (Director 2)",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Passport",
            value: 1,
            party: "Director 2",
          },
          {
            label: "Election / Voter ID",
            value: 2,
            party: "Director 2",
          },
          {
            label: "Driving License",
            value: 3,
            party: "Director 2",
          },
          {
            label: "Aadhaar Card",
            value: 4,
            party: "Director 2",
          },
        ],
      },
      {
        type: "Company Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Company PAN Card",
            value: 1,
          },
          {
            label: "Board Resolution",
            value: 2,
          },
          {
            label: "Certificate of Incorporation",
            value: 3,
          },
          {
            label: "Commencement of Business",
            value: 4,
          },
          {
            label: "MOA & AOA",
            value: 5,
          },
          {
            label: "Form 32",
            value: 6,
          },
          {
            label: "Passport size photo",
            value: 7,
          },
        ],
      },
      {
        type: "Business Address Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Telephone Bill (Not older than 3 months)",
            value: 1,
          },
          {
            label: "Internet Bill (Not older than 3 months)",
            value: 2,
          },
          {
            label: "Electicity Bill (Not older than 3 months)",
            value: 3,
          },
          {
            label: "Shop Agreement",
            value: 4,
          },
          {
            label: "Bank Statement (Not older than 3 months)",
            value: 5,
          },
        ],
      },
      {
        type: "Bank Statement",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Bank Statement (Last 3 Months)",
            value: 1,
          },
          {
            label: "Cancelled Cheque Leaf",
            value: 2,
          },
        ],
      },
    ],
  },
  {
    name: "Trust or Society",
    value: "trustorsociety",
    proof: [
      {
        type: "Merchant Personal ID Proof (Trustee 1)",
        options: [
          {
            label: "Select Option",
            value: 0,
            party: "Trustee 1",
          },
          {
            label: "PAN Card",
            value: 1,
            party: "Trustee 1",
          },
        ],
      },
      {
        type: "Merchant Personal Address Proof (Trustee 1)",
        options: [
          {
            label: "Select Option",
            value: 0,
            party: "Trustee 1",
          },
          {
            label: "Passport",
            value: 1,
            party: "Trustee 1",
          },
          {
            label: "Election / Voter ID",
            value: 2,
            party: "Trustee 1",
          },
          {
            label: "Driving License",
            value: 3,
            party: "Trustee 1",
          },
          {
            label: "Aadhaar Card",
            value: 4,
            party: "Trustee 1",
          },
        ],
      },
      {
        type: "Merchant Personal ID Proof (Trustee 2)",
        options: [
          {
            label: "Select Option",
            value: 0,
            party: "Trustee 2",
          },
          {
            label: "PAN Card",
            value: 1,
            party: "Trustee 2",
          },
        ],
      },
      {
        type: "Merchant Personal Address Proof (Trustee 2)",
        options: [
          {
            label: "Select Option",
            value: 0,
            party: "Trustee 2",
          },
          {
            label: "Passport",
            value: 1,
            party: "Trustee 2",
          },
          {
            label: "Election / Voter ID",
            value: 2,
            party: "Trustee 2",
          },
          {
            label: "Driving License",
            value: 3,
            party: "Trustee 2",
          },
          {
            label: "Aadhaar Card",
            value: 4,
            party: "Trustee 2",
          },
        ],
      },
      {
        type: "Company Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Company PAN Card",
            value: 1,
          },
          {
            label: "Board Resolution",
            value: 2,
          },
          {
            label: "Certificate of Incorporation",
            value: 3,
          },
          {
            label: "Commencement of Business",
            value: 4,
          },
          {
            label: "MOA & AOA",
            value: 5,
          },
          {
            label: "Form 32",
            value: 6,
          },
          {
            label: "Passport size photo",
            value: 7,
          },
        ],
      },
      {
        type: "Business Address Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Telephone Bill (Not older than 3 months)",
            value: 1,
          },
          {
            label: "Internet Bill (Not older than 3 months)",
            value: 2,
          },
          {
            label: "Electicity Bill (Not older than 3 months)",
            value: 3,
          },
          {
            label: "Shop Agreement",
            value: 4,
          },
          {
            label: "Bank Statement (Not older than 3 months)",
            value: 5,
          },
        ],
      },
      {
        type: "Bank Statement",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Bank Statement (Last 3 Months)",
            value: 1,
          },
          {
            label: "Cancelled Cheque Leaf",
            value: 2,
          },
        ],
      },
    ],
  },
  {
    name: "Tempraruary Req. for Mela",
    value: "tempruary_req_mela",
    proof: [
      {
        type: "Merchant Personal ID Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "PAN Card",
            value: 1,
          },
        ],
      },
      {
        type: "Merchant Personal Address Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Passport",
            value: 1,
          },
          {
            label: "Election / Voter ID",
            value: 2,
          },
          {
            label: "Driving License",
            value: 3,
          },
          {
            label: "Aadhaar Card",
            value: 4,
          },
        ],
      },
      {
        type: "Business Address Proof",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Telephone Bill (Not older than 3 months)",
            value: 1,
          },
          {
            label: "Internet Bill (Not older than 3 months)",
            value: 2,
          },
          {
            label: "Electicity Bill (Not older than 3 months)",
            value: 3,
          },
          {
            label: "Shop Agreement",
            value: 4,
          },
          {
            label: "Bank Statement (Not older than 3 months)",
            value: 5,
          },
        ],
      },
      {
        type: "Bank Statement",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Bank Statement (Last 3 Months)",
            value: 1,
          },
          {
            label: "Cancelled Cheque Leaf",
            value: 2,
          },
        ],
      },
      {
        type: "Letter of Req. from Authorized Person",
        options: [
          {
            label: "Select Option",
            value: 0,
          },
          {
            label: "Letter of Req. from Authorized Person",
            value: 1,
          },
        ],
      },
    ],
  },
];

export default businessData;
