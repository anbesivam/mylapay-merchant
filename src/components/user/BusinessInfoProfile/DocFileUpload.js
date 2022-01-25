import FileUpload from "./FileUpload";

export default function DocFileUpload({ formik, itemName }) {
  const setFile = (e, elName) => {
    formik.setFieldValue(elName, e.currentTarget.files[0]);
  };

  return (
    <>
      <FileUpload
        id={itemName}
        name={itemName}
        value={formik.values[itemName]}
        setfile={setFile}
        error={formik.touched[itemName] && Boolean(formik.errors[itemName])}
        helperText={formik.touched[itemName] && formik.errors[itemName]}
      />
    </>
  );
}
