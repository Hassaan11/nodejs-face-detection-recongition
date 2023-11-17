const express = require("express");
const fs = require('fs');
const path = require("path");
const cv = require('@u4/opencv4nodejs');
const faceapi = require('face-api.js');
const canvas = require('canvas');

const { Canvas, Image } = canvas
faceapi.env.monkeyPatch({ Canvas, Image })

const faceRouter = express.Router();

const imgPath1 = path.resolve(__dirname, '../assets/ronaldo1.jpeg');
const imgPath2 = path.resolve(__dirname, '../assets/ronaldo3.jpeg');

const matchFeaturesPass = ({ img1, img2, detector, matchFunc }) => {
  const keyPoints1 = detector.detect(img1);
  const keyPoints2 = detector.detect(img2);
  const descriptors1 = detector.compute(img1, keyPoints1);
  const descriptors2 = detector.compute(img2, keyPoints2);

  const matches = matchFunc(descriptors1, descriptors2);

  const bestMatches = matches.sort(
    (match1, match2) => match1.distance - match2.distance
  );
  // Compute similarity score
  // const numGoodMatches = Math.min(50, bestMatches.length);
  // similarity = (numGoodMatches / bestMatches.length) * 100;
  
  const totalDistance = bestMatches.reduce((acc, match) => acc + match.distance, 0);
  const averageDistance = totalDistance / bestMatches.length;
  const similarity = 1 / (1 + averageDistance);

  return similarity
};

faceRouter.get("/recognize/face-api", async function (req, res) {
  try{
      // Load face-api.js models
        
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'));
      await faceapi.nets.tinyFaceDetector.loadFromDisk(path.join(__dirname, 'models'));
      await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models'));
      await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models'));
      await faceapi.nets.faceExpressionNet.loadFromDisk(path.join(__dirname, 'models'));

      // Load images
      const img1 = await canvas.loadImage(imgPath1);
      const img2 = await canvas.loadImage(imgPath2);
    
      const face1 = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor().withFaceExpressions();
      const face2 = await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor().withFaceExpressions();

      if (face1 && face2) {
        const distance = faceapi.euclideanDistance(face1.descriptor, face2.descriptor);
        const similarity = 1 / (1 + distance);

        console.log('Face Similarity:', similarity);
        res.send(`Similarity Score is ${similarity * 100}`)
      } else {
        console.log('Faces not detected in one or both images.');
      }    
    }
    catch(err){
      console.log("FACE API ERROR",err)
    }
  })

faceRouter.get("/recognize/opencv", function (req, res) {
  try {
    const img1 = cv.imread(imgPath1);
    const img2 = cv.imread(imgPath2);

    const bf = new cv.BFMatcher(cv.NORM_L2, true);
    const orbBFMatchIMG = matchFeaturesPass({
      img1,
      img2,
      detector: new cv.ORBDetector(),
      matchFunc: (desc1, desc2) => bf.match(desc1, desc2),
    });
    console.log("orbBFMatchIMG", orbBFMatchIMG)
    if (cv.xmodules && cv.xmodules.xfeatures2d) {
      const siftMatchesImg = matchFeaturesPass({
        img1,
        img2,
        detector: new cv.SIFTDetector({ nFeatures: 2000 }),
        matchFunc: cv.matchFlannBased,
      });      
      console.log("siftMatchesImg", siftMatchesImg)
    } else {
      console.log('skipping SIFT matches');
    }
  
    const orbMatchesImg = matchFeaturesPass({
      img1,
      img2,
      detector: new cv.ORBDetector(),
      matchFunc: cv.matchBruteForceHamming,
    });
    console.log("orbMatchesImg", orbMatchesImg)  
    res.send(`Similarity Score is ${orbBFMatchIMG}`)

  }catch(err){
    console.log("Face Recognition Error",err)
  }
});

module.exports = faceRouter;