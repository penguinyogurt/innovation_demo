
'use client'
import Image from 'next/image'
import {useState,useEffect, useRef} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button} from '@mui/material'
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore'
import {Form, InputGroup} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
//import fs from "fs"
import {Camera} from "react-camera-pro"
//import {genResp} from './ai.js'
//import {genContent} from './gemini.js'
import Link from 'next/link'


export default function Home() {
  //const camera = useRef(null)
  //const [showCamera, setShowCamera] = useState(false)
  const [image, setImage] = useState(null)

  const [pic, setPic] = useState('')
  const [picName, setPicName] = useState(false)

  const [airesp, setAIResp] = useState(false)
  const [respText, setRespText] = useState('')

  const [photos, setPhoto] = useState([])
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [search, setSearch] = useState('')
  const [openRemove, setOpenRemove] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState('lightblue')

  
  const updatePhotos = async () => {
    const snapshot = query(collection(firestore, 'photos'))
    const docs = await getDocs(snapshot)
    const photosList = []
    docs.forEach((doc) => {
      photosList.push({
        name: doc.id,
        ...doc.data(),
      }
      )
    })
    setPhoto(photosList)
  }

  //update inv function
  const updateInventory = async () => {
    const snapshot = query(collection(firestore,'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) =>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }
  //remove function
  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1},{merge: true})
      }
    }
    await updateInventory()
  }
  //add function
  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
        await setDoc(docRef, {quantity: quantity + 1}, {merge: true})
    }
    else{
      await setDoc(docRef, {quantity: 1},{merge:true})
    }
    await updateInventory()
  }

  //add img
  const addPic = async (img) =>{
    const docRef = doc(collection(firestore, 'photos'), img)
    const docSnap = await getDoc(docRef)
    await setDoc(docRef, {base64: image},{merge:true})
    
    await updatePhotos()
  }
  //remove all function
  const removeAllItems = async () =>{
    const docRef = collection(firestore, 'inventory')
    const docSnap = await getDocs(docRef)

    const deletePromises = docSnap.docs.map((doc) => deleteDoc(doc.ref))

    await Promise.all(deletePromises)

    await updateInventory()
  }

  useEffect(() =>{
    updateInventory()
    }, [] //dependency array, empty array means only runs once: when page loads
  )

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleRemoveOpen = () => setOpenRemove(true)
  const handleRemoveClose = () => setOpenRemove(false)
  
  const handlePicOpen = () => setPicName(true)
  const handlePicClose = () => setPicName(false)

  const handleAIRespOpen = () => setAIResp(true)
  const handleAIRespClose = () => setAIResp(false)

  /*
  const handlePhotoTaken = async () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setImage(photo);
      setShowCamera(false); // Hide the camera after taking a photo
      handlePicOpen()
      
      
      const response = await fetch('/api/gen',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify({img: image}),
        body: image,
      })
      //const data = await response.json()
      setRespText(await response.json())
      console.log("text:",respText)
      //handleAIRespOpen()
      //console.log(data)
    }
  };

  const openCamera = () => {
    setShowCamera(true);
  };
  */



/*
  useEffect(() => {
    if (showCamera && camera.current) {
      // Any additional actions when the camera is shown
      console.log('Camera is open');
    }
  }, [showCamera]);
  */
 
  return (
    <Box 
      width = "100vw" 
      height = "100vh" 
      display = "flex" 
      flexDirection="column"
      justifyContent = "center" 
      alignItems = "center"
      gap = {2}
    //   style = {{
    //     backgroundImage: 'url(https://www.parcelandpostaltechnologyinternational.com/wp-content/uploads/2023/12/Dematic_Radial-2-1200x800.jpg)',
    //     backgroundSize: 'cover',
    //     backgroundRepeat: 'no-repeat',
    //   }}
    >
      <Modal open = {airesp} onClose ={handleAIRespClose}>
        <Box
        position = "absolute" 
        //"centered"
        top = "50%" 
        left = "50%"  
        //truly centered
        //transform = "translate(-50%,-50%)"
        width = {400}
        bgcolor = "white"
        border = "2px solid #000"
        boxShadow = {24}
        p = {4}
        display = "flex"
        flexDirection = "column"
        gap = {3}
        sx = {{
          transform: 'translate(-50%,-50%)',
        }}
        >
          <Typography variant="h6">Image Analysis:</Typography>
          <Typography variant="h6">{respText}</Typography>


        </Box>
      </Modal>

      <Modal open = {picName} onClose = {handlePicClose}>
      <Box 
        position = "absolute" 
        //"centered"
        top = "50%" 
        left = "50%"  
        //truly centered
        //transform = "translate(-50%,-50%)"
        width = {400}
        bgcolor = "white"
        border = "2px solid #000"
        boxShadow = {24}
        p = {4}
        display = "flex"
        flexDirection = "column"
        gap = {3}
        sx = {{
          transform: 'translate(-50%,-50%)',
        }}
        >
          <Typography variant="h6">Name your picture</Typography>
          <Stack width = "100%" direction = "row" spacing = {2}>
            <TextField 
            variant = 'outlined' 
            fullWidth 
            value = {pic}
            onChange = {(e) => {
              setPic(e.target.value)
            }}
            >
            </TextField>
            <Button 
            variant = "outlined"
            onClick = {()=>{
              addPic(pic)
              setPic('')
              handlePicClose()
              handleAIRespOpen()
            }}
            >
              Done
            </Button>
          </Stack>

        </Box>
      </Modal>

      <Modal open = {openRemove} onClose = {handleRemoveClose}>
      <Box 
        position = "absolute" 
        //"centered"
        top = "50%" 
        left = "50%"  
        //truly centered
        //transform = "translate(-50%,-50%)"
        width = {400}
        bgcolor = "white"
        border = "2px solid #000"
        boxShadow = {24}
        p = {4}
        display = "flex"
        flexDirection = "column"
        gap = {3}
        sx = {{
          transform: 'translate(-50%,-50%)',
        }}
        >
          <Typography variant="h6">Confirm remove all items?</Typography>
          <Stack width = "100%" direction = "row" 
          spacing = {2} display = "flex" alignItems = "center" justifyContent = "center">
            <Button
            variant = "outlined"
            onClick = {()=>{
              removeAllItems()
              handleRemoveClose()
            }}>
              Yes
            </Button>
            <Button 
            variant = "outlined"

            onClick = {()=>{
              handleRemoveClose()
            }}
            >
              No
            </Button>
          </Stack>

        </Box>
      </Modal>

      <Modal open = {open} onClose = {handleClose}>
        <Box 
        position = "absolute" 
        //"centered"
        top = "50%" 
        left = "50%"  
        //truly centered
        //transform = "translate(-50%,-50%)"
        width = {400}
        bgcolor = "white"
        border = "2px solid #000"
        boxShadow = {24}
        p = {4}
        display = "flex"
        flexDirection = "column"
        gap = {3}
        sx = {{
          transform: 'translate(-50%,-50%)',
        }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width = "100%" direction = "row" spacing = {2}>
            <TextField 
            variant = 'outlined' 
            fullWidth 
            value = {itemName}
            onChange = {(e) => {
              setItemName(e.target.value)
            }}
            >
            </TextField>
            <Button 
            variant = "outlined"
            onClick = {()=>{
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
            >
              Add
            </Button>
          </Stack>

        </Box>
      </Modal>
      
      <Box 
        width = "800px" 
        height = "100px" 
        bgcolor = "ADD8E6"
        display = "flex"
        alignItems= "center"
        justifyContent = "center">
          <Typography variant = "h2" color = "#FFF01F">
            Warehouse Search
          </Typography>
      </Box>
      <Stack
        display = "flex"
        alignItems = "center"
        justifyContent = "space-between"
        direction = "row"
        spacing = {20}
      >
        <Button variant = "contained" style ={{backgroundColor: "#3DB541"}} onClick = {()=>{
          handleOpen()
        }}>
          Add New Item
        </Button>
        
        {/* <Button onClick = {() =>{
          {openCamera()}
        }}>
          Camera
        </Button>
        {showCamera && (<div> <Camera ref = {camera} style={{
          width: '100%',
          height:'100vh',
          textAlign: 'center'
        }}></Camera> 
        <Button onClick={handlePhotoTaken}>Take Photo</Button></div>)} */}
        

        <Button variant = "contained" onClick = {()=>{
          handleRemoveOpen()
        }}>
          Remove All
        </Button>

      </Stack>
      
      <Box width = "500px" height = "auto">
      <Form>
        <InputGroup>
          <Form.Control 
            onChange = {(e)=> setSearch(e.target.value)}
            placeholder = "Search for a part"
            />
        </InputGroup>
      </Form>
      </Box>
      
      <Box border = "3px solid #cfc46d" 
      width = "1200px" 
      height = "auto"

      style = {{
        backgroundImage: 'url(https://tse2.mm.bing.net/th/id/OIP.9tXWOz32JObN3aVicx731gHaEV?r=0&rs=1&pid=ImgDetMain&o=7&rm=3)',
        //backgroundImage: 'url(https://i.pinimg.com/originals/48/c8/cc/48c8cc251691667539077e3bfc14f537.jpg)',
        //backgroundImage: 'url(https://i.pinimg.com/originals/10/da/9b/10da9b07fe10a8aea6bcb44cf1c8f453.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        
      
      }}>
        <Stack direction = "row">
        <Box
        display = "flex"
        alignItems = "center"
        justifyContent = "center"
        padding = "30px"
        
        >
          
          <Typography 
              variance = "h3" 
              color = "black" 
              textAlign="center"
              fontSize="25px"
              fontFamily= "Verdana"
              fontWeight = "450"
              
          >items</Typography>
          </Box>
          <Box
          display = "flex"
          alignItems = "center"
          justifyContent="center"
          margin="0 auto"
          >
          <Typography 
              variance = "h3" 
              color = "black" 
              textAlign="center"
              fontSize = "25px"
              fontFamily= "Verdana"
              fontWeight = "450"
              marginLeft="-200px"
          >amount</Typography>
        

        </Box>
        </Stack>
      <Stack 
      width = "1100px" 
      height = "300px" 
      spacing = {2} 
      overflow = "auto" //how to see extra items, can hide with "hidden"
      
      >
        
        {
          inventory.filter((item)=>{ //search
            return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search)
          }).map(({name, quantity})=>(
            <Box 
            key = {name}
            width = "100%"
            minHeight = "150px"
            display = "flex"
            alignItems = "center"
            justifyContent = "space-between"
            padding = {3}
            
            >
              <Typography 
              variance = "h3" 
              color = "#061201" 
              textAlign="center"
              style = {{
                fontFamily: "Verdana",
                fontWeight: "450",
                fontSize: "35px",
              }}
              
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography 
              variance = "h3" 
              color = "#061201" 
              textAlign="center"
              style = {{
                fontFamily: "Verdana",
                fontWeight: "450",
                fontSize: "35px",
              }}
              >
                {quantity}
              </Typography>
              <Stack direction = "row" spacing = {2}>
              <Button 
              variant = "contained"
              style ={{
                //backgroundColor: "#3DB541",
                backgroundColor: "transparent",
                color: "#3DB541",
                fontFamily: "Courier New",
                border: "2px outset #3DB541",
                fontWeight: "900"
              }}
              onClick = {() =>{
                addItem(name)
              }}>
                Add
              </Button>

              <Button 
              variant = "contained"
              style = {{
                //backgroundColor: "#E2574D"
                backgroundColor: "transparent",
                color: "#ed0d2d",
                fontFamily: "Courier New",
                border: "2px outset #ed0d2d",
                fontWeight: "900"

              }}
              onClick = {() =>{
                removeItem(name)
              }}>
                Remove
              </Button>
              </Stack>
            </Box>
          ))
        }

      </Stack>
      </Box>
    </Box>
  );
}
