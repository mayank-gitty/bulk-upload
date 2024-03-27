import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";

function BulkUpload() {
  const [fileData, setFileData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [mappedFields, setMappedFields] = useState({});
  const [jsonData, setJsonData] = useState(null);
  const [showScreen1, setshowScreen1] = useState(false);

  const [showScreen2, setshowScreen2] = useState(false);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setFileData(parsedData);

      console.log('mko',parsedData[0])

      setHeaders(parsedData[0]);
      autoMapFields(parsedData[0]);
   
      setshowScreen1(true);

    };

    reader.readAsArrayBuffer(file);
  };

  const autoMapFields = () => {
    // Implement auto-mapping logic here
    // For demonstration purposes, just map the first header to the first field

    console.log('headers',headers)

    console.log("autoMapFields,", autoMapFields);
    

    const autoMappedFields = {};
    headers.forEach((header, index) => {
      autoMappedFields[header] = `field${index + 1}`;
    });

      console.log('mappedFields',autoMappedFields)

    setMappedFields(autoMappedFields);
  };

  const handleManualMapping = (fieldName, header) => {
    // Manually map headers to fields
    const updatedMappedFields = { ...mappedFields, [fieldName]: header };
    setMappedFields(updatedMappedFields);
  };

  const convertToJSON = () => {
    const json = fileData.slice(1).map((row) => {
      const rowData = {};
      headers.forEach((header, index) => {
        const fieldName = mappedFields[header] || header;
        rowData[fieldName] = row[index];
      });
      return rowData;
    });

    setJsonData(json);

    console.log("json data", json);
  };

  const handleFieldChange = (fieldName, header) => {

     console.log('fn',fieldName,header)

    const updatedMappedFields = { ...mappedFields, [fieldName]: header };

    setMappedFields(updatedMappedFields);

    console.log('km',updatedMappedFields)

    convertToJSON();


  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  console.log('hs',headers)

  console.log('mf',mappedFields)

  return (
    <div>
      {!showScreen1 && (
        <div {...getRootProps()} className="react-upload-feature">
          <input {...getInputProps()} />
          <p>Drag 'n' drop a file here, or click to select file</p>
        </div>
      )}

      { headers && !showScreen2 && fileData  && (
        <div>

          <h3>Headers:</h3>
          
          <ul>
            { headers.map((header) => (
              <li className="list-item" key={header}>
                { header}
                <span className="list-key-item"> {header} </span>
                <select
                  onChange={(e) => handleFieldChange(e.target.value, header)}
                >
                  <option value={header} >--Select Field--</option>
                  {/* Option to manually map headers to fields */}
                  {Object.values(headers).map((fieldName) => (

                    <option key={fieldName} value={fieldName}>
                        
                      {fieldName}   

                    </option>

                  ))}
                  {/* Add more options as needed */}
                </select>
              </li>
            ))}
          </ul>

          <button className="btn btn-primary" onClick={convertToJSON}>
            upload 
          </button>

          {/* <button onClick={autoMapFields
        }> auto map </button> */}


        </div>
      )}

      {jsonData && (
        <div className="mt-4">
          {/* <h3>JSON Data:</h3> */}
          {/* <pre>{JSON.stringify(jsonData, null, 2)}</pre> */}

          <table class="table">
            <thead>
              <tr>
                <th scope="col">first name</th>
                <th scope="col">last name</th>
        
                <th scope="col">company name</th>
                <th scope="col">address</th>
                <th scope="col">city</th>
                <th scope="col">country</th>
                <th scope="col">state</th>
                <th scope="col">zip</th>
                <th scope="col">phone1</th>
                <th scope="col">phone</th>
                <th scope="col">email</th>
              </tr>
            </thead>
            <tbody>
              {jsonData.map((item, key) => {
                return (
                  <tr key={key}>
                    <td> {item?.first_name} </td>
                    <td> {item?.last_name} </td>
                    <td> {item?.company_name} </td>
                    <td> {item?.address} </td>
                    <td> {item?.city} </td>
                    <td> {item?.county} </td>
                    <td> {item?.state} </td>
                    <td> {item?.zip} </td>
                    <td> {item?.phone1} </td>
                    <td> {item?.phone} </td>
                    <td> {item?.email} </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BulkUpload;
