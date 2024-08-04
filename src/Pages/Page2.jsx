import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, Button, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Grid, Modal, Box } from '@mui/material';
import { CameraAlt, Upload, Delete } from '@mui/icons-material';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

const Page2 = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [savedImages, setSavedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  // Toggle camera function
  const toggleCamera = async () => {
    if (cameraActive) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      } catch (err) {
        console.error('Error accessing the camera:', err);
      }
    }
  };

  // Capture image from video stream
  const captureImage = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    setImageUrl(canvasRef.current.toDataURL('image/png'));
  };

  // Save image to Firebase
  const saveImage = async () => {
    if (!fileName || !patientName) {
      alert('Please enter a file name and patient name.');
      return;
    }

    try {
      const fileRef = ref(storage, `images/${fileName}-${Date.now()}.png`);
      const imageData = imageUrl || await readFileData(selectedFile);
      await uploadBytes(fileRef, imageData, 'data_url'); 
      const url = await getDownloadURL(fileRef);

      const newImage = { fileName, patientName, url, storagePath: fileRef.fullPath };
      const docRef = await addDoc(collection(db, 'images'), newImage);
      setSavedImages(prev => [...prev, { id: docRef.id, ...newImage }]);

      setImageUrl(null);
      setSelectedFile(null);
      setFileName('');
      setPatientName('');
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  // Read file data
  const readFileData = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file); 
  });

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  // Delete image from Firebase
  const deleteImage = async (id, storagePath) => {
    try {
      await deleteDoc(doc(db, 'images', id));
      await deleteObject(ref(storage, storagePath));
      setSavedImages(images => images.filter(image => image.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Fetch images from Firebase
  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'images'));
      setSavedImages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Filter images based on search term
  const searchImages = () => savedImages.filter(image =>
    image.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle opening and closing of modal
  const handleOpenModal = (url) => {
    setModalImage(url);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setModalImage('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom align="center">
          Medication Image
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color={cameraActive ? 'secondary' : 'primary'}
              onClick={toggleCamera}
              fullWidth
              startIcon={cameraActive ? <Delete /> : <CameraAlt />}
            >
              {cameraActive ? 'Stop Camera' : 'Start Camera'}
            </Button>
          </Grid>
          {cameraActive && (
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                color="secondary"
                onClick={captureImage}
                fullWidth
                startIcon={<CameraAlt />}
              >
                Capture Image
              </Button>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={4}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="file-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                color="primary"
                component="span"
                fullWidth
                startIcon={<Upload />}
              >
                Upload Image
              </Button>
            </label>
          </Grid>
        </Grid>
        <video ref={videoRef} width="100%" height="auto" autoPlay style={{ display: cameraActive ? 'block' : 'none' }}></video>
        <canvas ref={canvasRef} width="100%" height="auto" style={{ display: 'none' }}></canvas>
        <TextField
          label="File Name"
          variant="outlined"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Patient Name"
          variant="outlined"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          fullWidth
          margin="normal"
        />
        {imageUrl && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <img src={imageUrl} alt="Captured" style={{ maxWidth: '100%', maxHeight: '400px' }} onClick={() => handleOpenModal(imageUrl)} />
          </div>
        )}
        {(imageUrl || selectedFile) && (
          <Button variant="contained" color="primary" onClick={saveImage} fullWidth>
            Save Image
          </Button>
        )}
        <TextField
          label="Search Images"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchImages().map((image) => (
                <TableRow key={image.id}>
                  <TableCell>{image.fileName}</TableCell>
                  <TableCell>
                    <img src={image.url} alt={image.fileName} style={{ maxWidth: '100px', maxHeight: '100px' }} onClick={() => handleOpenModal(image.url)} />
                  </TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => deleteImage(image.id, image.storagePath)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal open={open} onClose={handleCloseModal}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <img src={modalImage} alt="Modal" style={{ maxWidth: '90%', maxHeight: '90%' }} />
          </Box>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default Page2;
