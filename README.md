# Passport and Face Recognition Node.js App

This Node.js application demonstrates passport scanning for MRZ data and face recognition using both the face-api.js and OpenCV libraries.

## Introduction

This application showcases passport scanning for MRZ data and face recognition using face-api.js and OpenCV libraries.

## Prerequisites

Ensure the following software and dependencies are installed before running the application.

- [Node.js](https://nodejs.org/)
- [OpenCV](https://www.npmjs.com/package/@u4/opencv4nodejs)

## Installation

Follow these steps to install and set up the application.

1. Clone the repository:

   ```bash
   git clone https://github.com/Hassaan11/nodejs-face-detection-recongition

2. Configuration for opencv4nodejs:

    Before running the application, make sure to configure opencv4nodejs. If you haven't installed OpenCV yet, you can use Homebrew or another package manager suitable for your operating system.

    ## Installation

    ### Homebrew (for macOS)

    ```bash
    brew install opencv@4

    ### Configuration
    
    Update the following configuration to your package.json file with your own installation path:

    ```bash
      "opencv4nodejs": {
      "disableAutoBuild": 1,
      "opencvIncludeDir": "/usr/local/Cellar/opencv/4.8.1_2/include/opencv4",
      "opencvLibDir": "/usr/local/Cellar/opencv/4.8.1_2/lib",
      "opencvBinDir": "/usr/local/Cellar/opencv/4.8.1_2/bin",
      "opencvModules": [
        "core",
        "imgproc",
        "objdetect"
      ]
    }


3. Install dependencies:

    ```bash
    npm install

## Usage

  ```bash
  npm start

# Endpoints

## Passport Controller

### `GET /api/passport/scan`

- **Description:** 
  Scan a passport image for MRZ data and save detected faces.

- **Usage:**
  Make a GET request to `/api/passport/scan`.

- **Response:**
  - Success: `Scanned Successfully`
  - Error: `Error Scanning Passport`

## Face Controller

### `GET /api/face/recognize/face-api`

- **Description:**
  Recognize faces in images using the face-api.js library.

- **Usage:**
  Make a GET request to `/api/face/recognize/face-api`.

- **Response:**
  Returns the similarity score.

### `GET /api/face/recognize/opencv`

- **Description:**
  Recognize faces in images using the OpenCV library.

- **Usage:**
  Make a GET request to `/api/face/recognize/opencv`.

- **Response:**
  Returns the similarity score.
