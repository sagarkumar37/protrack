const jwt     = require('jsonwebtoken');
const dotenv  = require('dotenv');
const result  = dotenv.config({path: './config/.env'});
const nodemailer = require('nodemailer');
const config= require('../config/config.json');
if (result.error) {
    throw result.error;
  }
  
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the .env file');
  }
  
const JWT_SECRET = process.env.JWT_SECRET;

async function getCurrentDate(index) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - index);
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
  
    console.log(`${year}-${month}-${day}`)
    console.log("date")

    
    return `${year}-${month}-${day}`;
  }

  function transportMail(mailOptions) {
    let transporter = nodemailer.createTransport(config.mailSetting);
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error occurred:', error);
          return reject(error);
        }
        console.log('Email sent:', info.response);
        return resolve(info);
      });
    });
  }


  function verifyTokenAndGetId (token) {
    // self code
    try{
      if (!token) {
        return null
      }
      const tokenParts = token.split(' ')
      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        // return res.status(401).send({ message: 'Invalid token format' });
        return null
      }
      const decoded = jwt.verify(tokenParts[1], JWT_SECRET)
      // const empcode = decoded.id;
      return decoded.id
    }
    catch(error){
      console.log(error);
      return 'null';
    }

  }
  // function verifyTokenAndGetId(token) {
  //   try {
  //     if (!token) {
  //       return null;
  //     }
  
  //     console.log(token + "  ________________________________________________token consoled");
  //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  " + token);
  
  //     const tokenParts = token.split(' ');
  
  //     if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
  //       console.log('Invalid token format');
  //       return null;
  //     }
  
  //     const decoded = jwt.verify(tokenParts[1], JWT_SECRET);
  
  //     if (!decoded || !decoded.id) {
  //       console.log('Invalid or missing user ID in decoded token');
  //       return null;
  //     }
  
  //     console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooo DECODED.ID" + decoded.id);
  //     console.log("just checking if verifyTokenAndGetId is reaching till before return");
  //     console.log(decoded.id);
  
  //     return decoded.id;
  //   } catch (error) {
  //     console.log(error);
  //     return null; // Return null or handle the error as needed.
  //   }
  // }
  
  module.exports = {
    getCurrentDate,
    verifyTokenAndGetId,
    transportMail
  }