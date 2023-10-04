const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const multer = require('multer');
// const ffmpeg = require('fluent-ffmpeg');


app.set('view engine', 'ejs');


app.use('/public', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // 允许的头部信息
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next(); 
});

app.get('/getImages', (req, res) => {
  const imageFolder = path.join(__dirname, 'public', 'uploadimages');

  fs.readdir(imageFolder, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading image folder');
    } else {
      const imagePaths = files.filter(file =>
        !file.startsWith('.') &&
        ['.jpg','.png', '.PNG'].includes(path.extname(file))
        ).sort()
        .reverse()
        .slice(0, 10).map(file => `/public/uploadimages/${file}`);
      res.json(imagePaths);
    }
  });
});


app.get('/', (req, res) => {
    const videosDir = path.join(__dirname, 'public', 'videos');
    fs.readdir(videosDir, (err, files) => {
        if (err) return res.status(500).send('Error reading videos directory');

        const videoFiles = files.filter(file =>
            !file.startsWith('.') &&
            ['.mov'].includes(path.extname(file))
        ).sort()
            .reverse()
            .slice(0, 10).map(file => `/public/videos/${file}`);

        res.render('index', { video: videoFiles });
    });
});

// app.get('/get-latest-videos', (req, res) => {
//     const videosDir = path.join(__dirname, 'public', 'videos');
//     fs.readdir(videosDir, (err, files) => {
//         if (err) return res.status(500).send('Error reading videos directory');

//         const videoFiles = files.filter(file =>
//             !file.startsWith('.') &&
//             ['.mp4', '.webm'].includes(path.extname(file))
//         ).sort()
//             .reverse().slice(0, 4).map(file => `/public/videos/${file}`);

//         res.json(videoFiles);
//     });
// });


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'public', 'uploadimages'));
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // appending extension
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
      // Only allow images
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  }
});



  app.get('/uploadpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
  });

  app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.redirect('/error.html');
    }

    // File is uploaded and available at req.file.path
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});


  // app.post('/upload', upload.single('video'), (req, res) => {
  //   // if (processingCount >= 2) {
  //   //     console.log("Overload! Redirecting to waiting page...");
  //   //     return res.redirect('/wait.html');
  //   //   }
    
  //     if (!req.file) {
  //       return res.redirect('/error.html');
  //     }
    
  //     // processingCount++; 
  //     // console.log(`Processing start. Current count: ${processingCount}`);
  
  //   const uploadedVideoPath = req.file.path;
  //   const processedVideoPath = path.join(__dirname, 'public', 'videos', Date.now() + '.webm');
  
  //   ffmpeg.ffprobe(uploadedVideoPath, (err, metadata) => {
  //     if (err) {
  //       console.error(err);
  //       res.sendFile(path.join(__dirname, 'public', 'error.html'));
  //     }
  //     let duration = metadata.format.duration; 
      
  //     let command = ffmpeg(uploadedVideoPath).toFormat('webm');
  //     if (duration > 30) {
  //       command = command.duration(30); 
  //     }
  //     command
  //     .on('end', () => {
  //       processingCount--;
  //       console.log(`Processing end. Current count: ${processingCount}`);
  //       fs.unlinkSync(uploadedVideoPath);
  //       res.sendFile(path.join(__dirname, 'public', 'success.html'));
  //     })
  //       .on('error', (err) => {
  //         console.error(err);
  //         res.sendFile(path.join(__dirname, 'public', 'error.html'));
  //       })
  //       .save(processedVideoPath);
  //   });
  // });
  

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
;
