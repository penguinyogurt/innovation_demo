import {NextResponse} from 'next/server'
// import express from 'express' 
// const app = express()
//import bodyParser from 'body-parser'

//app.use(bodyParser.json())
import fs from 'fs'
import { google } from "googleapis";
import stream from 'stream'
import {GoogleAIFileManager} from "@google/generative-ai/server"

const { Buffer } = require("node:buffer");
const dotenv = require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GENAI_DISCOVERY_URL = `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta&key=${process.env.REACT_APP_GOOGLE_GENERATIVE_AI_API_KEY}`
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// app.post('/api/gen', async (req,res) => {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const prompt = "Describe this image"
//     const {img} = req.body
//     const result = await model.generateContent([prompt, ...img])
//     const response = await result.text()
//     res.json({text: response})
// })
export async function POST(req,res){
    try{
        const img = await req.text()
 
    const mimeType = "image/jpeg"
    //const fileBlob = base64ToBlob(b64, mimeType)
    const buffFile = Buffer.from(img.split(",")[1], 'base64')
    const type = img.split(",")[0].split(":")[1].split(";")[0]

    const fileManager = new GoogleAIFileManager(process.env.REACT_APP_GOOGLE_GENERATIVE_AI_API_KEY)
    //fs.writeFileSync('data.'+type, buffFile)
    fs.writeFileSync('example.jpg',buffFile)

    const uploadResponse = await fileManager.uploadFile('example.jpg', {
        mimeType: mimeType,
        displayName: "Image from data URI",
    });
    //const uploadResp = await fileManager.uploadFile()
    const result = await model.generateContent([
        {
            fileData:{
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri
            }

        },
        {
            text: "Describe this image"
        },
    ])
    console.log(result.response.text())
    return NextResponse.json(result.response.text())

    }
    
    catch(error){
        return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 })
    }

}