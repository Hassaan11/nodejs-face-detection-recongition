const express = require("express");
const fs = require('fs');
const mrzScanner = require('mrz-scan');
const path = require("path");
const cv = require('@u4/opencv4nodejs');

const passportRouter = express.Router();
const passport = path.resolve(__dirname, '../assets/passport.jpeg');


const extractAndSaveFaces = async (inputImagePath, outputDirectory) =>{
  // Load image
  const img = await cv.imreadAsync(inputImagePath);

  // Convert image to grayscale
  const grayImg = await img.cvtColorAsync(cv.COLOR_BGR2GRAY);

  // Load face detection classifier
  const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

  // Detect faces in the image
  const { objects } = await classifier.detectMultiScaleAsync(grayImg);

  // Extract and save faces
  objects.forEach((rect, i) => {
    // Extract face from the image
    const face = img.getRegion(rect);

    // Save the face to a new file
    const outputPath = `${outputDirectory}/face_${i}.jpg`;
    cv.imwrite(outputPath, face);

    console.log(`Face ${i} saved at ${outputPath}`);
  });
}


passportRouter.get("/scan", function (req, res) {
  fs.readFile(passport, async (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
      extractAndSaveFaces(passport, 'uploads/')
        .catch((err) => console.error(err));
    try{
      const result = await mrzScanner(data, { original: true });
      console.log("result", result)
      res.send("Scanned Successfully")
    }catch(err){
      console.log("MRZ-Scan Error",err)
      res.send("Error Scanning Passport")
    }
    
  });
});

module.exports = passportRouter;