// controllers/usersController.js
const util = require("util");
const pool = require('../../config/connection');
const helper = require('../helpers/helper');
const en_message = require('../../config/lang/en_message');
var axios = require('axios');
const mysql = require('mysql');
const queryAsync = util.promisify(pool.query).bind(pool);
let dbConnPool = {};

var response_data = {};
var status_code = 200;
exports.response =  function (res) {
  if(response_data.code != "100"){
    response_data.message = en_message.message[response_data.code];
  }
  return_response_data = response_data;
  response_data = {};
  return_status_code = status_code;
  return  res.status(return_status_code).json(return_response_data); 
}


dbConnPool.login = async (req, res) => {
 
  const email = req.body.email;
  const password = req.body.password;
  try {
    if(email != "" && password != ""){
      const emailcheck = await queryAsync('SELECT * FROM users WHERE email = ?',[email]);
      if (emailcheck.length > 0) {
        const authcheck = await queryAsync('SELECT * FROM users WHERE email = ? and password = ?',[email,password]);
        if (authcheck.length > 0) {
          var auth_token = helper.encrypt(helper.encodeData(String(authcheck[0].id))+"|"+authcheck[0].role+"|"+Date.now()+"|"+String(authcheck[0].email));
          response_data.status = "SUCCESS";
          response_data.code = "107";
          response_data.token = auth_token;
          response_data.name = authcheck[0].first_name;
          response_data.role = authcheck[0].role;
          response_data.id = authcheck[0].id;
          
        }else{
          response_data.status = "FAILED";
          response_data.code = "108";
        }
      }else{
        response_data.status = "FAILED";
        response_data.code = "106";
      }
    }else{
      response_data.status = "FAILED";
      response_data.code = "105";
    }
   }catch (error) {
      response_data.status = "FAILED";
      response_data.code = "100";
      response_data.message = error;
      
    }  
    return this.response(res);  
};


dbConnPool.signup = async (req, res) => {
  try {
    if(req.body.first_name != "" && req.body.last_name != "" && req.body.email != "" && req.body.mobile_no != "" && req.body.role != "" && req.body.password != ""){
      const checkemail = await queryAsync('SELECT * FROM users WHERE email = ?',[req.body.email]);
      if (checkemail.length > 0) {
        response_data.status = "FAILED";
        response_data.code = "101";
      } else {
        var user_data = {
          first_name:req.body.first_name,
          last_name:req.body.last_name,
          email:req.body.email,
          mobile_no:req.body.mobile_no,
          role:req.body.role,
          password: req.body.password,
          created_date: new Date(),
        };
        try {
          const regresults = await queryAsync('INSERT INTO users SET ? ',[user_data]);
          response_data.status = "SUCCESS";
          response_data.code = "102";
        } catch (regerror) {
          response_data.status = "FAILED";
          response_data.code = "100";
          response_data.message = regerror;
        } 
      }
    }else{
      response_data.status = "FAILED";
      response_data.code = "105";
    }
  } catch (error) {
      response_data.status = "FAILED";
      response_data.code = "100";
      response_data.message = error;
  }  
  return this.response(res);
};


dbConnPool.userlist = async(req, res) => {
    try {
      const record = await queryAsync('SELECT * FROM users');
      if (record.length > 0) {
        response_data.status = "SUCCESS";
        response_data.code = "103";
        response_data.list =  record;
      }else{
        response_data.status = "FAILED";
        response_data.code = "104";
      }
    } catch (error) {
      response_data.status = "FAILED";
      response_data.code = "100";
      response_data.message = error;
     
    }
    return this.response(res);
}


module.exports = dbConnPool

