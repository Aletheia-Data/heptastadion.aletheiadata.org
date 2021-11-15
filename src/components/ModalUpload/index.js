import React, {useMemo} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import {useDropzone} from 'react-dropzone';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import './style.css';

const axios = require('axios');

const customStyles = {
  content: { 
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default ({ wallet, departments }) => {

  let [walletDisclaimer, setWalletDisclaimer] = React.useState(false);
  let [isWalletDiscValid, setWalletDiscValid] = React.useState(true);

  let [uploadSent, setUploadSent] = React.useState(false);
  
  const [modalIsOpen, setIsOpen] = React.useState(false);

  let [fileUpload, setUpload] = React.useState('');
  let [fileScreenshot, setScreenshot] = React.useState('');

  let [fileUploadError, setUploadError] = React.useState('');
  let [fileUploadErrorMessage, setUploadErrorMessage] = React.useState('');
  
  let [fileScreenshotError, setScreenshotError] = React.useState('');
  let [fileScreenshotMessage, setScreenshotMessage] = React.useState('');

  let [departmentSelect, setDepartmentSelect] = React.useState('');
  let [fileType, setFileType] = React.useState('');

  let [title, setTitle] = React.useState('');
  let [description, setDescription] = React.useState('');
  let [source, setSource] = React.useState('');

  let [isTitleValid, setTitleValid] = React.useState(true);
  let [isDescValid, setDescValid] = React.useState(true);
  let [isSourceValid, setSourceValid] = React.useState(true);
  let [isDepartmentValid, setDepartmentValid] = React.useState(true);
  let [isTypeValid, setTypeValid] = React.useState(true);

  let [isUploadValid, setUploadValid] = React.useState(true);
  let [isScreenshotValid, setScreenshotValid] = React.useState(true);

  let [isLoading, setLoading] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
  }

  function closeModal() {
    setUpload('');
    setScreenshot('');
    setUploadError('');
    setUploadErrorMessage('');
    setScreenshotError('');
    setScreenshotMessage('');
    setDepartmentSelect('');
    setFileType('');
    setTitle('');
    setDescription('');
    setSource('');
    setTitleValid(true);
    setDescValid(true);
    setSourceValid(true);
    setDepartmentValid(true);
    setTypeValid(true);
    setUploadValid(true);
    setScreenshotValid(true);
    setLoading(false);
    setIsOpen(false);
    setUploadSent(false);
  }

  function submit() {
    
    if (!fileUpload) setUploadValid(false);

    if (!title) setTitleValid(false);

    if (!description) setDescValid(false);

    if (!source) setSourceValid(false);

    var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    var regex = new RegExp(expression);
    if (!source.match(regex)) {
      setSourceValid(false);
    }

    if (!departmentSelect) setDepartmentValid(false);

    if (!fileType) setTypeValid(false);
    
    if (!fileScreenshot) setScreenshotValid(false);

    if (!walletDisclaimer) setWalletDiscValid(false);

    const data = {
      title,
      description,
      source,
      departmentSelect,
      fileType,
      fileUpload,
      fileScreenshot,
      walletDisclaimer
    }

    if(
      isTitleValid &&
      isDescValid &&
      isSourceValid &&
      isDepartmentValid &&
      isTypeValid &&
      isUploadValid &&
      isScreenshotValid &&
      walletDisclaimer
    ){

      console.log('success: : ', data, wallet);
      setLoading(true);

      axios.post('https://aletheia-alexandria.herokuapp.com/alexandrias', {
        "title": data.title,
        "description": data.description,
        "source_url": data.source,
        "status": "under_review",
        "department": data.departmentSelect,
        "type": data.fileType,
        "wallet_address": wallet,
        "api_enabled": false
      })
      .then(function (response) {
        console.log(response);

        const item_id = response.data.id;
        
        const dataForm = new FormData()
        dataForm.append('files', data.fileUpload);
        dataForm.append('ref', 'alexandria');
        dataForm.append('refId', item_id);
        dataForm.append('field', 'file');

        axios.post ("https://aletheia-alexandria.herokuapp.com/upload",
        dataForm,
        {
          headers: {
              'Content-Type': 'multipart/form-data',
          }
        }).then(function (upload) {

          console.log('uploaded file', upload);

          const screenForm = new FormData()
          screenForm.append('files', data.fileScreenshot);
          screenForm.append('ref', 'alexandria');
          screenForm.append('refId', item_id);
          screenForm.append('field', 'proof');
          
          axios.post ("https://aletheia-alexandria.herokuapp.com/upload",
          screenForm,
          {
              headers: {
                  'Content-Type': 'multipart/form-data',
              }
          }).then(function (response) {
            const screenUploaded = response.data[0];

            console.log('uploaded screenshot', screenUploaded);

            setLoading(false);

            setUploadSent(true);
            
          }).catch(function (error) {
            console.log(error);
            setLoading(false);
          });
        
        }).catch(function (error) {
          console.log(error);
          setLoading(false);
        });
        
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });

    } else {
      console.log('error: ', data);
      setLoading(false);
    }
  }

  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const activeStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };

  function UploadFile (props) {
    const {
      getRootProps,
      getInputProps,
      acceptedFiles,
      fileRejections,
      isDragActive,
      isDragAccept,
      isDragReject
    } = useDropzone({
      accept: 'text/csv, application/pdf, .xlsx, application/json, .txt'
    });
  
    const style = useMemo(() => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }), [
      isDragActive,
      isDragReject,
      isDragAccept
    ]);
  
    const acceptedFileItems = acceptedFiles.map(file => {
      
      setUpload(file);
      setUploadValid(true);
      setUploadError(false);
      setUploadErrorMessage('');

      return (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      )
    });
  
    const fileRejectionItems = fileRejections.map(({ file, errors }) => {
      
      setUpload(file);
      setUploadValid(false);
      setUploadError(true);
      setUploadErrorMessage(errors);

      return (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            { 
              errors.map(e => {
                
                return (
                  <li key={e.code}>Message: {e.message}</li>
                )
              })
            }
          </ul>
        </li>
      )
    });

    // console.log(fileUpload, isUploadValid);

    return (
      <section className="container">
        <div {...getRootProps({ style, className: `dropzone ${fileUploadError ? 'error' : ''}` })}>
          <input {...getInputProps()} />
          {
            !fileUpload &&
            <div>
              <p>Archivo que decea compartir</p>
              <em>(Solo se aceptarán archivos integrales de fuentes verificables y oficiales)</em>
            </div>
          }
          {
            fileUpload && !fileUploadError &&
            <div>
              <p>File Uploaded</p>
              <div>
                <h4>Accepted files</h4>
                <ul>
                  <li key={fileUpload.path}>
                    {fileUpload.path} - {fileUpload.size} bytes
                  </li>
                </ul>
              </div>
            </div>
          }
          {
            fileUploadError &&
            <div>
              <p>Uploading Failed</p>
              <div>
                <h4>Rejected files</h4>
                <ul>
                  <li key={fileUpload.path}>
                    {fileUpload.path} - {fileUpload.size} bytes
                  </li>
                </ul>
                { 
                  fileUploadErrorMessage.map(e => {
                    return (
                      <p key={e.code}>{e.message}</p>
                    )
                  })
                }
              </div>
            </div>
          }
        </div>
      </section>
    );  
  }

  function UploadProof (props) {
    const {
      getRootProps,
      getInputProps,
      acceptedFiles,
      fileRejections,
      isDragActive,
      isDragAccept,
      isDragReject
    } = useDropzone({
      accept: 'image/jpeg, image/jpg, image/png'
    });
  
    const style = useMemo(() => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }), [
      isDragActive,
      isDragReject,
      isDragAccept
    ]);
  
    const acceptedFileItems = acceptedFiles.map(file => {
      
      setScreenshot(file);
      setScreenshotValid(true);
      setScreenshotError(false);
      setScreenshotMessage('');

      return (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      )
    });
  
    const fileRejectionItems = fileRejections.map(({ file, errors }) => {
      
      setScreenshot(file);
      setScreenshotValid(false);
      setScreenshotError(true);
      setScreenshotMessage(errors);

      return (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            { 
              errors.map(e => {
                
                return (
                  <li key={e.code}>Message: {e.message}</li>
                )
              })
            }
          </ul>
        </li>
      )
    });

    // console.log(fileScreenshot, isScreenshotValid);

    return (
      <section className="container">
        <div {...getRootProps({ style, className: `dropzone ${fileScreenshotError ? 'error' : ''}` })}>
          <input {...getInputProps()} />
          {
            !fileScreenshot &&
            <div>
              <p>Screenshot de la fuente</p>
              <em>(Solo se aceptarán imágenes * .jpeg y * .png - asegurate que se vea el dia y la hora)</em>
            </div>
          }
          {
            fileScreenshot && !fileScreenshotError &&
            <div>
              <p>File Uploaded</p>
              <div>
                <h4>Accepted files</h4>
                <ul>
                  <li key={fileScreenshot.path}>
                    {fileScreenshot.path} - {fileScreenshot.size} bytes
                  </li>
                </ul>
              </div>
            </div>
          }
          {
            fileScreenshotError &&
            <div>
              <p>Uploading Failed</p>
              <div>
                <h4>Rejected files</h4>
                <ul>
                  <li key={fileScreenshot.path}>
                    {fileScreenshot.path} - {fileScreenshot.size} bytes
                  </li>
                </ul>
                { 
                  fileScreenshotMessage.map(e => {
                    
                    return (
                      <p key={e.code}>{e.message}</p>
                    )
                  })
                }
              </div>
            </div>
          }
        </div>
      </section>
    );  
  }

  const handleChange = (event) => {

    if (event.target.name == "upload_department"){
      setDepartmentValid(true);
      setDepartmentSelect(event.target.value);
    }

    if (event.target.name == "upload_type"){
      setTypeValid(true);
      setFileType(event.target.value);
    }
    
  };

  return (
    <div id="modal">
      <button onClick={openModal} title="Rewards coming soon!" className="connect-btn">
        Cargar Archivo
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Upload Modal"
      >

        {
          !uploadSent &&
          <div>

            <UploadFile valid={ isUploadValid } />

            <br />

            <div className="modal-close" onClick={closeModal}>
              <img src="assets/img/icons/close.png" />
            </div>

            <FormGroup className="upload-form">
              
              <TextField 
                id="title" 
                label="Titulo" 
                error={ !isTitleValid } 
                variant="filled" 
                helperText="Ingrese el título del documento" 
                value={title}
                onChange={(e)=>{
                  setTitleValid(true);
                  setTitle(e.target.value);
                }}
              />

              <TextField 
                id="description" 
                label="Descripcion" 
                error={ !isDescValid } 
                variant="filled" 
                helperText="Ingrese una breve descripción del documento" 
                multiline
                maxRows={4}
                value={description}
                onChange={(e)=>{
                  setDescValid(true);
                  setDescription(e.target.value)
                }}
              />

              <TextField 
                id="source" 
                label="Fuente" 
                error={ !isSourceValid } 
                type="url"
                placeholder="https://example.com"
                size="30"
                variant="filled" 
                helperText="Ingrese aqui la fuente (URL) del documento" 
                value={source}
                onChange={(e)=>{
                  setSourceValid(true);
                  setSource(e.target.value)
                }}
              />

              <FormControl>
                <Select
                  labelId="upload_department"
                  name="upload_department"
                  error={ !isDepartmentValid }
                  value={departmentSelect}
                  onChange={handleChange}
                  variant="filled"
                  label={"Department"}
                >
                  {
                    departments.map((department, i) => {
                      return(
                        <MenuItem key={`department_${i}`} value={department.id}>{department.name}</MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText>Seleccione el ministerio</FormHelperText>
              </FormControl>

              <FormControl>
                <Select
                  labelId="upload_type"
                  name="upload_type"
                  value={fileType}
                  error={ !isTypeValid }
                  onChange={handleChange}
                  variant="filled"
                  label={"Tipo de Archivo"}
                >
                  <MenuItem value={'csv'}>{'CSV'}</MenuItem>
                  <MenuItem value={'pdf'}>{'PDF'}</MenuItem>
                  <MenuItem value={'xls'}>{'XLS'}</MenuItem>
                </Select>
                <FormHelperText>Seleccione el formato del archivo</FormHelperText>
              </FormControl>

              <br />

              <UploadProof valid={ isScreenshotValid } />

              <br /><br />

              <p>Wallet Information</p>

              <TextField 
                id="wallet-address" 
                label={'Wallet Address'} 
                value={wallet}
                variant="filled" 
                disabled 
              />
              
              <FormControlLabel className={ isWalletDiscValid ? 'valid' : 'error' } control={<Checkbox value={walletDisclaimer} onChange={()=>{
                  setWalletDiscValid(!walletDisclaimer);
                  setWalletDisclaimer(!walletDisclaimer)
                }} />} label="Confirmo que es dirección de Wallet. Acepto que no podré cambiarlo en el futuro." />


            </FormGroup>


            <div>
              <button disabled={ isLoading } className="submitButton" onClick={submit}>{ isLoading ? 'Uploading...' : 'Submit' }</button>
            </div>  

          </div>
        }

        {
          uploadSent &&
          <div className="file-uploaded">

            <p>Thank you!</p>

            <p>Your Address Wallet has being recorded. <br />Your document is under review 🤖</p>
            
            <div>
              <button className="closeButton" onClick={closeModal}>Close</button>
            </div>  

          
          </div>
        }

      </Modal>
    </div>
  );
}