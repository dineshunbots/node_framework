const crypto = require('crypto');
const { execSync } = require('child_process');
const { log } = require('console');
const fs = require("fs");
const url = require("url");
const multer  = require('multer')
const sharp = require('sharp');
const uniqid = require('uniqid'); 
const path = require('path');


exports.imagecrop = async function (inputImagePath,outputImagePath,width,height) {
  
var path = outputImagePath.split("/");
path.pop();
var outputpath = "";
for(i=0;i<path.length;i++){
  outputpath = outputpath + path[i]+"/";
}
if (!fs.existsSync(outputpath)) {
fs.mkdirSync(outputpath, { recursive: true });
}else{
}

sharp("./"+inputImagePath)
  //.extract({ left, top, width, height }) // crop option
  .resize({
    width: width,
    height: height,
    fit: sharp.fit.fill,
  })
  .toFile(outputImagePath)
  .then(() => {
    console.log('Image cropped successfully!');
  })
  .catch((err) => {
    console.error('Error cropping image:', err);
  });
};

exports.fileupload = function (location) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // const requrl = url.format({
      //   pathname: req.originalUrl,
      // });
      // console.log("requrl", requrl);
      let basePath = "./uploads/";
      let resultPath = basePath +"images/"+location+"/o/";
  
      fs.mkdirSync(resultPath, { recursive: true });
      cb(null, resultPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_"+uniqid()+"_" +path.extname(file.originalname));
    },
  });
 const upload = multer({ storage: storage });
 return upload;
};


exports.fileupload_bill = function (location) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // const requrl = url.format({
      //   pathname: req.originalUrl,
      // });
      // console.log("requrl", requrl);
      let basePath = "./uploads/";
      let resultPath = basePath +"bill/"+location+"/";
  
      fs.mkdirSync(resultPath, { recursive: true });
      cb(null, resultPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_"+uniqid()+"_" +path.extname(file.originalname));
    },
  });
 const upload = multer({ storage: storage });
 return upload;
};




exports.checkAuthUser = (req, res, next) => {
    const access_token  = req.get('wtoken');
  if(!access_token) {
    return res.status(400).json({ error: 'Unauthorized Call' });
  }else{
    let authorized = false;
    const authorization_details = this.decrypt(access_token).split('|');
    if (authorization_details.length >= 3 && authorization_details[0]) {
      authorized = true;
    } else {
      authorized = false;
    }
    if (authorized) {
      req.access_token = this.setUserInfo(access_token);
      next();
    } else {
      return res.status(400).json({ error: 'Unauthorized Token' });
    }
  }
};

exports.setUserInfo = function (access_token) {
  let data = {};
  if(access_token != ""){
    const item = this.decrypt(access_token).split('|');
    if (item.length >= 3) {
      data = {
        user_id: item[0] ? this.decodeData(item[0]) : null,
        role: item[1] ? item[1] : null,
        logged_in_time: item[2] ? item[2] : null,
        tenant_id: item[3] ? item[3] : null
      };
    } else {
      data = { user_id: null, role: null, logged_in_time: null,tenant_id: null };
    }
  }else{
    data = { user_id: null, role: null, logged_in_time: null,tenant_id: null };
  }
  return data;
};

exports.base64clean = function (base64string) {
  return base64string.replace(/[=+\/]/g, '');
};

exports.encodeData = function (string) {
  if (string) {
    string = string.trim();
    string = this.base64clean(Buffer.from(string).toString('base64'));
    return string;
  }
};

exports.decodeData = function (string) {
  if (string) {
    string = string.trim();
    return Buffer.from(this.base64clean(string), 'base64').toString('utf-8');
  }
};

exports.encrypt = function (string) {
  const crypto = require("crypto");
  const iv = 'Na3JJk6J7zbTyrHN';
  const message = string;
  const key = '12345678123456781234567812345678';
  const encrypter = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedMsg = encrypter.update(message, "utf8", "hex");
  encryptedMsg += encrypter.final("hex");
  return encryptedMsg;
};


exports.decrypt = function (string) {
  const crypto = require("crypto");
  const iv = 'Na3JJk6J7zbTyrHN';
  const message = string;
  const key = '12345678123456781234567812345678';
  const decrypter = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decryptedMsg = decrypter.update(message, "hex", "utf8");
  decryptedMsg += decrypter.final("utf8");
  return decryptedMsg;
};









