import { FilePond,registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import { useState } from "react";
import { base64StringToBlob } from 'blob-util';
import { Typography, Box, Container, Button, TextField } from "@mui/material";
const EthCrypto = require('eth-crypto');
const CryptoJS = require("crypto-js");
registerPlugin(FilePondPluginFileEncode);



function Decrypt(){
    const [personalFiles,setPersonalFiles] = useState({});

    const savepatientKey = async (event) =>
    {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let patient_private_key = data.get('private_key').trim();
        let signed_encryption_key = data.get('signed_encryption_key').trim();
        let decryption_key = await EthCrypto.decryptWithPrivateKey(patient_private_key,signed_encryption_key);
        for(let personalFile in personalFiles['files'])
            {
                let val = personalFiles['files'][personalFile];
                let blob = await val.file.text();
                let dec = await CryptoJS.AES.decrypt(blob,decryption_key).toString(CryptoJS.enc.Utf8);
                blob = base64StringToBlob(dec,val.file.type);
                var csvURL = window.URL.createObjectURL(blob);
                let tempLink = document.createElement('a');
                tempLink.href = csvURL;
                tempLink.setAttribute('download', val.file.name);
                tempLink.click();
            }        
    }


    
    return (<div>
        <Typography variant="h3" color="inherit" component="div" align='center'>
                Patient Decryption Portal 
        </Typography>
         <FilePond onupdatefiles={(fileItems) => {
            setPersonalFiles({
            files: fileItems.map((fileItem) => fileItem)
        })
    }}></FilePond>
        <Container component="main" maxWidth="xs">
            <Box
            component="form" 
            onSubmit={savepatientKey}
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                <Typography variant="h6" color="inherit" component="div">
                Please input the patient's private key 
                </Typography>
                <TextField
                    id="private_key"
                    name="private_key"
                    label="Patient private Key"
                    sx={{ padding: 1}}
                />

<Typography variant="h6" color="inherit" component="div">
                Please input the transaction ID 
                </Typography>
                <TextField
                    id="signed_encryption_key"
                    name="signed_encryption_key"
                    label="Transaction meta data"
                    sx={{ padding: 1}}
                />
                <Button variant="contained" type="submit">Decrypt</Button>
        </Box>
    </Container>
    </div>)
}

export default Decrypt;