const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const cors = require('cors');
app.use(cors());
const path = require('path');
const schedule = require('node-schedule');
const qs = require('qs');
const axios = require('axios');
const date = require('date-fns');
const Swal = require('sweetalert2')
const nodemailer = require('nodemailer');
const logger = require('../util/logger');
const cron = require('node-cron');
const dbConnection = require('../db/connection');
const { log } = require('console');
const { Blob } = require('buffer');
const moment= require('moment');
const util = require('util');


// // Function to check status and start timer
// async function checkStatusAndStartTimer() {

//     let email_data = [];

//     let pool = await dbConnection();
//     pool.query('SELECT is_active FROM product_issues_master', (error, results) => {
//       if (error) throw error;
  
//       const status = results[0].status;
     
//       if (status === '1') {
//         const startTime = Date.now();
//         const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; 
  
//         const intervalId = setInterval(() => {
//           const currentTime = Date.now();
//           if (currentTime - startTime >= twoDaysInMillis) {
//             clearInterval(intervalId);
//           }
  
//           pool.query(`SELECT ticket_category FROM product_issues_master WHERE is_active = '1'`, (error, newResults) => {
//             if (error) throw error;
  
//             const newStatus = newResults[0].ticket_category;

//             newResults.forEach(row => {

//                 pool.query(`SELECT email_to,email_cc FROM cms_email_type WHERE c_category = '${row.ticket_category}'` ,(err,result) => {
//                     if (err) throw err;
                    
//                     email_data.push(row.ticket_category);
                    
//                 } )

//             });

//             if (newStatus !== status) {
//               sendEmailNotification(newStatus);
//               clearInterval(intervalId);
//             }
//           });
//         }, 60000);
//       }
//     });
//   }

// setInterval(() =>{


// },1000)


// let transporter = nodemailer.createTransport({
//     host: 'jublcorp.mail.protection.outlook.com',
//     port: 25,
//     secure: false,
//     auth: {
//         user: 'g-smart.helpdesk@jubl.com',
//         pass: 'jubl@123'
//     },
//     debug: true
// });


// checkStatusAndStartTimer();

// async function checkStatusAndStartTimer() {

//     let pool = await dbConnection();
//     pool.query(`SELECT is_active,ticket_date,ticket_category FROM product_issues_master WHERE is_active='1'`, (error, results) => {
//         if (error) throw error;


//         results.forEach(row => {
            
//             const tic_date = row.ticket_date;
//             const status =  row.is_active;
//             const ticket_category = row.ticket_category;

//             if(status === 1){

//                 // Given date
//                 const givenDate = new Date(tic_date);

//                 // Adding two days
//                 const twoDaysLater = new Date(givenDate);
//                 twoDaysLater.setDate(givenDate.getDate() + 2);

//                 // Extracting year, month, and day components of the dates
//                 const givenYear = givenDate.getFullYear();
//                 const givenMonth = givenDate.getMonth();
//                 const givenDay = givenDate.getDate();

//                 const laterYear = twoDaysLater.getFullYear();
//                 const laterMonth = twoDaysLater.getMonth();
//                 const laterDay = twoDaysLater.getDate();

//                 // Getting the current date
//                 const currentDate = new Date();

//                 // Extracting year, month, and day components of the current date
//                 const currentYear = currentDate.getFullYear();
//                 const currentMonth = currentDate.getMonth();
//                 const currentDay = currentDate.getDate();

//                 console.log(givenYear,laterYear,givenMonth,laterMonth,givenDay,laterDay,laterYear,currentYear,laterMonth,currentMonth,laterDay,currentDay)

//                 // Comparing the dates
//                 if (givenYear === laterYear && givenMonth === laterMonth && laterYear === currentYear && laterMonth === currentMonth && laterDay === currentDay) {
//                     console.log("Success");

//                     pool.query(`SELECT email_to,email_cc FROM cms_email_type WHERE c_category = '${ticket_category}' AND levels = 'L-2'`, (err, result) => {
//                         if (err) throw err;

//                         if (result.length > 0) {
//                             const { email_to, email_cc } = result[0];
//                             sendEmailNotification(email_to, email_cc);
//                         }
//                     });
//                 } else {
//                     checkStatusAndStartTimer();
//                     console.log("Not matching");
//                 }


               
//             }
//         })
//     });
// }

//   Function to send email notification
function sendEmailNotification( emailTo, emailCc) {
      
   
        const mailOptions = {
        from: 'g-smart.helpdesk@jubl.com',
        to: emailTo,
        cc:emailCc,
        
        subject: 'Status Change Notification',
        text: `The status has changed to open within the two-day period.`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error occurred while sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

  }


  

const sess_time = 1000 * 60 * 60 * 2;
router.use(cookieParser());
router.use(session({
    secret: "SESS_SECRET:'{}'!@#$$#!SESS_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: sess_time,
        sameSite: 'strict',
    }
}));

router.use((req, res, next) => {
    res.locals.role = req.session.role;
    res.locals.emp = req.session.employeeId;
    res.locals.emp_name = req.session.emp_Name;
    res.locals.designation = req.session.designation;
    res.locals.teEmailId = req.session.teEmailId;
    res.locals.msisdn = req.session.msisdn
    res.locals.password = req.session.password
    

    next();
});

const authenticate = (req, res, next) => {
    if (req.session.employeeId) {
        next();
    } else {
        res.redirect('/');
    }
};


function getCurrentDateAndTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const reversedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return reversedDate;
}

function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}


function formatCurrentDate() {
    const currentDate = moment().format('dddd Do [of] MMMM YYYY');
    return currentDate;
}


function formatCurrentDate2() {
    const currentDate = moment().format('DD-MM-YYYY');
    return currentDate;
}


function getCurrentTime() {
    const currentTime = moment().format('hh:mm:ss A');
    return currentTime;
}


const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
const supportedVideoTypes = ['video/mp4', 'video/mpeg', 'video/webm', 'video/mov', 'video/quicktime','video/ogg','video/avi','video/wmv','video/flv','video/avchd'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("File mimetype:", file.mimetype);
        if (supportedVideoTypes.includes(file.mimetype)) {
            cb(null, '/var/log/cms/videos');
        } else if (supportedImageTypes.includes(file.mimetype)) {
            cb(null, '/var/log/cms/images');
        } else {
            cb(new Error('Unsupported file type'), null);
        }
    },
    filename: (req, file, cb) => {
        const originalname = file.originalname;
        const randomNum = Math.round(Math.random() * 999999) + 100000;
        const currentDate = moment().format('YYYYMMDD'); 
        const newFilename = `${randomNum}_${currentDate}_${originalname}`; 
        cb(null, newFilename);
    },
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, 
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'invest_img1' || file.fieldname === 'invest_img2') {
            if (!supportedImageTypes.includes(file.mimetype)) {
                return cb(new Error('Please upload only image files.'));
            }
        } else if (file.fieldname === 'invest_video') {
            if (!supportedVideoTypes.includes(file.mimetype)) {
                return cb(new Error('Please upload only video files.'));
            }
        }
        cb(null, true);
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error destroying session' });
        } else {
            res.clearCookie('connect.sid');
            res.json({ redirect: '/' });
        }
    });
});

router.get('/', function (req, res) {
    try {

        res.render('login')
        logger.info('Accessed GET in login ')
    } catch (error) {
        logger.error('Error GET in login ')

    }


})


router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error destroying session' });
        } else {
            res.clearCookie('connect.sid');
            res.json({ redirect: '/' });
        }
    });
});


router.get('/forgetpassword', function (req, res) {
    try {

        res.render('forgetpassword')
        logger.info('Accessed GET in forgetpassword ')

    } catch (error) {
        logger.error('Error GET in forgetpassword ')

    }
});

router.post('/forgot_pass', async (req, res) => {
    try {
        let empId = req.body.empid;
        // console.log(empId, 'empid');

        let data = qs.stringify({
            'forgetPassword': JSON.stringify({ "empId": empId })
        });
        let config = {
            method: 'post',
            url: process.env.FORGOT_PASS_API,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=CEFDB103484442F7E5D478CE1DE7CE5E'
            },
            data: data
        };

        const response = await axios.request(config);

        res.json(response.data.result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        logger.error(error + ' in forgot pass')
    }
});





router.post("/connect_application", function (req, res) {

    try {
        
        const user_id = req.session.employeeId;
        console.log(user_id,'user_id')
        res.json({ user_id: user_id });
    } catch (error) {
        res.render('error_pg');
    }
});







router.get('/dashboard', authenticate, async (req, res) => {
    try {
        let pool = await dbConnection();

        let countQuery1 = `
            SELECT 
              
                SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS openCount,
                SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
                SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
            FROM product_issues_master`;

        let countQuery2 = `
            SELECT 
                SUM(CASE WHEN is_active = 5 THEN 1 ELSE 0 END) AS reopenCount,
                SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
               
                SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
                SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
            FROM reopen_issues_master`;

        // Execute the queries sequentially and render the dashboard with the combined results
        pool.query(countQuery1, (err1, results1) => {
            if (err1) throw err1;

            pool.query(countQuery2, (err2, results2) => {
                if (err2) throw err2;

                const {
                    
                    resolvedCount: resolvedCount1,
                    openCount: openCount1,
                    inProcessCount: inProcessCount1,
                    closedCount: closedCount1
                } = results1[0];

                const {
                    reopenCount: reopenCount2,
                    resolvedCount: resolvedCount2,
                    
                    inProcessCount: inProcessCount2,
                    closedCount: closedCount2
                } = results2[0];

                res.render('dashboard', {
                    productIssues: {
                      
                        resolvedCount: resolvedCount1,
                        openCount: openCount1,
                        inProcessCount: inProcessCount1,
                        closedCount: closedCount1
                    },
                    userComplaints: {
                        reopenCount: reopenCount2,
                        resolvedCount: resolvedCount2,
                        inProcessCount: inProcessCount2,
                        closedCount: closedCount2
                    }
                });
            });
        });
    } catch (error) {
        logger.error('error in get complaint_form:: ', error);
        res.status(500).send('Internal Server Error');
    }
});





// router.get('/employee_dashboard', authenticate, async (req, res) => {
//     try {

        
//         const empCondition = `RAISED_BY = '${req.session.employeeId}:${req.session.emp_Name}'`;
       
         
//         let pool = await dbConnection()

//         let countQuery = `
//             SELECT 
//                 SUM(CASE WHEN is_active = 5 THEN 1 ELSE 0 END) AS reopenCount,
//                 SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
//                 SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS openCount,
//                 SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
//                 SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
//             FROM product_issues_master WHERE ${empCondition};`
//         pool.query(countQuery, (err, results) => {
           
//             if (err) throw err;
        
//             const { reopenCount, resolvedCount, openCount, inProcessCount, closedCount } = results[0];

//             res.render('employee_dashboard', {
//                 reopenCount,
//                 resolvedCount,
//                 openCount,
//                 inProcessCount,
//                 closedCount
//             });
//         });

//     } catch (error) {
//         logger.error('error in get complaint_form:: ', error);
//     }
// });

router.get('/employee_dashboard', authenticate, async (req, res) => {
    try {
        const empCondition = `RAISED_BY = '${req.session.employeeId}:${req.session.emp_Name}'`;
        let pool = await dbConnection();

        let countQuery1 = `
            SELECT 
                SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS openCount,
                SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
                SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
            FROM product_issues_master 
            WHERE ${empCondition}`;

        let countQuery2 = `
            SELECT 
                SUM(CASE WHEN is_active = 5 THEN 1 ELSE 0 END) AS reopenCount,
                SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
                SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
                SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
            FROM reopen_issues_master 
            WHERE ${empCondition}`;

        // Execute the queries sequentially and render the employee dashboard with the combined results
        pool.query(countQuery1, (err1, results1) => {
            if (err1) throw err1;

            pool.query(countQuery2, (err2, results2) => {
                if (err2) throw err2;

                const {
                    resolvedCount: resolvedCount1,
                    openCount: openCount1,
                    inProcessCount: inProcessCount1,
                    closedCount: closedCount1
                } = results1[0];

                const {
                    reopenCount: reopenCount2,
                    resolvedCount: resolvedCount2,
                    inProcessCount: inProcessCount2,
                    closedCount: closedCount2
                } = results2[0];

                res.render('employee_dashboard', {
                    productIssues: {
                        resolvedCount: resolvedCount1,
                        openCount: openCount1,
                        inProcessCount: inProcessCount1,
                        closedCount: closedCount1
                    },
                    userComplaints: {
                        reopenCount: reopenCount2,
                        resolvedCount: resolvedCount2,
                        inProcessCount: inProcessCount2,
                        closedCount: closedCount2
                    }
                });
            });
        });
    } catch (error) {
        logger.error('Error in get employee_dashboard:: ', error);
        res.status(500).send('Internal Server Error');
    }
});


// router.get('/manager_dashboard', authenticate, async (req, res) => {
//     try {

//         const empCondition = `RAISED_BY = '${req.session.employeeId}:${req.session.emp_Name}'`;
         
//         let pool = await dbConnection()

//         let countQuery = `
//             SELECT 
//                 SUM(CASE WHEN is_active = 5 THEN 1 ELSE 0 END) AS reopenCount,
//                 SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
//                 SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS openCount,
//                 SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
//                 SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
//             FROM product_issues_master WHERE ${empCondition};`
//         pool.query(countQuery, (err, results) => {
//             if (err) throw err;

//             const { reopenCount, resolvedCount, openCount, inProcessCount, closedCount } = results[0];

//             res.render('manager_dashboard', {
//                 reopenCount,
//                 resolvedCount,
//                 openCount,
//                 inProcessCount,
//                 closedCount
                
                
//             });
//         });
//     } catch (error) {
//         logger.error('error in get complaint_form:: ', error);
//     }
// });


router.get('/manager_dashboard', authenticate, async (req, res) => {
    try {
        const empCondition = `RAISED_BY = '${req.session.employeeId}:${req.session.emp_Name}'`;
        let pool = await dbConnection();

        let countQuery1 = `
            SELECT 
                SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS openCount,
                SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
                SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
            FROM product_issues_master 
            WHERE ${empCondition}`;

        let countQuery2 = `
            SELECT 
                SUM(CASE WHEN is_active = 5 THEN 1 ELSE 0 END) AS reopenCount,
                SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
                SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
                SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
            FROM reopen_issues_master 
            WHERE ${empCondition}`;

       
        pool.query(countQuery1, (err1, results1) => {
            if (err1) throw err1;

            pool.query(countQuery2, (err2, results2) => {
                if (err2) throw err2;

                const {
                    resolvedCount: resolvedCount1,
                    openCount: openCount1,
                    inProcessCount: inProcessCount1,
                    closedCount: closedCount1
                } = results1[0];

                const {
                    reopenCount: reopenCount2,
                    resolvedCount: resolvedCount2,
                    inProcessCount: inProcessCount2,
                    closedCount: closedCount2
                } = results2[0];

                res.render('manager_dashboard', {
                    productIssues: {
                        resolvedCount: resolvedCount1,
                        openCount: openCount1,
                        inProcessCount: inProcessCount1,
                        closedCount: closedCount1
                    },
                    userComplaints: {
                        reopenCount: reopenCount2,
                        resolvedCount: resolvedCount2,
                        inProcessCount: inProcessCount2,
                        closedCount: closedCount2
                    }
                });
            });
        });
    } catch (error) {
        logger.error('Error in get manager_dashboard:: ', error);
        res.status(500).send('Internal Server Error');
    }
});



router.get('/quality_team_dashboard', authenticate, async (req, res) => {
    try {
        let designation = req.session.designation;
        let email =req.session.teEmailId;
      
        let pool = await dbConnection();

        if (designation === "CEE") {
            let c_locationData = `SELECT complaint_location FROM cms_email_type WHERE email_to =?`;
            
            pool.query(c_locationData,[email], async (err, c_locationData_result) => {
                
                if (err) {
                    console.error("Error retrieving data from cms_email_type table:", err);
                    return;
                }

              
                let c_loc = c_locationData_result[0].complaint_location.split(',');
                let loc = c_loc.join(',').replace(/\[|\]/g, '');
                
                let comp_location_query = `SELECT * FROM complaint_location WHERE ID IN (${loc})`;
               
                pool.query(comp_location_query, async (error, comp_location_result) => {
                    
                   
                    if (error) {
                        console.error("Error retrieving data from complaint_location table:", error);
                        return;
                    }

                    let ar_data = [];

                    comp_location_result.forEach(row => {
                        ar_data.push(row.c_location);
                    });
                    

                 

                    let comp_loca = JSON.stringify(ar_data);
                    let data_09 = comp_loca.replaceAll("]","").replaceAll("[","").replaceAll('"',"'");
                    let countQuery1 = `
                    SELECT 
                    SUM(CASE WHEN is_active = 5 THEN 1 ELSE 0 END) AS reopenCount,
                    SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
                    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS openCount,
                    SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
                    SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
                FROM product_issues_master WHERE ticket_location IN (${data_09});`;

        let countQuery2 = `
        SELECT 
        SUM(CASE WHEN is_active = 5 THEN 1 ELSE 0 END) AS reopenCount,
        SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS openCount,
        SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
        SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
    FROM reopen_issues_master WHERE ticket_location IN (${data_09});`;

       
        pool.query(countQuery1, (err1, results1) => {
            if (err1) throw err1;

            pool.query(countQuery2, (err2, results2) => {
                if (err2) throw err2;

                const {
                    resolvedCount: resolvedCount1,
                    openCount: openCount1,
                    inProcessCount: inProcessCount1,
                    closedCount: closedCount1
                } = results1[0];

                const {
                    reopenCount: reopenCount2,
                    resolvedCount: resolvedCount2,
                    inProcessCount: inProcessCount2,
                    closedCount: closedCount2
                } = results2[0];

                res.render('quality_team_dashboard', {
                    productIssues: {
                        resolvedCount: resolvedCount1,
                        openCount: openCount1,
                        inProcessCount: inProcessCount1,
                        closedCount: closedCount1
                    },
                    userComplaints: {
                        reopenCount: reopenCount2,
                        resolvedCount: resolvedCount2,
                        inProcessCount: inProcessCount2,
                        closedCount: closedCount2
                    }
                });
            });
        });
                    
                   
                });
            });
        } else {

            let countQuery1 = `
            SELECT 
              
                SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS openCount,
                SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
                SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
            FROM product_issues_master`;

        let countQuery2 = `
            SELECT 
                SUM(CASE WHEN is_active = 5 THEN 1 ELSE 0 END) AS reopenCount,
                SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
               
                SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
                SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
            FROM reopen_issues_master`;

       
        pool.query(countQuery1, (err1, results1) => {
            if (err1) throw err1;

            pool.query(countQuery2, (err2, results2) => {
                if (err2) throw err2;

                const {
                    
                    resolvedCount: resolvedCount1,
                    openCount: openCount1,
                    inProcessCount: inProcessCount1,
                    closedCount: closedCount1
                } = results1[0];

                const {
                    reopenCount: reopenCount2,
                    resolvedCount: resolvedCount2,
                    
                    inProcessCount: inProcessCount2,
                    closedCount: closedCount2
                } = results2[0];

                res.render('quality_team_dashboard', {
                    productIssues: {
                      
                        resolvedCount: resolvedCount1,
                        openCount: openCount1,
                        inProcessCount: inProcessCount1,
                        closedCount: closedCount1
                    },
                    userComplaints: {
                        reopenCount: reopenCount2,
                        resolvedCount: resolvedCount2,
                        inProcessCount: inProcessCount2,
                        closedCount: closedCount2
                    }
                });
            });
        });
                       
            
          
        }
    } catch (error) {
        logger.error('error in get complaint_form:: ', error);
    }
});

router.get('/business_head_dashboard', authenticate, async (req, res) => {
    try {

        let email =req.session.teEmailId;
        let pool = await dbConnection()

        let c_locationData = `SELECT c_category FROM product_equation WHERE business_head_email =?`;
            
        pool.query(c_locationData,[email], async (err, c_locationData_result) => {
            if (err) {
                console.error("Error retrieving data from cms_email_type table:", err);
                return;
            }
            let product_name = c_locationData_result[0].c_category
          
            
            let countQuery1 = `
            SELECT 
              
                SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS openCount,
                SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
                SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
            FROM product_issues_master WHERE ticket_category = ?`;

        let countQuery2 = `
            SELECT 
                SUM(CASE WHEN is_active = 5 THEN 1 ELSE 0 END) AS reopenCount,
                SUM(CASE WHEN is_active = 3 THEN 1 ELSE 0 END) AS resolvedCount,
                SUM(CASE WHEN is_active = 2 THEN 1 ELSE 0 END) AS inProcessCount,
                SUM(CASE WHEN is_active = 4 THEN 1 ELSE 0 END) AS closedCount
            FROM reopen_issues_master WHERE ticket_category = ?`;

       
        pool.query(countQuery1,[product_name], (err1, results1) => {
            if (err1) throw err1;

            pool.query(countQuery2,[product_name], (err2, results2) => {
                if (err2) throw err2;

                const {
                    
                    resolvedCount: resolvedCount1,
                    openCount: openCount1,
                    inProcessCount: inProcessCount1,
                    closedCount: closedCount1
                } = results1[0];

                const {
                    reopenCount: reopenCount2,
                    resolvedCount: resolvedCount2,
                    
                    inProcessCount: inProcessCount2,
                    closedCount: closedCount2
                } = results2[0];

                res.render('business_head_dashboard', {
                    productIssues: {
                      
                        resolvedCount: resolvedCount1,
                        openCount: openCount1,
                        inProcessCount: inProcessCount1,
                        closedCount: closedCount1
                    },
                    userComplaints: {
                        reopenCount: reopenCount2,
                        resolvedCount: resolvedCount2,
                        inProcessCount: inProcessCount2,
                        closedCount: closedCount2
                    }
                });
            });
        });
        
    })
    } catch (error) {
        logger.error('error in get complaint_form:: ', error);
    }
});

router.get('/edit_profile',authenticate, (req, res) => {

    let emp_name = req.session.emp_Name;
    let emp_email = req.session.teEmailId;
    let mobile =req.session.msisdn;
    let password = req.session.password;
    
    
  
   


    res.render('edit_profile',{emp_name:emp_name,emp_email:emp_email,mobile:mobile})
})
router.get('/all_transfer_tickets',authenticate, (req, res) => {
    res.render('all_transfer_tickets')
})
router.get('/add_tickets',authenticate, async (req, res) => {
    try {

        let pool = await dbConnection()
    
        let query = `SELECT DISTINCT c_category FROM complaint_type WHERE is_active = 1;`
        pool.query(query, (err, results) => {
            if (err) throw err;
           
            res.render('add_tickets', { data: results })
        })
    } catch (error) {
        logger.error('error in get complaint_form:: ', error)
    }
})


// router.post('/updatePassword', async (req, res) => {
//     const { new_password, confirm_password } = req.body;
    
//     const emp_id = req.session.emp_id;
    
//     let pool = await dbConnection();
//     if (new_password === confirm_password) {
//         try {

//             let query = `UPDATE cms_user_login SET PASSWORD = ? WHERE EMP_CODE = ?`;
//              pool.query(query, [new_password, emp_id]); 

//             console.log(new_password,'new_password')

//             res.send('Password updated successfully');
//         } catch (err) {
//             console.error(err);
//             res.status(500).send('Error updating password');
//         }
//     } else {
//         res.status(400).send('New Password and Confirm Password do not match');
//     }
// });


router.post('/updatePassword', async (req, res) => {
    const { new_password, confirm_password } = req.body;
    const emp_id = req.session.employeeId;

    let pool = await dbConnection();
    
    if (new_password == confirm_password) {
        try {
            let query = `UPDATE cms_user_login SET PASSWORD = ? WHERE EMP_CODE = ?`;
            console.log(query,'query')
            // Await the database operation
        pool.query(query, [new_password, emp_id]);
          
            // Send response after successful update
            res.send('Password updated successfully');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating password');
        }
    } else {
        res.status(400).send('New Password and Confirm Password do not match');
    }
});


router.get('/add_tickets_connect/:user_id/:user_name', async (req, res) => {
    try {

        let emp_id = req.params.user_id;
        let emp_name = req.params.user_name;

        let pool = await dbConnection()
    
        let query = `SELECT DISTINCT c_category FROM complaint_type WHERE is_active = 1;`
        pool.query(query, (err, results) => {
            if (err) throw err;
           
            res.render('add_tickets_connect', { data: results,emp_id:emp_id,emp_name:emp_name })
        })
    } catch (error) {
        logger.error('error in get complaint_form:: ', error)
    }
})




router.get('/all_tickets',authenticate, async (req, res) => {
    try {
        
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
        let email =req.session.teEmailId;

        let pool = await dbConnection()

        let query = `SELECT DISTINCT c_category FROM complaint_type WHERE is_active = 1;`
        pool.query(query, (err, results) => {

            if (err) throw err;
            let status = `SELECT DISTINCT action_value, action_id FROM cms_status;`
            pool.query(status, (err, result) => {

                if (err) throw err;

                else if(req.session.role === "MANAGER" || req.session.role === "EMPLOYEE") {
                    let all_data=`
                        SELECT 
                        is_active, 
                        DATE_FORMAT(ticket_date,'%d-%m-%Y') AS
                        formatted_date,
                        ticket_id,
                        ticket_category, 
                        ticket_type, 
                        ticket_location,
                        raised_by, 
                        description, 
                        product_category, 
                        product_name, 
                        sku, 
                        batch_no, 
                        manufacturing_date, 
                        customer_name, 
                        customer_type, 
                        customer_location, 
                        quantity_purchage, 
                        quantity_rejected, 
                        visit_type, 
                        person_meet, 
                        customer_phone, 
                        inprocess_by, 
                        DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                        closed_by, 
                        DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                        resolved_by, 
                        DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                        DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at,
                        investigation_details, 
                        closed_comment,
                        action_taken 
                        FROM product_issues_master WHERE is_active != 5 AND raised_by=? ORDER BY ticket_id DESC;`

                        console.log(all_data,'all_data_43443')
                        pool.query(all_data,[employeeDataString], (err,all_result) => {
                        console.log(all_result,'all_result_4334434343433')
                        if (err) throw err;
                            res.render('all_tickets', { data: results, status: result, all_result:all_result, employeeDataString:employeeDataString})

                        });
                    }

                else if(req.session.role==="BUSINESS HEAD") {

                                        
                    let email =req.session.teEmailId;

                    let c_locationData = `SELECT c_category FROM product_equation WHERE business_head_email =?`;
                                
                            pool.query(c_locationData,[email], async (err, c_locationData_result) => {
                                if (err) {
                                    console.error("Error retrieving data from cms_email_type table:", err);
                                    return;
                                }
                                let product_name = c_locationData_result[0].c_category
                          


                    let all_data=`
                        SELECT 
                        is_active, 
                        DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                        ticket_id, 
                        ticket_category,
                        ticket_type, 
                        ticket_location,
                        raised_by, 
                        description, 
                        product_category, 
                        product_name, 
                        sku, 
                        batch_no, 
                        manufacturing_date, 
                        customer_name, 
                        customer_type, 
                        customer_location, 
                        quantity_purchage, 
                        quantity_rejected, 
                        visit_type, 
                        person_meet, 
                        customer_phone, 
                        inprocess_by, 
                        DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                        closed_by, 
                        DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                        resolved_by, 
                        DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                        DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                        investigation_details, 
                        closed_comment,
                        action_taken 
                        FROM product_issues_master WHERE is_active != 5 AND ticket_category=?  ORDER BY ticket_id DESC;`
    
                      
                        pool.query(all_data,[product_name], (err,all_result) => {
                        if (err) throw err;
                            res.render('all_tickets', { data: results, status: result, all_result:all_result, employeeDataString:employeeDataString})
                        });
                    })


                    }else if(req.session.role==="SUPER_ADMIN") {
                    let all_data=`
                        SELECT 
                        is_active, 
                        DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                        ticket_id, 
                        ticket_category,
                        ticket_type, 
                        ticket_location,
                        raised_by, 
                        description, 
                        product_category, 
                        product_name, 
                        sku, 
                        batch_no, 
                        manufacturing_date, 
                        customer_name, 
                        customer_type, 
                        customer_location, 
                        quantity_purchage, 
                        quantity_rejected, 
                        visit_type, 
                        person_meet, 
                        customer_phone, 
                        inprocess_by, 
                        DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                        closed_by, 
                        DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                        resolved_by, 
                        DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                        DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                        investigation_details, 
                        closed_comment,
                        action_taken 
                        FROM product_issues_master WHERE is_active != 5  ORDER BY ticket_id DESC;`
    
                      
                        pool.query(all_data, (err,all_result) => {
                        if (err) throw err;
                            res.render('all_tickets', { data: results, status: result, all_result:all_result, employeeDataString:employeeDataString})
                        });

                        
                    } else if( req.session.role==="QUILITY TEAM" && req.session.designation === "CEE") {

                         let c_locationData = `SELECT complaint_location FROM cms_email_type WHERE email_to =?`;

                        pool.query(c_locationData,[email], async (err, c_locationData_result) => {

                            console.log(c_locationData_result,'c_locationData_result')
                            if (err) {
                                console.error("Error retrieving data from cms_email_type table:", err);
                                return;
                            }
                            let c_loc = c_locationData_result[0].complaint_location.split(',');
                            let loc = c_loc.join(',').replace(/\[|\]/g, '');
                            let comp_location_query = `SELECT * FROM complaint_location WHERE ID IN (${loc})`;
                            pool.query(comp_location_query, async (error, comp_location_result) => {
                                if (error) {
                                    console.error("Error retrieving data from complaint_location table:", error);
                                    return;
                                }

                                    let ar_data = [];
                                    comp_location_result.forEach(row => {
                                        ar_data.push(row.c_location);
                                    });

                                let comp_loca = JSON.stringify(ar_data);
                                let data_09 = comp_loca.replaceAll("]","").replaceAll("[","").replaceAll('"',"'");

                              
                        
                        
                        let all_data=`
                            SELECT 
                            is_active, 
                            DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,ticket_id, 
                            ticket_category, 
                            ticket_type,
                            ticket_location,
                            raised_by, 
                            description, 
                            product_category, 
                            product_name, 
                            sku, 
                            batch_no, 
                            manufacturing_date, 
                            customer_name, 
                            customer_type, 
                            customer_location, 
                            quantity_purchage, 
                            quantity_rejected, 
                            visit_type, 
                            person_meet, 
                            customer_phone, 
                            inprocess_by, 
                            DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                            closed_by, 
                            DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at,
                            resolved_by, 
                            DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                            DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                            investigation_details, 
                            closed_comment,
                            action_taken 
                            FROM product_issues_master WHERE is_active != 5 AND ticket_location IN (${data_09}) ORDER BY ticket_id DESC;`
        
                            
                            pool.query(all_data,async (err,all_result) => {
                            console.log(all_result,'all_result_4334434343433')
                            if (err) throw err;
                                res.render('all_tickets', { data: results, status: result, all_result:all_result, employeeDataString:employeeDataString})
        
                            });
                        

                        })
                    })
                        }else if( req.session.role==="QUILITY TEAM" && req.session.designation === "QC") {

                        //  let c_locationData = `SELECT complaint_location FROM cms_email_type WHERE email_to =?`;

                        // pool.query(c_locationData,[email], async (err, c_locationData_result) => {

                        //     console.log(c_locationData_result,'c_locationData_result')
                        //     if (err) {
                        //         console.error("Error retrieving data from cms_email_type table:", err);
                        //         return;
                        //     }
                        //     let c_loc = c_locationData_result[0].complaint_location.split(',');
                        //     let loc = c_loc.join(',').replace(/\[|\]/g, '');
                        //     let comp_location_query = `SELECT * FROM complaint_location WHERE ID IN (${loc})`;
                        //     pool.query(comp_location_query, async (error, comp_location_result) => {
                        //         if (error) {
                        //             console.error("Error retrieving data from complaint_location table:", error);
                        //             return;
                        //         }

                        //             let ar_data = [];
                        //             comp_location_result.forEach(row => {
                        //                 ar_data.push(row.c_location);
                        //             });

                        //         let comp_loca = JSON.stringify(ar_data);
                        //         let data_09 = comp_loca.replaceAll("]","").replaceAll("[","").replaceAll('"',"'");

                              
                        
                        
                        let all_data=`
                            SELECT 
                            is_active, 
                            DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                            ticket_id,                             
                            ticket_category,
                            ticket_type,
                            ticket_location, 
                            raised_by, 
                            description, 
                            product_category, 
                            product_name, 
                            sku, 
                            batch_no, 
                            manufacturing_date, 
                            customer_name, 
                            customer_type, 
                            customer_location, 
                            quantity_purchage, 
                            quantity_rejected, 
                            visit_type, 
                            person_meet, 
                            customer_phone, 
                            inprocess_by, 
                            DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                            closed_by, 
                            DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at,
                            resolved_by, 
                            DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                            DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                            investigation_details, 
                            closed_comment,
                            action_taken 
                            FROM product_issues_master WHERE is_active != 5 ORDER BY ticket_id DESC;`
        
                            
                            pool.query(all_data,async (err,all_result) => {
                            console.log(all_result,'all_result_4334434343433')
                            if (err) throw err;
                                res.render('all_tickets', { data: results, status: result, all_result:all_result, employeeDataString:employeeDataString})
        
                            });
                        

                        // })
                    // })
                        }else if( req.session.role==="QUILITY TEAM") {

                        let all_data=`
                        SELECT 
                        is_active, 
                        DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                        ticket_id, 
                        ticket_category,
                        ticket_type,
                        ticket_location, 
                        raised_by, 
                        description, 
                        product_category, 
                        product_name, 
                        sku, 
                        batch_no, 
                        manufacturing_date, 
                        customer_name, 
                        customer_type, 
                        customer_location, 
                        quantity_purchage, 
                        quantity_rejected, 
                        visit_type, 
                        person_meet, 
                        customer_phone, 
                        inprocess_by, 
                        DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                        closed_by, 
                        DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                        resolved_by, 
                        DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                        DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                        investigation_details, 
                        closed_comment,
                        action_taken 
                        FROM product_issues_master WHERE is_active != 5  ORDER BY ticket_id DESC;`
    
                      
                        pool.query(all_data, (err,all_result) => {
                        if (err) throw err;
                            res.render('all_tickets', { data: results, status: result, all_result:all_result, employeeDataString:employeeDataString})
                        });
                        }
                    
            });
        });
    } catch (error) {
        logger.error('error in get complaint_form:: ', error)
    }
})

router.post('/filter_ticket_data', authenticate, async (req, res) => {
    try {
        let pool = await dbConnection();
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;

        let email =req.session.teEmailId;
        let { startDate, endDate, category, ticket_sts } = req.body;

        let startDate_formated=''
        let endDate_formated =''

        if(startDate && endDate){
            let startDate_formated1 = moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            console.log(startDate_formated1, 'startDate_formated');
            startDate_formated=startDate_formated1

            let endDate_formated1 = moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            console.log(endDate_formated1, 'endDate_formated');
            endDate_formated=endDate_formated1

        }
        else{
            startDate_formated=''
            endDate_formated =''
        }


      

        if (startDate_formated !== '' && endDate_formated !== '' && (category == '' || category == undefined) && (ticket_sts == '' || ticket_sts == undefined) && (req.session.role === "MANAGER" || req.session.role === "EMPLOYEE")) {
            

            let all_data = `
                SELECT 
                is_active, 
                DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                ticket_id,
                ticket_category, 
                ticket_type,
                ticket_location, 
                raised_by, 
                description, 
                product_category, 
                product_name, 
                sku, 
                batch_no, 
                manufacturing_date, 
                customer_name, 
                customer_type, 
                customer_location, 
                quantity_purchage, 
                quantity_rejected, 
                visit_type, 
                person_meet, 
                customer_phone, 
                inprocess_by, 
                DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                closed_by, 
                DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                resolved_by, 
                DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                investigation_details, 
                closed_comment,
                action_taken 
                FROM product_issues_master 
                WHERE is_active != 5 AND
                raised_by=? AND
                DATE(ticket_date) >= ? AND DATE(ticket_date) <= ?                     
                ORDER BY ticket_id DESC;`;

            pool.query(all_data, [employeeDataString, startDate_formated, endDate_formated], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
        } 
        
        else if (startDate_formated !== '' && endDate_formated !== '' && category !== '' && ticket_sts !== '' && (req.session.role === "MANAGER" || req.session.role === "EMPLOYEE")) {
           

            let all_data = `
                SELECT 
                    is_active, 
                    DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                    ticket_id, 
                    ticket_category,
                    ticket_type,
                    ticket_location, 
                    raised_by, 
                    description, 
                    product_category, 
                    product_name, 
                    sku, 
                    batch_no, 
                    manufacturing_date, 
                    customer_name, 
                    customer_type, 
                    customer_location, 
                    quantity_purchage, 
                    quantity_rejected, 
                    visit_type, 
                    person_meet, 
                    customer_phone, 
                    inprocess_by, 
                    DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                    closed_by, 
                    DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                    resolved_by, 
                    DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                    DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                    investigation_details, 
                    closed_comment,
                    action_taken 
                FROM 
                    product_issues_master 
                WHERE 
                    is_active != 5 AND
                    raised_by=? AND
                    DATE(ticket_date) >= ? AND DATE(ticket_date) <= ?  AND
                    ticket_category=? AND	
                    is_active=? 
                             
                ORDER BY 
                    ticket_id DESC;`;

            pool.query(all_data, [employeeDataString, startDate_formated, endDate_formated, category, ticket_sts], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
        }

        else if (startDate_formated !== '' && endDate_formated !== '' && (category == '' || category == undefined) && (ticket_sts == '' || ticket_sts == undefined) && req.session.role === "SUPER_ADMIN") {

            let all_data = `
                SELECT 
                is_active, 
                DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                ticket_id,
                ticket_category, 
                ticket_type,
                ticket_location, 
                raised_by, 
                description, 
                product_category, 
                product_name, 
                sku, 
                batch_no, 
                manufacturing_date, 
                customer_name, 
                customer_type, 
                customer_location, 
                quantity_purchage, 
                quantity_rejected, 
                visit_type, 
                person_meet, 
                customer_phone, 
                inprocess_by, 
                DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                closed_by, 
                DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                resolved_by, 
                DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                investigation_details, 
                closed_comment,
                action_taken 
                FROM product_issues_master 
                WHERE is_active != 5 AND
                DATE(ticket_date) >= ? AND DATE(ticket_date) <= ?                     
                ORDER BY ticket_id DESC;`;

            pool.query(all_data, [ startDate_formated, endDate_formated], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
        } else if (startDate_formated !== '' && endDate_formated !== '' && (category == '' || category == undefined) && (ticket_sts == '' || ticket_sts == undefined) && req.session.role === "BUSINESS HEAD") {


            let login =`SELECT Emp_Email_ID FROM cms_user_login WHERE EMP_CODE =${req.session.employeeId}`;
            pool.query(login, (errrr,login_result) => {

                console.log(login_result,'login_result')
                let email = login_result[0].Emp_Email_ID;
                console.log(email,'email')

                const eqaution = `SELECT c_category FROM product_equation WHERE business_head_email='${email}';`
                console.log(eqaution, 'eqaution');
                
                pool.query(eqaution, (err, eqaution_results) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        return;
                    }
                    console.log(eqaution_results, 'eqaution_results');
                    
                    if (eqaution_results && eqaution_results.length > 0) {
                        let eqaution_ = eqaution_results[0].c_category;
                        console.log(eqaution_, 'eqaution_');
                    } else {
                        console.log('No results found for the query.');
                    }
                
                    let eqaution_;

            let all_data = `
                SELECT 
                is_active, 
                DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                ticket_id,
                ticket_category, 
                ticket_type,
                ticket_location, 
                raised_by, 
                description, 
                product_category, 
                product_name, 
                sku, 
                batch_no, 
                manufacturing_date, 
                customer_name, 
                customer_type, 
                customer_location, 
                quantity_purchage, 
                quantity_rejected, 
                visit_type, 
                person_meet, 
                customer_phone, 
                inprocess_by, 
                DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                closed_by, 
                DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                resolved_by, 
                DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                investigation_details, 
                closed_comment,
                action_taken 
                FROM product_issues_master 
                WHERE is_active != 5 AND
                DATE(ticket_date) >= ? AND DATE(ticket_date) <= ? AND ticket_category = ?                
                ORDER BY ticket_id DESC;`;
                    console.log(all_data,'all_data')
            pool.query(all_data, [ startDate_formated, endDate_formated,eqaution_], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
            
        })
    })
        } 
        else if (startDate_formated !== '' && endDate_formated !== '' && (category == '' || category == undefined) && (ticket_sts == '' || ticket_sts == undefined) && (req.session.role === "QUILITY TEAM" && req.session.designation === "CEE")) {


            let c_locationData = `SELECT complaint_location FROM cms_email_type WHERE email_to =?`;

                        pool.query(c_locationData,[email], async (err, c_locationData_result) => {

                            console.log(c_locationData_result,'c_locationData_result')
                            if (err) {
                                console.error("Error retrieving data from cms_email_type table:", err);
                                return;
                            }
                            let c_loc = c_locationData_result[0].complaint_location.split(',');
                            let loc = c_loc.join(',').replace(/\[|\]/g, '');
                            let comp_location_query = `SELECT * FROM complaint_location WHERE ID IN (${loc})`;
                            pool.query(comp_location_query, async (error, comp_location_result) => {
                                if (error) {
                                    console.error("Error retrieving data from complaint_location table:", error);
                                    return;
                                }

                                    let ar_data = [];
                                    comp_location_result.forEach(row => {
                                        ar_data.push(row.c_location);
                                    });

                                let comp_loca = JSON.stringify(ar_data);
                                let data_09 = comp_loca.replaceAll("]","").replaceAll("[","").replaceAll('"',"'");
                              
           

            let all_data = `
                SELECT 
                is_active, 
                DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                ticket_id,
                ticket_category, 
                ticket_type, 
                ticket_location,
                raised_by, 
                description, 
                product_category, 
                product_name, 
                sku, 
                batch_no, 
                manufacturing_date, 
                customer_name, 
                customer_type, 
                customer_location, 
                quantity_purchage, 
                quantity_rejected, 
                visit_type, 
                person_meet, 
                customer_phone, 
                inprocess_by, 
                DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                closed_by, 
                DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                resolved_by, 
                DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                investigation_details, 
                closed_comment,
                action_taken 
                FROM product_issues_master 
                WHERE is_active != 5 AND
                DATE(ticket_date) >= ? AND DATE(ticket_date) <= ? AND ticket_location IN (${data_09}) ORDER BY ticket_id DESC;`;

            pool.query(all_data, [ startDate_formated, endDate_formated], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
        })
    })
        }else if (startDate_formated !== '' && endDate_formated !== '' && (category == '' || category == undefined) && (ticket_sts == '' || ticket_sts == undefined) && (req.session.role === "QUILITY TEAM" && req.session.designation === "QC")) {

            let all_data = `
                SELECT 
                is_active, 
                DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                ticket_id,
                ticket_category, 
                ticket_type, 
                ticket_location,
                raised_by, 
                description, 
                product_category, 
                product_name, 
                sku, 
                batch_no, 
                manufacturing_date, 
                customer_name, 
                customer_type, 
                customer_location, 
                quantity_purchage, 
                quantity_rejected, 
                visit_type, 
                person_meet, 
                customer_phone, 
                inprocess_by, 
                DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                closed_by, 
                DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                resolved_by, 
                DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                investigation_details, 
                closed_comment,
                action_taken 
                FROM product_issues_master 
                WHERE is_active != 5 AND
                DATE(ticket_date) >= ? AND DATE(ticket_date) <= ? ORDER BY ticket_id DESC;`;

            pool.query(all_data, [ startDate_formated, endDate_formated], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
       
        }

        
        else if (startDate_formated !== '' && endDate_formated !== '' && category !== '' && ticket_sts !== '' && (req.session.role === "BUSINESS HEAD" || req.session.role === "SUPER_ADMIN")) {
            

            let all_data = `
                SELECT 
                    is_active, 
                    DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                    ticket_id, 
                    ticket_category,
                    ticket_type,
                    ticket_location, 
                    raised_by, 
                    description, 
                    product_category, 
                    product_name, 
                    sku, 
                    batch_no, 
                    manufacturing_date, 
                    customer_name, 
                    customer_type, 
                    customer_location, 
                    quantity_purchage, 
                    quantity_rejected, 
                    visit_type, 
                    person_meet, 
                    customer_phone, 
                    inprocess_by, 
                    DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                    closed_by, 
                    DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                    resolved_by, 
                    DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                    DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                    investigation_details, 
                    closed_comment,
                    action_taken 
                FROM 
                    product_issues_master 
                WHERE 
                    is_active != 5 AND
                    DATE(ticket_date) >= ? AND DATE(ticket_date) <= ?  AND
                    ticket_category=? AND	
                    is_active=? 
                             
                ORDER BY 
                    ticket_id DESC;`;

            pool.query(all_data, [startDate_formated, endDate_formated, category, ticket_sts], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
        }
        else if (startDate_formated !== '' && endDate_formated !== '' && category !== '' && ticket_sts !== '' && (req.session.role === "QUILITY TEAM" && req.session.designation === "CEE")) {
           
            let c_locationData = `SELECT complaint_location FROM cms_email_type WHERE email_to =?`;

                        pool.query(c_locationData,[email], async (err, c_locationData_result) => {

                            console.log(c_locationData_result,'c_locationData_result')
                            if (err) {
                                console.error("Error retrieving data from cms_email_type table:", err);
                                return;
                            }
                            let c_loc = c_locationData_result[0].complaint_location.split(',');
                            let loc = c_loc.join(',').replace(/\[|\]/g, '');
                            let comp_location_query = `SELECT * FROM complaint_location WHERE ID IN (${loc})`;
                            pool.query(comp_location_query, async (error, comp_location_result) => {
                                if (error) {
                                    console.error("Error retrieving data from complaint_location table:", error);
                                    return;
                                }

                                    let ar_data = [];
                                    comp_location_result.forEach(row => {
                                        ar_data.push(row.c_location);
                                    });

                                let comp_loca = JSON.stringify(ar_data);
                                let data_09 = comp_loca.replaceAll("]","").replaceAll("[","").replaceAll('"',"'");
                              
            let all_data = `
                SELECT 
                    is_active, 
                    DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                    ticket_id, 
                    ticket_category,
                    ticket_type,
                    ticket_location, 
                    raised_by, 
                    description, 
                    product_category, 
                    product_name, 
                    sku, 
                    batch_no, 
                    manufacturing_date, 
                    customer_name, 
                    customer_type, 
                    customer_location, 
                    quantity_purchage, 
                    quantity_rejected, 
                    visit_type, 
                    person_meet, 
                    customer_phone, 
                    inprocess_by, 
                    DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                    closed_by, 
                    DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                    resolved_by, 
                    DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                    DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                    investigation_details, 
                    closed_comment,
                    action_taken 
                FROM 
                    product_issues_master 
                WHERE 
                    is_active != 5 AND
                    DATE(ticket_date) >= ? AND DATE(ticket_date) <= ?  AND
                    ticket_category=?  AND
                    is_active=? AND ticket_location IN (${data_09})
                             
                ORDER BY 
                    ticket_id DESC;`;

            pool.query(all_data, [startDate_formated, endDate_formated, category, ticket_sts], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
        })
    })

        }
	     else if (startDate_formated !== '' && endDate_formated !== '' && category !== '' && ticket_sts !== '' && (req.session.role === "QUILITY TEAM" && req.session.designation === "QC")) {

            let all_data = `
                SELECT
                    is_active,
                    DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                    ticket_id,
                    ticket_category,
                    ticket_type,
                    ticket_location,
		    raised_by,
                    description,
                    product_category,
                    product_name,
                    sku,
                    batch_no,
                    manufacturing_date,
                    customer_name,
                    customer_type,
                    customer_location,
                    quantity_purchage,
                    quantity_rejected,
                    visit_type,
                    person_meet,
                    customer_phone,
                    inprocess_by,
                    DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at,
                    closed_by,
                    DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at,
                    resolved_by,
                    DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                    DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                    investigation_details,
                    closed_comment,
                    action_taken
                FROM
                    product_issues_master
                WHERE
                    is_active != 5 AND ticket_category=? AND is_active=?
                ORDER BY
                    ticket_id DESC;`;

            pool.query(all_data, [category, ticket_sts], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });

	     }
       

        else if (ticket_sts  !== '' && category !== '' && (endDate_formated == '' || endDate_formated == undefined) && (startDate_formated == '' || startDate_formated == undefined) && (req.session.role === "MANAGER" || req.session.role === "EMPLOYEE")) {
            let all_data = `
            SELECT 
                is_active, 
                DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                ticket_id,
                ticket_category, 
                ticket_type,
                ticket_location, 
                raised_by, 
                description, 
                product_category, 
                product_name, 
                sku, 
                batch_no, 
                manufacturing_date, 
                customer_name, 
                customer_type, 
                customer_location, 
                quantity_purchage, 
                quantity_rejected, 
                visit_type, 
                person_meet, 
                customer_phone, 
                inprocess_by, 
                DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                closed_by, 
                DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                resolved_by, 
                DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                investigation_details, 
                closed_comment,
                action_taken 
            FROM product_issues_master 
            WHERE is_active != 5 AND
                raised_by=? AND
                ticket_category=? AND	
                is_active=?
                ORDER BY ticket_id DESC;`;

        pool.query(all_data, [employeeDataString, category, ticket_sts ], (err, all_result) => {
            if (err) throw err;
            console.log(all_result, 'all_resultall_resultall_resultddee');
            res.send({ all_result: all_result });
        });

                    } 
        else if (ticket_sts  !== '' && category !== '' && (endDate_formated == '' || endDate_formated == undefined) && (startDate_formated == '' || startDate_formated == undefined) && (req.session.designation === "QH" || req.session.role === "SUPER_ADMIN")) {
            let all_data = `
                SELECT 
                    is_active, 
                    DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                    ticket_id,
                    ticket_category, 
                    ticket_type,
                    ticket_location, 
                    raised_by, 
                    description, 
                    product_category, 
                    product_name, 
                    sku, 
                    batch_no, 
                    manufacturing_date, 
                    customer_name, 
                    customer_type, 
                    customer_location, 
                    quantity_purchage, 
                    quantity_rejected, 
                    visit_type, 
                    person_meet, 
                    customer_phone, 
                    inprocess_by, 
                    DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                    closed_by, 
                    DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                    resolved_by, 
                    DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                    DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                    investigation_details, 
                    closed_comment,
                    action_taken 
                FROM product_issues_master 
                WHERE is_active != 5 AND
                    ticket_category=? AND	
                    is_active=?
                    ORDER BY ticket_id DESC;`;
            pool.query(all_data, [ category, ticket_sts ], (err, all_result) => {
                if (err) throw err;
                // console.log(all_result, 'new_filter');
                res.send({ all_result: all_result });
                });
                    }
                    else if (ticket_sts  !== '' && category !== '' && (endDate_formated == '' || endDate_formated == undefined) && (startDate_formated == '' || startDate_formated == undefined) && req.session.role === "QUILITY TEAM"  && (req.session.designation === "CEE" )) {

                        let c_locationData = `SELECT complaint_location FROM cms_email_type WHERE email_to =?`;

                        pool.query(c_locationData,[email], async (err, c_locationData_result) => {

                            console.log(c_locationData_result,'c_locationData_result')
                            if (err) {
                                console.error("Error retrieving data from cms_email_type table:", err);
                                return;
                            }
                            let c_loc = c_locationData_result[0].complaint_location.split(',');
                            let loc = c_loc.join(',').replace(/\[|\]/g, '');
                            let comp_location_query = `SELECT * FROM complaint_location WHERE ID IN (${loc})`;
                            pool.query(comp_location_query, async (error, comp_location_result) => {
                                if (error) {
                                    console.error("Error retrieving data from complaint_location table:", error);
                                    return;
                                }

                                    let ar_data = [];
                                    comp_location_result.forEach(row => {
                                        ar_data.push(row.c_location);
                                    });

                                let comp_loca = JSON.stringify(ar_data);
                                let data_09 = comp_loca.replaceAll("]","").replaceAll("[","").replaceAll('"',"'");

                        let all_data = `
                            SELECT 
                                is_active, 
                                DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                                ticket_id,
                                ticket_category, 
                                ticket_type,
                                ticket_location, 
                                raised_by, 
                                description, 
                                product_category, 
                                product_name, 
                                sku, 
                                batch_no, 
                                manufacturing_date, 
                                customer_name, 
                                customer_type, 
                                customer_location, 
                                quantity_purchage, 
                                quantity_rejected, 
                                visit_type, 
                                person_meet, 
                                customer_phone, 
                                inprocess_by, 
                                DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                                closed_by, 
                                DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                                resolved_by, 
                                DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                                DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                                investigation_details, 
                                closed_comment,
                                action_taken 
                            FROM product_issues_master 
                            WHERE is_active != 5 AND
                                ticket_category=? AND	
                                is_active=? AND ticket_location IN (${data_09})
                                ORDER BY ticket_id DESC;`;
                        pool.query(all_data, [ category, ticket_sts ], (err, all_result) => {
                            if (err) throw err;
                            res.send({ all_result: all_result });
                            });
                            
                        })
                    })
                }  else if (ticket_sts  !== '' && category !== '' && (endDate_formated == '' || endDate_formated == undefined) && (startDate_formated == '' || startDate_formated == undefined) && (req.session.role === "QUILITY TEAM"  && req.session.designation === "QC")) {
            
                                    let all_data = `
                                        SELECT 
                                            is_active, 
                                            DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                                            ticket_id,
                                            ticket_category, 
                                            ticket_type,
                                            ticket_location, 
                                            raised_by, 
                                            description, 
                                            product_category, 
                                            product_name, 
                                            sku, 
                                            batch_no, 
                                            manufacturing_date, 
                                            customer_name, 
                                            customer_type, 
                                            customer_location, 
                                            quantity_purchage, 
                                            quantity_rejected, 
                                            visit_type, 
                                            person_meet, 
                                            customer_phone, 
                                            inprocess_by, 
                                            DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                                            closed_by, 
                                            DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                                            resolved_by, 
                                            DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                                            DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                                            investigation_details, 
                                            closed_comment,
                                            action_taken 
                                        FROM product_issues_master 
                                        WHERE is_active != 5 AND
                                            ticket_category=? AND	
                                            is_active=? 
                                            ORDER BY ticket_id DESC;`;
                                    pool.query(all_data, [ category, ticket_sts ], (err, all_result) => {
                                        if (err) throw err;
                                        res.send({ all_result: all_result });
                                        });
                                         
                            }
        //filter when Complaint StartDate, EndDate and Category selected js start
        //filter when Complaint StartDate, EndDate and Category selected js start




        else if (startDate_formated !== '' && endDate_formated !== '' &&  category !== '' && (ticket_sts == '' || ticket_sts == undefined)  && (req.session.role === "MANAGER" || req.session.role === "EMPLOYEE")) {
            let all_data = `
            SELECT
                is_active,
                DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                ticket_id,
                ticket_category,
                ticket_type,
                ticket_location,
                raised_by,
                description,
                product_category,
                product_name,
                sku,
                batch_no,
                manufacturing_date,
                customer_name,
                customer_type,
                customer_location,
                quantity_purchage,
                quantity_rejected,
                visit_type,
                person_meet,
                customer_phone,
                inprocess_by,
                DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at,
                closed_by,
                DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at,
                resolved_by,
                DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                investigation_details,
                closed_comment,
                action_taken
            FROM product_issues_master
            WHERE is_active != 5 AND
                DATE(ticket_date) >= ? AND DATE(ticket_date) <= ?  AND
                ticket_category=? AND
                raised_by=?
                ORDER BY ticket_id DESC;`;

        pool.query(all_data, [startDate_formated, endDate_formated, category, employeeDataString], (err, all_result) => {
            if (err) throw err;
            console.log(all_result, 'all_resultall_resultall_resultddee');
            res.send({ all_result: all_result });
        });

                    }
        else if(startDate_formated !== '' && endDate_formated !== '' &&  category !== '' && (ticket_sts == '' || ticket_sts == undefined)  && (req.session.role === "SUPER_ADMIN" || req.session.designation === "QC")) {
            let all_data = `
                SELECT
                    is_active,
                    DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                    ticket_id,
                    ticket_category,
                    ticket_type,
                    ticket_location,
                    raised_by,
                    description,
                    product_category,
                    product_name,
                    sku,
                    batch_no,
                    manufacturing_date,
                    customer_name,
                    customer_type,
                    customer_location,
                    quantity_purchage,
                    quantity_rejected,
                    visit_type,
                    person_meet,
                    customer_phone,
                    inprocess_by,
                    DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at,
                    closed_by,
                    DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at,
                    resolved_by,
                    DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                    DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                    investigation_details,
                    closed_comment,
                    action_taken
                FROM product_issues_master
                WHERE is_active != 5 AND
                    DATE(ticket_date) >= ? AND DATE(ticket_date) <= ?  AND
                    ticket_category=?

                    ORDER BY ticket_id DESC;`;
            pool.query(all_data, [startDate_formated, endDate_formated, category], (err, all_result) => {
                if (err) throw err;
                // console.log(all_result, 'new_filter');
                res.send({ all_result: all_result });
                });
                    }


                    else if(startDate_formated !== '' && endDate_formated !== '' &&  category !== '' && (ticket_sts == '' || ticket_sts == undefined)  && (req.session.role === "QUILITY TEAM"  && req.session.designation === "CEE" )) {


                        let c_locationData = `SELECT complaint_location FROM cms_email_type WHERE email_to =?`;

                        pool.query(c_locationData,[email], async (err, c_locationData_result) => {

                            console.log(c_locationData_result,'c_locationData_result')
                            if (err) {
                                console.error("Error retrieving data from cms_email_type table:", err);
                                return;
                            }
                            let c_loc = c_locationData_result[0].complaint_location.split(',');
                            let loc = c_loc.join(',').replace(/\[|\]/g, '');
                            let comp_location_query = `SELECT * FROM complaint_location WHERE ID IN (${loc})`;
                            pool.query(comp_location_query, async (error, comp_location_result) => {
                                if (error) {
                                    console.error("Error retrieving data from complaint_location table:", error);
                                    return;
                                }

                                    let ar_data = [];
                                    comp_location_result.forEach(row => {
                                        ar_data.push(row.c_location);
                                    });

                                let comp_loca = JSON.stringify(ar_data);
                                let data_09 = comp_loca.replaceAll("]","").replaceAll("[","").replaceAll('"',"'");


                        let all_data = `
                            SELECT
                                is_active,
                                DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,
                                ticket_id,
                                ticket_category,
                                ticket_type,
                                ticket_location,
                                raised_by,
                                description,
                                product_category,
                                product_name,
                                sku,
                                batch_no,
                                manufacturing_date,
                                customer_name,
                                customer_type,
                                customer_location,
                                quantity_purchage,
                                quantity_rejected,
                                visit_type,
                                person_meet,
                                customer_phone,
                                inprocess_by,
                                DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at,
                                closed_by,
                                DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at,
                                resolved_by,
                                DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
                                DATE_FORMAT(investigated_at, '%d-%m-%y') AS formated_investigated_at ,
                                investigation_details,
                                closed_comment,
                                action_taken
                            FROM product_issues_master
                            WHERE is_active != 5 AND
                                DATE(ticket_date) >= ? AND DATE(ticket_date) <= ?  AND
                                ticket_category=? AND ticket_location IN (${data_09})

                                ORDER BY ticket_id DESC;`;
                        pool.query(all_data, [startDate_formated, endDate_formated, category], (err, all_result) => {
                            if (err) throw err;
                            // console.log(all_result, 'new_filter');
                            res.send({ all_result: all_result });
                            });
                        })
                    })
                                }
        //filter when Complaint StartDate, EndDate and Category selected js end
        //filter when Complaint StartDate, EndDate and Category selected js end

        
   


    } catch (err) {
        console.log(err, 'err');
    }
});

router.get('/reopen_tickets',authenticate, async (req, res) => {

    try {
        
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
        let role=req.session.role
        console.log(role,'role_fjakl')
        let pool = await dbConnection()
        let query = `SELECT DISTINCT c_category FROM complaint_type `
        pool.query(query, (err, results1) => {
            if (err) throw err;
            let status = `SELECT DISTINCT action_id ,action_value FROM cms_status;`
            pool.query(status, (err, results2) => {
                if (err) throw err;
            
            else if( req.session.role==="MANAGER" || req.session.role==="EMPLOYEE"){
               let all_data=
               `SELECT 
                reopen_issues_master.is_active,
                DATE_FORMAT(reopen_issues_master.ticket_date,'%d-%m-%Y') AS reopen_ticket_date,
                reopen_issues_master.reopen_ticket_id,
                reopen_issues_master.pre_ticket_id, 
                product_issues_master.ticket_category, 
                product_issues_master.ticket_type, 
                product_issues_master.raised_by AS pre_ticket_raised_by,
                reopen_issues_master.raised_by AS reopen_ticket_raised_by,
                DATE_FORMAT(product_issues_master.ticket_date,'%d-%m-%Y') AS pre_ticket_date,
                product_issues_master.description, 
                product_issues_master.product_category,
                product_issues_master.product_name,
                product_issues_master.sku,
                product_issues_master.batch_no,
                product_issues_master.manufacturing_date,
                product_issues_master.customer_name,
                product_issues_master.customer_type, 
                product_issues_master.customer_location, 
                product_issues_master.quantity_purchage, 
                product_issues_master.quantity_rejected, 
                product_issues_master.visit_type, 
                product_issues_master.person_meet, 
                product_issues_master.customer_phone, 
                reopen_issues_master.inprocess_by, 
                DATE_FORMAT(reopen_issues_master.inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                reopen_issues_master.resolved_by, 
                DATE_FORMAT(reopen_issues_master.resolved_at, '%d-%m-%Y') AS formatted_resolved_at, 
                DATE_FORMAT(reopen_issues_master.investigated_at, '%d-%m-%Y' ) AS formated_investigated_at, 
                reopen_issues_master.investigation_details, 
                reopen_issues_master.action_taken, 
                reopen_issues_master.closed_by, 
                DATE_FORMAT(reopen_issues_master.closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                reopen_issues_master.closed_comment 
                FROM reopen_issues_master, product_issues_master 
                WHERE product_issues_master.ticket_id = reopen_issues_master.pre_ticket_id AND
                reopen_issues_master.raised_by=?
                ORDER BY reopen_issues_master.reopen_ticket_id DESC;`
                pool.query(all_data,[employeeDataString], (err,results3) => {
                    
                    if (err) throw err;
                res.render('reopen_tickets', { data1: results1, data2: results2, all_result:results3, employeeDataString:employeeDataString})
                });
            }

            else if( req.session.role==="QUILITY TEAM" || req.session.role=="SUPER_ADMIN" ){
                let all_data=
                `SELECT 
                 reopen_issues_master.is_active,
                 DATE_FORMAT(reopen_issues_master.ticket_date,'%d-%m-%Y') AS reopen_ticket_date,
                 reopen_issues_master.reopen_ticket_id,
                 reopen_issues_master.pre_ticket_id,
                 product_issues_master.ticket_category, 
                 product_issues_master.ticket_type, 
                 product_issues_master.raised_by AS pre_ticket_raised_by,
                 reopen_issues_master.raised_by AS reopen_ticket_raised_by,
                 DATE_FORMAT(product_issues_master.ticket_date,'%d-%m-%Y') AS pre_ticket_date,
                 product_issues_master.description, 
                 product_issues_master.product_category,
                 product_issues_master.product_name,
                 product_issues_master.sku,
                 product_issues_master.batch_no,
                 product_issues_master.manufacturing_date,
                 product_issues_master.customer_name,
                 product_issues_master.customer_type, 
                 product_issues_master.customer_location, 
                 product_issues_master.quantity_purchage, 
                 product_issues_master.quantity_rejected, 
                 product_issues_master.visit_type, 
                 product_issues_master.person_meet, 
                 product_issues_master.customer_phone, 
                 reopen_issues_master.inprocess_by, 
                 DATE_FORMAT(reopen_issues_master.inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                 reopen_issues_master.resolved_by, 
                 DATE_FORMAT(reopen_issues_master.resolved_at, '%d-%m-%Y') AS formatted_resolved_at, 
                 DATE_FORMAT(reopen_issues_master.investigated_at, '%d-%m-%Y' ) AS formated_investigated_at, 
                 reopen_issues_master.investigation_details, 
                 reopen_issues_master.action_taken, 
                 reopen_issues_master.closed_by, 
                 DATE_FORMAT(reopen_issues_master.closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                 reopen_issues_master.closed_comment 
                 FROM 
                 reopen_issues_master, product_issues_master 
                 WHERE 
                 product_issues_master.ticket_id = reopen_issues_master.pre_ticket_id 
                 ORDER BY 
                 reopen_issues_master.reopen_ticket_id DESC;`
                 pool.query(all_data, (err,results3) => {
                     console.log(results3,'weueicii')
                     if (err) throw err;
                 res.render('reopen_tickets', { data1: results1, data2: results2, all_result:results3, employeeDataString:employeeDataString})
                 });
             }else if(req.session.role==="BUSINESS HEAD"){
                
            let email =req.session.teEmailId;

            let c_locationData = `SELECT c_category FROM product_equation WHERE business_head_email =?`;
                        
                    pool.query(c_locationData,[email], async (err, c_locationData_result) => {
                        if (err) {
                            console.error("Error retrieving data from cms_email_type table:", err);
                            return;
                        }
                        let product_name = c_locationData_result[0].c_category
                
                let all_data=
                `SELECT 
                 reopen_issues_master.is_active,
                 DATE_FORMAT(reopen_issues_master.ticket_date,'%d-%m-%Y') AS reopen_ticket_date,
                 reopen_issues_master.reopen_ticket_id,
                 reopen_issues_master.pre_ticket_id,
                 product_issues_master.ticket_category, 
                 product_issues_master.ticket_type, 
                 product_issues_master.raised_by AS pre_ticket_raised_by,
                 reopen_issues_master.raised_by AS reopen_ticket_raised_by,
                 DATE_FORMAT(product_issues_master.ticket_date,'%d-%m-%Y') AS pre_ticket_date,
                 product_issues_master.description, 
                 product_issues_master.product_category,
                 product_issues_master.product_name,
                 product_issues_master.sku,
                 product_issues_master.batch_no,
                 product_issues_master.manufacturing_date,
                 product_issues_master.customer_name,
                 product_issues_master.customer_type, 
                 product_issues_master.customer_location, 
                 product_issues_master.quantity_purchage, 
                 product_issues_master.quantity_rejected, 
                 product_issues_master.visit_type, 
                 product_issues_master.person_meet, 
                 product_issues_master.customer_phone, 
                 reopen_issues_master.inprocess_by, 
                 DATE_FORMAT(reopen_issues_master.inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                 reopen_issues_master.resolved_by, 
                 DATE_FORMAT(reopen_issues_master.resolved_at, '%d-%m-%Y') AS formatted_resolved_at, 
                 DATE_FORMAT(reopen_issues_master.investigated_at, '%d-%m-%Y' ) AS formated_investigated_at, 
                 reopen_issues_master.investigation_details, 
                 reopen_issues_master.action_taken, 
                 reopen_issues_master.closed_by, 
                 DATE_FORMAT(reopen_issues_master.closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                 reopen_issues_master.closed_comment 
                 FROM 
                 reopen_issues_master, product_issues_master 
                 WHERE 
                 product_issues_master.ticket_id = reopen_issues_master.pre_ticket_id AND product_issues_master.ticket_category = ? 
                 ORDER BY 
                 reopen_issues_master.reopen_ticket_id DESC;`
                 pool.query(all_data,[product_name], (err,results3) => {
                     console.log(results3,'weueicii')
                     if (err) throw err;
                 res.render('reopen_tickets', { data1: results1, data2: results2, all_result:results3, employeeDataString:employeeDataString})
                 });
                })
             }

            });
        });
    }
    


     catch (error) {
        logger.error('error in get complaint_form:: ', error)
    }
})

router.post('/filter_reopen_ticket_data', authenticate, async (req, res) => {
    try {
        let pool = await dbConnection();
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;

        let { startDate, endDate, category, ticket_sts } = req.body;

        let startDate_formated = moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        console.log(startDate_formated, 'startDate_formated');

        let endDate_formated = moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        console.log(endDate_formated, 'endDate_formated');
        console.log(category, 'category_fjiije');
        console.log(ticket_sts, 'ticket_sts_fjiije');

        if (startDate_formated !== '' && endDate_formated !== '' && (category == '' || category == undefined) && (ticket_sts == '' || ticket_sts == undefined) && (req.session.role === "MANAGER" || req.session.role === "EMPLOYEE")) {
           

            let all_data = 
            `SELECT 
                reopen_issues_master.is_active,
                DATE_FORMAT(reopen_issues_master.ticket_date,'%d-%m-%Y') AS reopen_ticket_date,
                reopen_issues_master.reopen_ticket_id,
                reopen_issues_master.pre_ticket_id, 
                product_issues_master.ticket_type, 
                product_issues_master.raised_by AS pre_ticket_raised_by,
                reopen_issues_master.raised_by AS reopen_ticket_raised_by,
                DATE_FORMAT(product_issues_master.ticket_date,'%d-%m-%Y') AS pre_ticket_date,
                product_issues_master.description, 
                product_issues_master.product_category,
                product_issues_master.product_name,
                product_issues_master.sku,
                product_issues_master.batch_no,
                product_issues_master.manufacturing_date,
                product_issues_master.customer_name,
                product_issues_master.customer_type, 
                product_issues_master.customer_location, 
                product_issues_master.quantity_purchage, 
                product_issues_master.quantity_rejected, 
                product_issues_master.visit_type, 
                product_issues_master.person_meet, 
                product_issues_master.customer_phone, 
                reopen_issues_master.inprocess_by, 
                DATE_FORMAT(reopen_issues_master.inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
                reopen_issues_master.resolved_by, 
                DATE_FORMAT(reopen_issues_master.resolved_at, '%d-%m-%Y') AS formatted_resolved_at, 
                DATE_FORMAT(reopen_issues_master.investigated_at, '%d-%m-%Y' ) AS formated_investigated_at, 
                reopen_issues_master.investigation_details, 
                reopen_issues_master.action_taken, 
                reopen_issues_master.closed_by, 
                DATE_FORMAT(reopen_issues_master.closed_at, '%d-%m-%Y') AS formatted_closed_at, 
                reopen_issues_master.closed_comment 
                FROM 
                    reopen_issues_master, product_issues_master 
                WHERE 
                    product_issues_master.ticket_id = reopen_issues_master.pre_ticket_id AND
                    reopen_issues_master.raised_by=? AND
                    DATE(reopen_issues_master.ticket_date) >= ? AND DATE(reopen_issues_master.ticket_date) <= ?
                ORDER BY 
                    reopen_issues_master.reopen_ticket_id DESC;`

            pool.query(all_data, [employeeDataString, startDate_formated, endDate_formated], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
        } 
        
        else if (startDate_formated !== '' && endDate_formated !== '' && category !== '' && ticket_sts !== '' && (req.session.role === "MANAGER" || req.session.role === "EMPLOYEE")) {
         

            let all_data = `
            SELECT 
            reopen_issues_master.is_active,
            DATE_FORMAT(reopen_issues_master.ticket_date,'%d-%m-%Y') AS reopen_ticket_date,
            reopen_issues_master.reopen_ticket_id,
            reopen_issues_master.pre_ticket_id, 
            product_issues_master.ticket_type, 
            product_issues_master.raised_by AS pre_ticket_raised_by,
            reopen_issues_master.raised_by AS reopen_ticket_raised_by,
            DATE_FORMAT(product_issues_master.ticket_date,'%d-%m-%Y') AS pre_ticket_date,
            product_issues_master.description, 
            product_issues_master.product_category,
            product_issues_master.product_name,
            product_issues_master.sku,
            product_issues_master.batch_no,
            product_issues_master.manufacturing_date,
            product_issues_master.customer_name,
            product_issues_master.customer_type, 
            product_issues_master.customer_location, 
            product_issues_master.quantity_purchage, 
            product_issues_master.quantity_rejected, 
            product_issues_master.visit_type, 
            product_issues_master.person_meet, 
            product_issues_master.customer_phone, 
            reopen_issues_master.inprocess_by, 
            DATE_FORMAT(reopen_issues_master.inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
            reopen_issues_master.resolved_by, 
            DATE_FORMAT(reopen_issues_master.resolved_at, '%d-%m-%Y') AS formatted_resolved_at, 
            DATE_FORMAT(reopen_issues_master.investigated_at, '%d-%m-%Y' ) AS formated_investigated_at, 
            reopen_issues_master.investigation_details, 
            reopen_issues_master.action_taken, 
            reopen_issues_master.closed_by, 
            DATE_FORMAT(reopen_issues_master.closed_at, '%d-%m-%Y') AS formatted_closed_at, 
            reopen_issues_master.closed_comment 
            FROM 
                reopen_issues_master, product_issues_master 
            WHERE
                product_issues_master.ticket_id = reopen_issues_master.pre_ticket_id AND
                reopen_issues_master.raised_by=? AND
                DATE(reopen_issues_master.ticket_date) >= ? AND DATE(reopen_issues_master.ticket_date) <= ? AND 
                product_issues_master.ticket_category=? AND
                reopen_issues_master.is_active=? 
                
            ORDER BY 
                reopen_issues_master.reopen_ticket_id DESC;`;

            pool.query(all_data, [employeeDataString, startDate_formated, endDate_formated, category, ticket_sts], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
        }

        else if (startDate_formated !== '' && endDate_formated !== '' && (category == '' || category == undefined) && (ticket_sts == '' || ticket_sts == undefined) && (req.session.role === "QUILITY TEAM" || req.session.role === "BUSINESS HEAD" || req.session.role === "SUPER_ADMIN")) {
         

            let all_data = `
            SELECT 
            reopen_issues_master.is_active,
            DATE_FORMAT(reopen_issues_master.ticket_date,'%d-%m-%Y') AS reopen_ticket_date,
            reopen_issues_master.reopen_ticket_id,
            reopen_issues_master.pre_ticket_id, 
            product_issues_master.ticket_type, 
            product_issues_master.raised_by AS pre_ticket_raised_by,
            reopen_issues_master.raised_by AS reopen_ticket_raised_by,
            DATE_FORMAT(product_issues_master.ticket_date,'%d-%m-%Y') AS pre_ticket_date,
            product_issues_master.description, 
            product_issues_master.product_category,
            product_issues_master.product_name,
            product_issues_master.sku,
            product_issues_master.batch_no,
            product_issues_master.manufacturing_date,
            product_issues_master.customer_name,
            product_issues_master.customer_type, 
            product_issues_master.customer_location, 
            product_issues_master.quantity_purchage, 
            product_issues_master.quantity_rejected, 
            product_issues_master.visit_type, 
            product_issues_master.person_meet, 
            product_issues_master.customer_phone, 
            reopen_issues_master.inprocess_by, 
            DATE_FORMAT(reopen_issues_master.inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
            reopen_issues_master.resolved_by, 
            DATE_FORMAT(reopen_issues_master.resolved_at, '%d-%m-%Y') AS formatted_resolved_at, 
            DATE_FORMAT(reopen_issues_master.investigated_at, '%d-%m-%Y' ) AS formated_investigated_at, 
            reopen_issues_master.investigation_details, 
            reopen_issues_master.action_taken, 
            reopen_issues_master.closed_by, 
            DATE_FORMAT(reopen_issues_master.closed_at, '%d-%m-%Y') AS formatted_closed_at, 
            reopen_issues_master.closed_comment 
            FROM 
                reopen_issues_master, product_issues_master 
            WHERE 
                product_issues_master.ticket_id = reopen_issues_master.pre_ticket_id AND
                reopen_issues_master.raised_by=? AND
                DATE(reopen_issues_master.ticket_date) >= ? AND DATE(reopen_issues_master.ticket_date) <= ?
            ORDER BY 
                reopen_issues_master.reopen_ticket_id DESC;`;

            pool.query(all_data, [ employeeDataString, startDate_formated, endDate_formated], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
        } 
        
        else if (startDate_formated !== '' && endDate_formated !== '' && category !== '' && ticket_sts !== '' && (req.session.role === "QUILITY TEAM" || req.session.role === "BUSINESS HEAD" || req.session.role === "SUPER_ADMIN")) {
           

            let all_data = `
            SELECT 
            reopen_issues_master.is_active,
            DATE_FORMAT(reopen_issues_master.ticket_date,'%d-%m-%Y') AS reopen_ticket_date,
            reopen_issues_master.reopen_ticket_id,
            reopen_issues_master.pre_ticket_id, 
            product_issues_master.ticket_type, 
            product_issues_master.raised_by AS pre_ticket_raised_by,
            reopen_issues_master.raised_by AS reopen_ticket_raised_by,
            DATE_FORMAT(product_issues_master.ticket_date,'%d-%m-%Y') AS pre_ticket_date,
            product_issues_master.description, 
            product_issues_master.product_category,
            product_issues_master.product_name,
            product_issues_master.sku,
            product_issues_master.batch_no,
            product_issues_master.manufacturing_date,
            product_issues_master.customer_name,
            product_issues_master.customer_type, 
            product_issues_master.customer_location, 
            product_issues_master.quantity_purchage, 
            product_issues_master.quantity_rejected, 
            product_issues_master.visit_type, 
            product_issues_master.person_meet, 
            product_issues_master.customer_phone, 
            reopen_issues_master.inprocess_by, 
            DATE_FORMAT(reopen_issues_master.inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
            reopen_issues_master.resolved_by, 
            DATE_FORMAT(reopen_issues_master.resolved_at, '%d-%m-%Y') AS formatted_resolved_at, 
            DATE_FORMAT(reopen_issues_master.investigated_at, '%d-%m-%Y' ) AS formated_investigated_at, 
            reopen_issues_master.investigation_details, 
            reopen_issues_master.action_taken, 
            reopen_issues_master.closed_by, 
            DATE_FORMAT(reopen_issues_master.closed_at, '%d-%m-%Y') AS formatted_closed_at, 
            reopen_issues_master.closed_comment 
            FROM 
                reopen_issues_master, product_issues_master 
            WHERE 
                product_issues_master.ticket_id = reopen_issues_master.pre_ticket_id AND
                reopen_issues_master.raised_by=? AND
                DATE(reopen_issues_master.ticket_date) >= ? AND DATE(reopen_issues_master.ticket_date) <= ? AND
                product_issues_master.ticket_category=? AND
                reopen_issues_master.is_active=?                 
            ORDER BY 
                reopen_issues_master.reopen_ticket_id DESC;`;

            pool.query(all_data, [employeeDataString, startDate_formated, endDate_formated, category, ticket_sts], (err, all_result) => {
                if (err) throw err;
                console.log(all_result, 'all_resultall_resultall_resultddee');
                res.send({ all_result: all_result });
            });
        }

    } catch (err) {
        console.log(err, 'err');
    }
});

router.get('/cms_status',authenticate,async (req,res)=>{
    try{
        let pool=await dbConnection();

        let query1 = `SELECT action_id, action_value FROM cms_status`;
        pool.query(query1,(err1,results1)=>{
            if(err1) throw err1;
            console.log(results1)
            res.json({status_Data:results1})
        })
    }
    catch(err){
        console.log(err,'err')
    }
})

router.get('/complaint_view/:ticket_id', authenticate, async (req, res) => {
    try {
        let ticket_id = req.params.ticket_id;
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;

        let pool = await dbConnection();

        let query1 = `
        SELECT 
        product_issues_master.ticket_id, 
        product_issues_master.product_category, 
        product_issues_master.raised_by, 
        product_issues_master.ticket_category, 
        product_issues_master.ticket_type, 
        product_issues_master.product_name,
        product_issues_master.sku, 
        product_issues_master.front_image, 
        product_issues_master.back_image, 
        product_issues_master.video_link, 
        product_issues_master.batch_no, 
        product_issues_master.manufacturing_date,  
        product_issues_master.description, 
        product_issues_master.visit_type, 
        product_issues_master.customer_name, 
        product_issues_master.customer_address, 
        product_issues_master.customer_location, 
        product_issues_master.customer_phone, 
        product_issues_master.quantity_purchage, 
        product_issues_master.quantity_rejected, 
        product_issues_master.is_active, 
        DATE_FORMAT(product_issues_master.ticket_date, '%d-%m-%Y, %h:%i:%s %p') AS ticket_Created_on, 
        product_issues_master.batch_no, 
        product_issues_master.customer_type,
        product_issues_master.person_meet,
        product_issues_master.investigated_at,
        product_issues_master.investigation_details,
        product_issues_master.action_taken,
        product_issues_master.inv_image_1,
        product_issues_master.inv_image_2,
        product_issues_master.inv_video,
        product_issues_master.ticket_location,
        product_issues_master.inprocess_by,
        DATE_FORMAT(product_issues_master.inprocess_at, '%d-%m-%Y, %h:%i:%s %p') AS formated_inprocess_at, 
        product_issues_master.resolved_by,
        DATE_FORMAT(product_issues_master.resolved_at, '%d-%m-%Y, %h:%i:%s %p') AS formated_resolved_at, 
        product_issues_master.closed_by,
        DATE_FORMAT(product_issues_master.closed_at, '%d-%m-%Y, %h:%i:%s %p') AS formated_closed_at,
        DATE_FORMAT(product_issues_master.investigated_at, '%d-%m-%Y') AS formate_investigated_at,
        cms_user_login.emp_number

        FROM product_issues_master, cms_user_login 
        WHERE product_issues_master.ticket_id = ${ticket_id} AND cms_user_login.emp_code= ${req.session.employeeId}`;


        pool.query(query1, (err1, results1) => {

            if (err1) throw err1;

            let ticket_location = results1[0].ticket_location
            let ticket_category = results1[0].ticket_category
            let product_category = results1[0].product_category


            let comp_location_query = `SELECT * FROM complaint_location WHERE c_location=?`
            pool.query(comp_location_query, [ticket_location], async (error, comp_location_result) => {

                let comp_loca = comp_location_result[0].id;


                if (error) {
                    console.error("Error retrieving data from complaint_location table:", error);
                    return;
                }


                let c_locationData = `SELECT email_to,email_cc FROM cms_email_type WHERE c_category = ? AND FIND_IN_SET(?, complaint_location) > 0`;

                pool.query(c_locationData, [ticket_category, comp_loca], async (err, c_locationData_result) => {
                    let email_to = c_locationData_result[0].email_to;

                    const email_cc_array = c_locationData_result[0].email_cc.split(',');


                    if (err) {
                        console.error("Error retrieving data from cms_email_type table:", err);
                        return;
                    }

                    let loginquery = `SELECT EMP_NAME FROM cms_user_login WHERE Emp_Email_ID=?`;
                    pool.query(loginquery, [email_to], async (loginquery_error, loginquery_result) => {



                        if (loginquery_error) {
                            console.error("Error retrieving data from cms_user_login table:", loginquery_error);
                            return;
                        }


                        let loginquery_cc = `SELECT EMP_NAME FROM cms_user_login WHERE Emp_Email_ID IN (?)`;
                        pool.query(loginquery_cc, [email_cc_array], async (loginquery_cc_error, loginquery_cc_result) => {



                            if (loginquery_cc_error) {
                                console.error("Error retrieving data from cms_user_login table:", loginquery_cc_error);
                                return;
                            }

                            let employeeNames = [];
                            for (let i = 0; i < loginquery_cc_result.length; i++) {
                                const empName = loginquery_cc_result[i].EMP_NAME;
                                employeeNames.push(empName);

                            }


                            let loginquery_to = `SELECT EMP_NAME,REP_MANAGER_NAME,RSM_ZSM_Name FROM cms_user_login WHERE EMP_CODE IN (?)`;
                            pool.query(loginquery_to, [req.session.employeeId], async (loginquery_to_error, loginquery_to_result) => {

                                console.log(loginquery_to_result, 'loginquery_to_result')

                                if (loginquery_to_error) {
                                    console.error("Error retrieving data from cms_user_login table:", loginquery_to_error);
                                    return;
                                }

                                let product = `SELECT business_head_email FROM product_equation WHERE c_category=? AND p_category=?`
                                pool.query(product, [ticket_category, product_category], async (loginquery_error, loginquery_bus) => {

                                   
                                    if (loginquery_error) {
                                        console.error("Error retrieving data from cms_user_login table:", loginquery_error);
                                        return;
                                    }

                                    let loginquery111 = loginquery_bus[0].business_head_email
                                   

                                    let loginqu = `SELECT EMP_NAME FROM cms_user_login WHERE Emp_Email_ID=?`;
                                    pool.query(loginqu, [loginquery111], async (loginqu_error, loginqu_result) => {

                                        
                                        if (loginqu_error) {
                                            console.error("Error retrieving data from cms_user_login table:", loginqu_error);
                                            return;
                                        }



                                        res.render('complaint_view', {
                                            data1: results1,
                                            ticket_id: ticket_id,
                                            employeeDataString: employeeDataString,
                                            data_1: loginquery_result,
                                            data_2: employeeNames,
                                            data_3: loginquery_to_result,
                                            data_4: loginqu_result

                                        })
                                    });
                                });
                            });
                        })
                    })

                })
            })

        })

    } catch (err) {
        console.log(err);
    }
});



router.post('/send_status_email', async (req, res) => {

    try {
        let pool = await dbConnection();

      let format = formatCurrentDate2();
      let time = getCurrentTime()

      let { tkt_status_chg, ticket_id, ticket_catgy,customer_name,customer_phone,product_catgy,batch_no,sku,customer_location,quantity_purchage,quantity_rejected,manufacturing_date,ticket_type,product_name, sales_preson_ph_no, ticket_created_on,ticket_location} = req.body;

             let tick_raised_by=`SELECT raised_by FROM product_issues_master WHERE ticket_id= ${ticket_id};`
        pool.query(tick_raised_by, (errrr,tic_result) => {
            let ti_raised_by = tic_result[0].raised_by;
             console.log(ti_raised_by,'ti_raised_by')

      let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
      let emp_code=req.session.employeeId

      
  let comp_location_query = `SELECT * FROM complaint_location WHERE c_location=?`
  pool.query(comp_location_query,[ticket_location], async (error, comp_location_result) => {
console.log(comp_location_result,'comp_location_result')
      let comp_loca = comp_location_result[0].id;
      if (error) {
          console.error("Error retrieving data from complaint_location table:", error);
          return;
      }
     

      let c_locationData = `SELECT email_to, email_cc,levels FROM cms_email_type WHERE c_category = ? AND FIND_IN_SET(?, complaint_location) > 0`;

      pool.query(c_locationData, [ticket_catgy, comp_loca], async (err, c_locationData_result) => {

          let email_to=c_locationData_result[0].email_to;
          let email_cc=c_locationData_result[0].email_cc;
          let levels = c_locationData_result[0].levels;
         
          if (err) {
              console.error("Error retrieving data from cms_email_type table:", err);
              return;
          }

       

      
    let product = `SELECT business_head_email FROM product_equation WHERE c_category=?`
  
    pool.query(product,[ticket_catgy],async(error,product_result) => {

        let product_res = product_result[0].business_head_email

        let issue_maaster= `SELECT raised_by FROM product_issues_master where ticket_id=?`
        pool.query(issue_maaster,[ticket_id],async(errorr,resultss)=>{
            if (errorr) throw errorr;

            let emp_id = resultss[0].raised_by.split(":");

            let emp_= emp_id[0];
           

        let mailquery = `SELECT * FROM cms_user_login WHERE EMP_CODE=?`
        pool.query(mailquery, [emp_], async (error, results) => {
        if (error) throw error;
            
        let cc1 = results[0].Emp_Email_ID
        
        let cc2 = results[0].REP_MANAGER_Email_ID
        let receiver1 = results[0].RSM_ZSM_Email_ID
       
        let toAddresses = `${cc1}`;
        let ccAddresses = `${receiver1},${cc2}`;
        let business_head_email =`${product_res}`;
          
      
        let transporter = nodemailer.createTransport({
            host: 'jublcorp.mail.protection.outlook.com',
            port: 25,
            secure: false,
            auth: {
                user: 'g-smart.helpdesk@jubl.com',
                pass: 'jubl@123'
            },
            debug: true
        });

      if( tkt_status_chg == 2 ){
      let tkt_status="In-Process";

      let mailOptions1 = {
        from: "g-smart.helpdesk@jubl.com",
        to: email_to,
        cc: [email_cc,business_head_email,],
        subject: `Ticket Id:${ticket_id}, ${tkt_status}, Raised by : ${ti_raised_by}`,


        html:`<!DOCTYPE html>
        <html lang="en">
 
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CMS</title>
        </head>
 
        <body>
 
        <div style="font-size: 13px;>Dear Team,</div>
                       
                         <div style="font-size: 13px;">New Complaint has been raised by ( ${ti_raised_by} ).</div>
                         <div style="font-size: 13px;">Please find the complaint details below:</div>
                         <div style="font-size: 13px;">Status: ${tkt_status}</div>
 
 
 
                         
                     <div style="margin-top: 40px;">
            <div style="width: 100%;margin-top: 20px;">
                <div style="width: 80%; border: 1px solid lightgray;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
                border-radius: 10px 10px 10px 10px;">
             <div style="text-align: center;color: white;background: #0473cf;padding-top:8px !important;padding-bottom:8px !important;border-radius: 10px 10px 0px 0px;font-size: 15px;font-weight: 500;">Ticket Details</div>
 
                    <table style="width: 100%;
                        padding-bottom: 10px;
                        font-size: 13px;
                        color: black;
                        ">                
                        <tr>
                            <td style=" padding: 8px 0px 0px 10px;">Complaint No</td>
                            <td style=" padding-top: 8px;">${ticket_id}</td>
                        </tr>
 
                        <tr>
                            <td style=" padding: 8px 0px 0px 10px;">Complaint In-Process on</td>
                            <td style=" padding-top: 8px;">
                                ${format}
                                <br>
                                ${time}
                            </td>
                        </tr>
 
                        <tr>
                            <td style=" padding: 8px 0px 0px 10px;">Ticket Catogory</td>
                            <td style=" padding-top: 8px;">${ticket_catgy}</td>
                        </tr>
        
                        <tr>
                            <td style=" padding: 8px 0px 0px 10px;">Nature of Complaint	</td>
                            <td style=" padding-top: 8px;">${ticket_type}</td>
                        </tr>
 
                        <tr>
                            <td style=" padding: 8px 0px 0px 10px;">Customer Name</td>
                            <td style=" padding-top: 8px;">${customer_name}</td>
                        </tr>
 
                        <tr>
                            <td style=" padding: 8px 0px 0px 10px;">Customer Phone No.</td>
                            <td style=" padding-top: 8px;">${customer_phone}</td>
                        </tr>
 
                        <tr>
                            <td style=" padding: 8px 0px 0px 10px;">Sales Person Phone No.</td>
                            <td style=" padding-top: 8px;">${sales_preson_ph_no}</td>
                        </tr>
 
 
                    </table>
                </div>
        </div>
 
 
 
 
 
        <div 
        style="width: 100%;
        margin-top: 15px;
        ">
            <div 
            style="
            width: 80%;
            border: 1px solid lightgray;
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
            border-radius: 10px 10px 10px 10px;    
            ">
 
            <div 
            style="                 
            text-align: center;
            color: white;
            background: #0473cf;
            padding: 8px 0px 8px 0px;
            border-radius: 10px 10px 0px 0px;
            font-size: 15px;
            font-weight: 500;
            ">
                Product Details
            </div>
                <table style="
                    width: 100%;
                    padding-bottom: 10px;
                    font-size: 13px;      
                    color: black;             
                    ">
            
                    <tr>
                        <td style=" padding: 8px 0px 0px 10px;">Product Catogory</td>
                        <td style=" padding-top: 8px;">${product_catgy}</td>
                    </tr>
 
                    <tr>
                        <td style=" padding: 8px 0px 0px 10px;">Batch No</td>
                        <td style=" padding-top: 8px;">
                            ${batch_no}
                        </td>
                    </tr>
 
                    <tr>
                        <td style=" padding: 8px 0px 0px 10px;">Sku/Product Name</td>
                        <td style=" padding-top: 8px;">
                             ${product_name}
                            <br>
                             ${sku}
                        </td>
                    </tr>
 
                    <tr>
                        <td style=" padding: 8px 0px 0px 10px;">Location</td>
                        <td style=" padding-top: 8px;">
                        ${customer_location}
                        </td>
                    </tr>
 
                    <tr>
                        <td style=" padding: 8px 0px 0px 10px;">Quantity Purchase</td>
                        <td style=" padding-top: 8px;">${quantity_purchage}</td>
                    </tr>
 
                    <tr>
                        <td style=" padding: 8px 0px 0px 10px;">Quantity Rejected</td>
                        <td style=" padding-top: 8px;">${quantity_rejected}</td>
                    </tr>
 
                    <tr>
                        <td style=" padding: 8px 0px 0px 10px;">Manufacturing Date</td>
                        <td style=" padding-top: 8px;">${manufacturing_date}</td>
                    </tr>
 
 
                </table>
            </div>
        </div>
 
        <div style="font-size: 15px; margin-top: 30px; font-weight: bold;">
            Thanks & Regards
        </div>
 
        <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
            JACPL Quality Team
        </div>
        <div style="font-style: italic; font-size: 10px;">
            *This is a system generated email, do not reply to this email id.
        </div>
 
        </body>
 
        </html>`
       
        
    };
  
      let mailOptions2 = {
        from: "g-smart.helpdesk@jubl.com",
        to: toAddresses,
        cc:ccAddresses,
        subject: `Ticket Id:${ticket_id}, in-process, Raised by : ${ti_raised_by}`,

        html: `
        
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CMS</title>
        
        </head>
        <body>
        
          <div style="font-size: 13px;">Dear ${req.session.emp_Name},</div>
          <div style="font-size: 13px;">
          Please find the details below.
          </div>
        
        
          <div style="color: white; background-color: #0dcaf0; border-radius: 10px ;padding: 8px;  margin-top: 10px;">
              <div style="color: #0dcaf0;">empty </div> 
              <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp;  Complaint No</div>
              <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ticket_id}</div>
              <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
              <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${ticket_created_on} </div>
              <div style="color: #0dcaf0;">empty </div> 
        
          </div>
        
          <div style="color: white; background-color: #198754; border-radius: 10px ;padding: 8px; margin-top: 10px;">
            <div style="color: #198754;">empty </div> 
            <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Status:</div>
            <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ tkt_status }</div>
            <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
            <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time} </div>
            <div style="color: #198754;">empty </div> 
          </div>
        
          <div style="color: white; background-color: #ffc107; border-radius: 10px ;padding: 8px; margin-top: 10px;">
            <div style="color: #ffc107;">empty </div> 
            <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Inprocess By:</div>
            <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${employeeDataString}</div>
            <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
            <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
            <div style="color: #ffc107;">empty </div> 
          </div>
        
        
        
        <div style="font-size: 15px; margin-top: 60px; font-weight: bold;">
            Thanks & Regards
        </div>
        
        <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
            JACPL Quality Team
        </div>
        <div style="font-style: italic; font-size: 10px;">
            *This is a system generated email, do not reply to this email id.
        </div>
        
        
        
          
        </body>
        </html>
                                
        
        
            `,
    };
    
  
      const info1 = await transporter.sendMail(mailOptions1);
      console.log('Email 1 sent: ' + info1.response);
  
      const info2 = await transporter.sendMail(mailOptions2);
      console.log('Email 2 sent: ' + info2.response);
  
      res.status(200).send('emails sent successfully');
    }


    
    else if( tkt_status_chg == 3 ){
        let tkt_status="Resolved";
  
        let mailOptions1 = {
            from: "g-smart.helpdesk@jubl.com",
            to: email_to,
            cc: [email_cc,business_head_email,],
            subject: `Ticket Id:${ticket_id}, ${tkt_status}, Raised by : ${ti_raised_by}`,
    
    
            html:`
           
            <!DOCTYPE html>
       <html lang="en">

       <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>CMS</title>
       </head>

       <body>

       <div style="font-size: 13px;>Dear Team,</div>
                       
                         <div style="font-size: 13px;">New Complaint has been raised by ( ${ti_raised_by} ).</div>
                         <div style="font-size: 13px;">Please find the complaint details below:</div>
                         <div style="font-size: 13px;">Status: ${tkt_status}</div>
 



                        
                    <div style="margin-top: 40px;">
           <div style="width: 100%;margin-top: 20px;">
               <div style="width: 80%; border: 1px solid lightgray;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
               border-radius: 10px 10px 10px 10px;">
            <div style="text-align: center;color: white;background: #0473cf;padding-top:8px !important;padding-bottom:8px !important;border-radius: 10px 10px 0px 0px;font-size: 15px;font-weight: 500;">Ticket Details</div>

                   <table style="width: 100%;
                       padding-bottom: 10px;
                       font-size: 13px;
                       color: black;
                       ">                
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint No</td>
                           <td style=" padding-top: 8px;">${ticket_id}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint Resolved on</td>
                           <td style=" padding-top: 8px;">
                               ${format}
                               <br>
                               ${time}
                           </td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Ticket Catogory</td>
                           <td style=" padding-top: 8px;">${ticket_catgy}</td>
                       </tr>
       
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Nature of Complaint	</td>
                           <td style=" padding-top: 8px;">${ticket_type}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Name</td>
                           <td style=" padding-top: 8px;">${customer_name}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Phone No.</td>
                           <td style=" padding-top: 8px;">${customer_phone}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Sales Person Phone No.</td>
                           <td style=" padding-top: 8px;">${sales_preson_ph_no}</td>
                       </tr>


                   </table>
               </div>
       </div>





       <div 
       style="width: 100%;
       margin-top: 15px;
       ">
           <div 
           style="
           width: 80%;
           border: 1px solid lightgray;
           box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
           border-radius: 10px 10px 10px 10px;    
           ">

           <div 
           style="                 
           text-align: center;
           color: white;
           background: #0473cf;
           padding: 8px 0px 8px 0px;
           border-radius: 10px 10px 0px 0px;
           font-size: 15px;
           font-weight: 500;
           ">
               Product Details
            </div>
               <table style="
                   width: 100%;
                   padding-bottom: 10px;
                   font-size: 13px;      
                   color: black;             
                   ">
           
                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Product Catogory</td>
                       <td style=" padding-top: 8px;">${product_catgy}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Batch No</td>
                       <td style=" padding-top: 8px;">
                           ${batch_no}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Sku/Product Name</td>
                       <td style=" padding-top: 8px;">
                            ${product_name}
                           <br>
                            ${sku}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Location</td>
                       <td style=" padding-top: 8px;">
                       ${customer_location}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Purchase</td>
                       <td style=" padding-top: 8px;">${quantity_purchage}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Rejected</td>
                       <td style=" padding-top: 8px;">${quantity_rejected}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Manufacturing Date</td>
                       <td style=" padding-top: 8px;">${manufacturing_date}</td>
                   </tr>


               </table>
           </div>
       </div>

       <div style="font-size: 15px; margin-top: 30px; font-weight: bold;">
           Thanks & Regards
       </div>

       <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
           JACPL Quality Team
       </div>
       <div style="font-style: italic; font-size: 10px;">
           *This is a system generated email, do not reply to this email id.
       </div>

       </body>

       </html>
     
     
     
            `
         
        };
      
        let mailOptions2 = {
          from: "g-smart.helpdesk@jubl.com",
          to: toAddresses,
          cc:ccAddresses,
          subject: `Ticket Id:${ticket_id}, Resolved, Raised by : ${ti_raised_by}`,
  
          html: `
       
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMS</title>

</head>
<body>

  <div style="font-size: 13px;">Dear ${req.session.emp_Name},</div>
  <div style="font-size: 13px;">
  Please find the details below.
  </div>


  <div style="color: white; background-color: #0dcaf0; border-radius: 10px ;padding: 8px;  margin-top: 10px;">
      <div style="color: #0dcaf0;">empty </div> 
      <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp;  Complaint No</div>
      <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ticket_id}</div>
      <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
      <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
      <div style="color: #0dcaf0;">empty </div> 

  </div>

  <div style="color: white; background-color: #198754; border-radius: 10px ;padding: 8px; margin-top: 10px;">
    <div style="color: #198754;">empty </div> 
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Status:</div>
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ tkt_status }</div>
    <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
    <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
    <div style="color: #198754;">empty </div> 
  </div>

  <div style="color: white; background-color: #ffc107; border-radius: 10px ;padding: 8px; margin-top: 10px;">
    <div style="color: #ffc107;">empty </div> 
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Resolved By:</div>
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${employeeDataString}</div>
    <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
    <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
    <div style="color: #ffc107;">empty </div> 
  </div>



<div style="font-size: 15px; margin-top: 60px; font-weight: bold;">
    Thanks & Regards
</div>

<div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
    JACPL Quality Team
</div>
<div style="font-style: italic; font-size: 10px;">
    *This is a system generated email, do not reply to this email id.
</div>



  
</body>
</html>
      `,
      };
      
    
        const info1 = await transporter.sendMail(mailOptions1);
        console.log('Email 1 sent: ' + info1.response);
    
        const info2 = await transporter.sendMail(mailOptions2);
        console.log('Email 2 sent: ' + info2.response);
    
        res.status(200).send('emails sent successfully');
      }

    else if( tkt_status_chg == 4 ){
        let tkt_status="Closed";
  
        let mailOptions1 = {
            from: "g-smart.helpdesk@jubl.com",
            to: email_to,
            cc: [email_cc,business_head_email,],
           
            subject: `Ticket Id:${ticket_id}, ${tkt_status}, Raised by : ${ti_raised_by}`,
    
    
            html:`
           
            <!DOCTYPE html>
       <html lang="en">

       <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>CMS</title>
       </head>

       <body>

       <div style="font-size: 13px;>Dear Team,</div>
                       
                         <div style="font-size: 13px;">New Complaint has been raised by ( ${ti_raised_by} ).</div>
                         <div style="font-size: 13px;">Please find the complaint details below:</div>
                         <div style="font-size: 13px;">Status: ${tkt_status}</div>
 


                        
                    <div style="margin-top: 40px;">
           <div style="width: 100%;margin-top: 20px;">
               <div style="width: 80%; border: 1px solid lightgray;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
               border-radius: 10px 10px 10px 10px;">
            <div style="text-align: center;color: white;background: #0473cf;padding-top:8px !important;padding-bottom:8px !important;border-radius: 10px 10px 0px 0px;font-size: 15px;font-weight: 500;">Ticket Details</div>

                   <table style="width: 100%;
                       padding-bottom: 10px;
                       font-size: 13px;
                       color: black;
                       ">                
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint No</td>
                           <td style=" padding-top: 8px;">${ticket_id}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint Closed on</td>
                           <td style=" padding-top: 8px;">
                               ${format}
                               <br>
                               ${time}
                           </td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Ticket Catogory</td>
                           <td style=" padding-top: 8px;">${ticket_catgy}</td>
                       </tr>
       
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Nature of Complaint	</td>
                           <td style=" padding-top: 8px;">${ticket_type}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Name</td>
                           <td style=" padding-top: 8px;">${customer_name}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Phone No.</td>
                           <td style=" padding-top: 8px;">${customer_phone}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Sales Person Phone No.</td>
                           <td style=" padding-top: 8px;">${sales_preson_ph_no}</td>
                       </tr>


                   </table>
               </div>
       </div>





       <div 
       style="width: 100%;
       margin-top: 15px;
       ">
           <div 
           style="
           width: 80%;
           border: 1px solid lightgray;
           box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
           border-radius: 10px 10px 10px 10px;    
           ">

           <div 
           style="                 
           text-align: center;
           color: white;
           background: #0473cf;
           padding: 8px 0px 8px 0px;
           border-radius: 10px 10px 0px 0px;
           font-size: 15px;
           font-weight: 500;
           ">
               Product Details
           </div>
               <table style="
                   width: 100%;
                   padding-bottom: 10px;
                   font-size: 13px;      
                   color: black;             
                   ">
           
                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Product Catogory</td>
                       <td style=" padding-top: 8px;">${product_catgy}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Batch No</td>
                       <td style=" padding-top: 8px;">
                           ${batch_no}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Sku/Product Name</td>
                       <td style=" padding-top: 8px;">
                            ${product_name}
                           <br>
                            ${sku}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Location</td>
                       <td style=" padding-top: 8px;">
                       ${customer_location}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Purchase</td>
                       <td style=" padding-top: 8px;">${quantity_purchage}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Rejected</td>
                       <td style=" padding-top: 8px;">${quantity_rejected}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Manufacturing Date</td>
                       <td style=" padding-top: 8px;">${manufacturing_date}</td>
                   </tr>


               </table>
           </div>
       </div>

       <div style="font-size: 15px; margin-top: 30px; font-weight: bold;">
           Thanks & Regards
       </div>

       <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
           JACPL Quality Team
       </div>
       <div style="font-style: italic; font-size: 10px;">
           *This is a system generated email, do not reply to this email id.
       </div>

       </body>

       </html>`
        };
      
    
        let mailOptions2 = {
            from: "g-smart.helpdesk@jubl.com",
            to: toAddresses,
            cc:ccAddresses,
          subject: `Ticket Id:${ticket_id},  Closed, Raised by : ${ti_raised_by}`,
  
          html: `
       
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMS</title>

</head>
<body>

  <div style="font-size: 13px;">Dear ${req.session.emp_Name},</div>
  <div style="font-size: 13px;">
  Please find the details below.
  </div>


  <div style="color: white; background-color: #0dcaf0; border-radius: 10px ;padding: 8px;  margin-top: 10px;">
      <div style="color: #0dcaf0;">empty </div> 
      <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp;  Complaint No</div>
      <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ticket_id}</div>
      <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
      <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${ticket_created_on}</div>
      <div style="color: #0dcaf0;">empty </div> 

  </div>

  <div style="color: white; background-color: #198754; border-radius: 10px ;padding: 8px; margin-top: 10px;">
    <div style="color: #198754;">empty </div> 
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Status:</div>
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ tkt_status }</div>
    <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
    <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
    <div style="color: #198754;">empty </div> 
  </div>

  <div style="color: white; background-color: #ffc107; border-radius: 10px ;padding: 8px; margin-top: 10px;">
    <div style="color: #ffc107;">empty </div> 
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Closed By:</div>
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${employeeDataString}</div>
    <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
    <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
    <div style="color: #ffc107;">empty </div> 
  </div>



<div style="font-size: 15px; margin-top: 60px; font-weight: bold;">
    Thanks & Regards
</div>

<div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
    JACPL Quality Team
</div>
<div style="font-style: italic; font-size: 10px;">
    *This is a system generated email, do not reply to this email id.
</div>



  
</body>
</html>
      `,
      };
      
    
        const info1 = await transporter.sendMail(mailOptions1);
        console.log('Email 1 sent: ' + info1.response);
    
        const info2 = await transporter.sendMail(mailOptions2);
        console.log('Email 2 sent: ' + info2.response);
    
        res.status(200).send('emails sent successfully');
      }

    else if( tkt_status_chg == 5 ){
        let tkt_status="Reopen";
  
        let mailOptions1 = {
            from: "g-smart.helpdesk@jubl.com",
            to: email_to,
            cc: [email_cc,business_head_email,],
            subject: `Ticket Id:${ticket_id}, ${tkt_status}, Raised by : ${ti_raised_by}`,
    
    
            html:`
           
            <!DOCTYPE html>
       <html lang="en">

       <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>CMS</title>
       </head>

       <body>

       <div style="font-size: 13px;>Dear Team,</div>
                       
       <div style="font-size: 13px;">New Complaint has been raised by ( ${ti_raised_by} ).</div>
       <div style="font-size: 13px;">Please find the complaint details below:</div>
       <div style="font-size: 13px;">Status: ${tkt_status}</div>




                        
                    <div style="margin-top: 40px;">
           <div style="width: 100%;margin-top: 20px;">
               <div style="width: 80%; border: 1px solid lightgray;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
               border-radius: 10px 10px 10px 10px;">
            <div style="text-align: center;color: white;background: #0473cf;padding-top:8px !important;padding-bottom:8px !important;border-radius: 10px 10px 0px 0px;font-size: 15px;font-weight: 500;">Ticket Details</div>

                   <table style="width: 100%;
                       padding-bottom: 10px;
                       font-size: 13px;
                       color: black;
                       ">                
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint No</td>
                           <td style=" padding-top: 8px;">${ticket_id}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint Reopen on</td>
                           <td style=" padding-top: 8px;">
                               ${format}
                               <br>
                               ${time}
                           </td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Ticket Catogory</td>
                           <td style=" padding-top: 8px;">${ticket_catgy}</td>
                       </tr>
       
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Nature of Complaint	</td>
                           <td style=" padding-top: 8px;">${ticket_type}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Name</td>
                           <td style=" padding-top: 8px;">${customer_name}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Phone No.</td>
                           <td style=" padding-top: 8px;">${customer_phone}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Sales Person Phone No.</td>
                           <td style=" padding-top: 8px;">${sales_preson_ph_no}</td>
                       </tr>


                   </table>
               </div>
       </div>





       <div 
       style="width: 100%;
       margin-top: 15px;
       ">
           <div 
           style="
           width: 80%;
           border: 1px solid lightgray;
           box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
           border-radius: 10px 10px 10px 10px;    
           ">

           <div 
           style="                 
           text-align: center;
           color: white;
           background: #0473cf;
           padding: 8px 0px 8px 0px;
           border-radius: 10px 10px 0px 0px;
           font-size: 15px;
           font-weight: 500;
           ">
               Product Details
           </div>
               <table style="
                   width: 100%;
                   padding-bottom: 10px;
                   font-size: 13px;      
                   color: black;             
                   ">
           
                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Product Catogory</td>
                       <td style=" padding-top: 8px;">${product_catgy}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Batch No</td>
                       <td style=" padding-top: 8px;">
                           ${batch_no}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Sku/Product Name</td>
                       <td style=" padding-top: 8px;">
                            ${product_name}
                           <br>
                            ${sku}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Location</td>
                       <td style=" padding-top: 8px;">
                       ${customer_location}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Purchase</td>
                       <td style=" padding-top: 8px;">${quantity_purchage}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Rejected</td>
                       <td style=" padding-top: 8px;">${quantity_rejected}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Manufacturing Date</td>
                       <td style=" padding-top: 8px;">${manufacturing_date}</td>
                   </tr>


               </table>
           </div>
       </div>

       <div style="font-size: 15px; margin-top: 30px; font-weight: bold;">
           Thanks & Regards
       </div>

       <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
           JACPL Quality Team
       </div>
       <div style="font-style: italic; font-size: 10px;">
           *This is a system generated email, do not reply to this email id.
       </div>

       </body>

       </html>`
        };
      
        

        let mailOptions2 = {
         
          from: "g-smart.helpdesk@jubl.com",
            to: toAddresses,
            cc:ccAddresses,
          subject: `Ticket Id:${ticket_id}, Created, Raised by : ${ti_raised_by}`,
  
          html: `
   
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMS</title>

</head>
<body>

  <div style="font-size: 13px;">Dear ${req.session.emp_Name},</div>
  <div style="font-size: 13px;">
  Please find the details below.
  </div>


  <div style="color: white; background-color: #0dcaf0; border-radius: 10px ;padding: 10px;  margin-top: 10px;">
      <div style="color: #0dcaf0;">empty </div> 
      <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp;  Complaint No</div>
      <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ticket_id}</div>
      <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
      <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${ticket_created_on}</div>
      <div style="color: #0dcaf0;">empty </div> 

  </div>

  <div style="color: white; background-color: #198754; border-radius: 10px ;padding: 10px; margin-top: 10px;">
    <div style="color: #198754;">empty </div> 
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Status:</div>
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ tkt_status }</div>
    <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
    <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
    <div style="color: #198754;">empty </div> 
  </div>

  <div style="color: white; background-color: #ffc107; border-radius: 10px ;padding: 10px; margin-top: 10px;">
    <div style="color: #ffc107;">empty </div> 
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Reopen By:</div>
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${employeeDataString}</div>
    <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
    <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
    <div style="color: #ffc107;">empty </div> 
  </div>



<div style="font-size: 15px; margin-top: 60px; font-weight: bold;">
    Thanks & Regards
</div>

<div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
    JACPL Quality Team
</div>
<div style="font-style: italic; font-size: 10px;">
    *This is a system generated email, do not reply to this email id.
</div>



  
</body>
</html>
      `,
      };
      
    
        const info1 = await transporter.sendMail(mailOptions1);
        console.log('Email 1 sent: ' + info1.response);
    
        const info2 = await transporter.sendMail(mailOptions2);
        console.log('Email 2 sent: ' + info2.response);
    
        res.status(200).send('emails sent successfully');
      }

    });
});
    })
})
})
})

    } catch (error) {
      console.error(error);
      res.status(500).send('Error sending emails');
    }
  });




  router.post('/send_status_email2', async (req, res) => {

    try {
      
        let pool = await dbConnection();
        let format = formatCurrentDate2();
        let time = getCurrentTime()

      let { 
        reopen_ticket_id, tkt_status_chg, pre_ticket_id, reopen_tkt_crt_date, pre_tkt_crt_date, ticket_catgy, customer_name, customer_phone, product_catgy, batch_no, sku, customer_location, quantity_purchage, quantity_rejected, manufacturing_date, ticket_type, product_name,sales_person_ph_no
       }=req.body
    
      
      let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;


    let product = `SELECT business_head_email FROM product_equation WHERE c_category=?`
  
    pool.query(product,[ticket_catgy],async(error,product_result) => {

        let product_res = product_result[0].business_head_email
        let mailquery = `SELECT * FROM cms_user_login WHERE EMP_CODE=?`
        pool.query(mailquery, [emp], async (error, results) => {
        if (error) throw error;
       
        let cc1 = results[0].Emp_Email_ID
        let cc2 = results[0].REP_MANAGER_Email_ID
        let receiver1 = results[0].RSM_ZSM_Email_ID
        console.log(cc1,'cc1')
        console.log(cc2,'cc2')
        console.log(receiver1,'receiver1')
       
        let toAddresses = `${cc1}`;
        let ccAddresses = `${receiver1},${cc2}`;
        let business_head_email=`${product_res}`;
            console.log(toAddresses,'toAddresses')
            console.log(ccAddresses,'ccAddresses')

      
            let transporter = nodemailer.createTransport({
                host: 'jublcorp.mail.protection.outlook.com',
                port: 25,
                secure: false,
                auth: {
                    user: 'g-smart.helpdesk@jubl.com',
                    pass: 'jubl@123'
                },
                debug: true
            });
  
      if( tkt_status_chg == 2 ){
      let tkt_status="In-Process";

    

      let mailOptions1 = {
        from: "g-smart.helpdesk@jubl.com",
        to: business_head_email,
        subject: `Ticket Id:${reopen_ticket_id}, ${tkt_status}, Raised by : ${employeeDataString}`,


        html:`
        <!DOCTYPE html>
 <html lang="en">
 
 <head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>CMS</title>
 </head>
 
 <body>

 
 <div style="font-size: 13px;>Dear Team,</div>
                       
 <div style="font-size: 13px;">New Complaint has been raised by ( ${employeeDataString} ).</div>
 <div style="font-size: 13px;">Please find the complaint details below:</div>
 <div style="font-size: 13px;">Status: ${tkt_status}</div>

 
 
     <div style="width: 100%;margin-top: 20px;">
         <div style="width: 80%; border: 1px solid lightgray;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
         border-radius: 10px 10px 10px 10px;">
      <div style="text-align: center;color: white;background: #0473cf;padding-top:8px !important;padding-bottom:8px !important;border-radius: 10px 10px 0px 0px;font-size: 15px;font-weight: 500;">Ticket Details</div>
 
             <table style="width: 100%;
                 padding-bottom: 10px;
                 font-size: 13px;
                 color: black;
                 ">                
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Reopen Complaint No</td>
                     <td style=" padding-top: 8px;">${reopen_ticket_id}</td>
                 </tr>
 
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Reopen Complaint In-Process on</td>
                     <td style=" padding-top: 8px;">
                         ${reopen_tkt_crt_date}
                     </td>
                 </tr>
 
 
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Previous Complaint No</td>
                     <td style=" padding-top: 8px;">${pre_ticket_id}</td>
                 </tr>
 
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Previous Complaint Received on</td>
                     <td style=" padding-top: 8px;">
                         ${pre_tkt_crt_date}
                     </td>
                 </tr>
 
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Ticket Catogory</td>
                     <td style=" padding-top: 8px;">${ticket_catgy}</td>
                 </tr>
 
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Nature of Complaint	</td>
                     <td style=" padding-top: 8px;">${ticket_type}</td>
                 </tr>
 
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Customer Name</td>
                     <td style=" padding-top: 8px;">${customer_name}</td>
                 </tr>
 
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Customer Phone No.</td>
                     <td style=" padding-top: 8px;">${customer_phone}</td>
                 </tr>
 
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Sales Person Phone No.</td>
                     <td style=" padding-top: 8px;">${sales_person_ph_no}</td>
                 </tr>
 
 
             </table>
         </div>
 </div>
 
 
 
 
 
 <div 
 style="width: 100%;
 margin-top: 15px;
 ">
     <div 
     style="
     width: 80%;
     border: 1px solid lightgray;
     box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
     border-radius: 10px 10px 10px 10px;    
     ">
 
     <div 
     style="                 
     text-align: center;
     color: white;
     background: #0473cf;
     padding: 8px 0px 8px 0px;
     border-radius: 10px 10px 0px 0px;
     font-size: 15px;
     font-weight: 500;
     ">
         Product Details
     </div>
         <table style="
             width: 100%;
             padding-bottom: 10px;
             font-size: 13px;      
             color: black;             
             ">
     
             <tr>
                 <td style=" padding: 8px 0px 0px 10px;">Product Catogory</td>
                 <td style=" padding-top: 8px;">${product_catgy}</td>
             </tr>
 
             <tr>
                 <td style=" padding: 8px 0px 0px 10px;">Batch No</td>
                 <td style=" padding-top: 8px;">
                     ${batch_no}
                 </td>
             </tr>
 
             <tr>
                 <td style=" padding: 8px 0px 0px 10px;">Sku/Product Name</td>
                 <td style=" padding-top: 8px;">
                      ${product_name}
                     <br>
                      ${sku}
                 </td>
             </tr>
 
             <tr>
                 <td style=" padding: 8px 0px 0px 10px;">Location</td>
                 <td style=" padding-top: 8px;">
                 ${customer_location}
                 </td>
             </tr>
 
             <tr>
                 <td style=" padding: 8px 0px 0px 10px;">Quantity Purchase</td>
                 <td style=" padding-top: 8px;">${quantity_purchage}</td>
             </tr>
 
             <tr>
                 <td style=" padding: 8px 0px 0px 10px;">Quantity Rejected</td>
                 <td style=" padding-top: 8px;">${quantity_rejected}</td>
             </tr>
 
             <tr>
                 <td style=" padding: 8px 0px 0px 10px;">Manufacturing Date</td>
                 <td style=" padding-top: 8px;">${manufacturing_date}</td>
             </tr>
 
 
         </table>
     </div>
 </div>
 
 <div style="font-size: 15px; margin-top: 30px; font-weight: bold;">
     Thanks & Regards
 </div>
 
 <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
     JACPL Quality Team
 </div>
 <div style="font-style: italic; font-size: 10px;">
     *This is a system generated email, do not reply to this email id.
 </div>
 
 
 
 </body>
 
 </html>
 
        `
    };
  
      let mailOptions2 = {
        from: "g-smart.helpdesk@jubl.com",
        to: toAddresses,
        cc: ccAddresses,
        subject: `Ticket Id:${reopen_ticket_id}, ${tkt_status}, Raised by : ${employeeDataString}`,

        html: ` 
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CMS</title>
        
        </head>
        <body>
        
          <div style="font-size: 13px;">Dear ${req.session.emp_Name},</div>
          <div style="font-size: 13px;">
          Please find the details below.
          </div>
        
        
          <div style="color: white; background-color: #0dcaf0; border-radius: 10px ;padding: 8px;  margin-top: 10px;">
              <div style="color: #0dcaf0;">empty </div> 
              <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp;Reopen Complaint No</div>
              <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${reopen_ticket_id}</div>
              <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Previous Complaint No</div>
              <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${pre_ticket_id}</div>
              <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
              <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${reopen_tkt_crt_date}</div>
              <div style="color: #0dcaf0;">empty </div> 
        
          </div>
        
          <div style="color: white; background-color: #198754; border-radius: 10px ;padding: 8px; margin-top: 10px;">
            <div style="color: #198754;">empty </div> 
            <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Status:</div>
            <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ tkt_status }</div>
            <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
            <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
            <div style="color: #198754;">empty </div> 
          </div>
        
          <div style="color: white; background-color: #ffc107; border-radius: 10px ;padding: 8px; margin-top: 10px;">
            <div style="color: #ffc107;">empty </div> 
            <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Inprocess By:</div>
            <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${employeeDataString}</div>
            <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
            <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
            <div style="color: #ffc107;">empty </div> 
          </div>
        
        
        
        <div style="font-size: 15px; margin-top: 60px; font-weight: bold;">
            Thanks & Regards
        </div>
        
        <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
            JACPL Quality Team
        </div>
        <div style="font-style: italic; font-size: 10px;">
            *This is a system generated email, do not reply to this email id.
        </div>
        
        
        
          
        </body>
        </html>
    `
    };
    
  
      const info1 = await transporter.sendMail(mailOptions1);
      console.log('Email 1 sent: ' + info1.response);
  
      const info2 = await transporter.sendMail(mailOptions2);
      console.log('Email 2 sent: ' + info2.response);
  
      res.status(200).send('emails sent successfully');
    }


    
    else if( tkt_status_chg == 3 ){
        let tkt_status="Resolved";
  
        let mailOptions1 = {
            from: 'g-smart.helpdesk@jubl.com',
            to:business_head_email,
            subject: `Ticket Id:${reopen_ticket_id}, ${tkt_status}, Raised by : ${employeeDataString}`,
    
    
            html:`
            <!DOCTYPE html>
     <html lang="en">
     
     <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>CMS</title>
     </head>
     
     <body>
     
     <div style="font-size: 13px;>Dear Team,</div>
                       
     <div style="font-size: 13px;">New Complaint has been raised by ( ${employeeDataString} ).</div>
     <div style="font-size: 13px;">Please find the complaint details below:</div>
     <div style="font-size: 13px;">Status: ${tkt_status}</div>

     
     
         <div style="width: 100%;margin-top: 20px;">
             <div style="width: 80%; border: 1px solid lightgray;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
             border-radius: 10px 10px 10px 10px;">
          <div style="text-align: center;color: white;background: #0473cf;padding-top:8px !important;padding-bottom:8px !important;border-radius: 10px 10px 0px 0px;font-size: 15px;font-weight: 500;">Ticket Details</div>
     
                 <table style="width: 100%;
                     padding-bottom: 10px;
                     font-size: 13px;
                     color: black;
                     ">                
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Reopen Complaint No</td>
                         <td style=" padding-top: 8px;">${reopen_ticket_id}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Reopen Complaint Resolved on</td>
                         <td style=" padding-top: 8px;">
                             ${reopen_tkt_crt_date}
                         </td>
                     </tr>
     
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Previous Complaint No</td>
                         <td style=" padding-top: 8px;">${pre_ticket_id}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Previous Complaint Received on</td>
                         <td style=" padding-top: 8px;">
                             ${pre_tkt_crt_date}
                         </td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Ticket Catogory</td>
                         <td style=" padding-top: 8px;">${ticket_catgy}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Nature of Complaint	</td>
                         <td style=" padding-top: 8px;">${ticket_type}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Customer Name</td>
                         <td style=" padding-top: 8px;">${customer_name}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Customer Phone No.</td>
                         <td style=" padding-top: 8px;">${customer_phone}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Sales Person Phone No.</td>
                         <td style=" padding-top: 8px;">${sales_person_ph_no}</td>
                     </tr>
     
     
                 </table>
             </div>
     </div>
     
     
     
     
     
     <div 
     style="width: 100%;
     margin-top: 15px;
     ">
         <div 
         style="
         width: 80%;
         border: 1px solid lightgray;
         box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
         border-radius: 10px 10px 10px 10px;    
         ">
     
         <div 
         style="                 
         text-align: center;
         color: white;
         background: #0473cf;
         padding: 8px 0px 8px 0px;
         border-radius: 10px 10px 0px 0px;
         font-size: 15px;
         font-weight: 500;
         ">
             Product Details
         </div>
             <table style="
                 width: 100%;
                 padding-bottom: 10px;
                 font-size: 13px;      
                 color: black;             
                 ">
         
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Product Catogory</td>
                     <td style=" padding-top: 8px;">${product_catgy}</td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Batch No</td>
                     <td style=" padding-top: 8px;">
                         ${batch_no}
                     </td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Sku/Product Name</td>
                     <td style=" padding-top: 8px;">
                          ${product_name}
                         <br>
                          ${sku}
                     </td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Location</td>
                     <td style=" padding-top: 8px;">
                     ${customer_location}
                     </td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Quantity Purchase</td>
                     <td style=" padding-top: 8px;">${quantity_purchage}</td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Quantity Rejected</td>
                     <td style=" padding-top: 8px;">${quantity_rejected}</td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Manufacturing Date</td>
                     <td style=" padding-top: 8px;">${manufacturing_date}</td>
                 </tr>
     
     
             </table>
         </div>
     </div>
     
     <div style="font-size: 15px; margin-top: 30px; font-weight: bold;">
         Thanks & Regards
     </div>
     
     <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
         JACPL Quality Team
     </div>
     <div style="font-style: italic; font-size: 10px;">
         *This is a system generated email, do not reply to this email id.
     </div>
     
     
     
     </body>
     
     </html>
     
            `
        };
      
          let mailOptions2 = {
            from: 'g-smart.helpdesk@jubl.com',
            to: toAddresses,
            cc: ccAddresses,
            subject: `Ticket Id:${reopen_ticket_id}, ${tkt_status}, Raised by : ${employeeDataString}`,
    
            html: `
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>CMS</title>
            
            </head>
            <body>
            
              <div style="font-size: 13px;">Dear ${req.session.emp_Name},</div>
              <div style="font-size: 13px;">
              Please find the details below.
              </div>
            
            
              <div style="color: white; background-color: #0dcaf0; border-radius: 10px ;padding: 8px;  margin-top: 10px;">
                  <div style="color: #0dcaf0;">empty </div> 
                  <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp;Reopen Complaint No</div>
                  <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${reopen_ticket_id}</div>
                  <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Previous Complaint No</div>
                  <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${pre_ticket_id}</div>
                  <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
                  <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${reopen_tkt_crt_date}</div>
                  <div style="color: #0dcaf0;">empty </div> 
            
              </div>
            
              <div style="color: white; background-color: #198754; border-radius: 10px ;padding: 8px; margin-top: 10px;">
                <div style="color: #198754;">empty </div> 
                <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Status:</div>
                <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ tkt_status }</div>
                <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
                <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
                <div style="color: #198754;">empty </div> 
              </div>
            
              <div style="color: white; background-color: #ffc107; border-radius: 10px ;padding: 8px; margin-top: 10px;">
                <div style="color: #ffc107;">empty </div> 
                <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Resolved By:</div>
                <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${employeeDataString}</div>
                <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
                <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
                <div style="color: #ffc107;">empty </div> 
              </div>
            
            
            
            <div style="font-size: 15px; margin-top: 60px; font-weight: bold;">
                Thanks & Regards
            </div>
            
            <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
                JACPL Quality Team
            </div>
            <div style="font-style: italic; font-size: 10px;">
                *This is a system generated email, do not reply to this email id.
            </div>
            
            
            
              
            </body>
            </html>
        `
        };
      
    
        const info1 = await transporter.sendMail(mailOptions1);
        console.log('Email 1 sent: ' + info1.response);
    
        const info2 = await transporter.sendMail(mailOptions2);
        console.log('Email 2 sent: ' + info2.response);
    
        res.status(200).send('emails sent successfully');
      }

    else if( tkt_status_chg == 4 ){
        let tkt_status="Closed";
  
        let mailOptions1 = {
            from: "g-smart.helpdesk@jubl.com",
            to: business_head_email,
            
            subject: `Ticket Id:${reopen_ticket_id}, ${tkt_status}, Raised by : ${employeeDataString}`,
    
    
            html:`
            <!DOCTYPE html>
     <html lang="en">
     
     <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>CMS</title>
     </head>
     
     <body>
     
     <div style="font-size: 13px;>Dear Team,</div>
                       
     <div style="font-size: 13px;">New Complaint has been raised by ( ${employeeDataString} ).</div>
     <div style="font-size: 13px;">Please find the complaint details below:</div>
     <div style="font-size: 13px;">Status: ${tkt_status}</div>

     
     
         <div style="width: 100%;margin-top: 20px;">
             <div style="width: 80%; border: 1px solid lightgray;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
             border-radius: 10px 10px 10px 10px;">
          <div style="text-align: center;color: white;background: #0473cf;padding-top:8px !important;padding-bottom:8px !important;border-radius: 10px 10px 0px 0px;font-size: 15px;font-weight: 500;">Ticket Details</div>
     
                 <table style="width: 100%;
                     padding-bottom: 10px;
                     font-size: 13px;
                     color: black;
                     ">                
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Reopen Complaint No</td>
                         <td style=" padding-top: 8px;">${reopen_ticket_id}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Reopen Complaint Closed on</td>
                         <td style=" padding-top: 8px;">
                             ${reopen_tkt_crt_date}
                         </td>
                     </tr>
     
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Previous Complaint No</td>
                         <td style=" padding-top: 8px;">${pre_ticket_id}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Previous Complaint Received on</td>
                         <td style=" padding-top: 8px;">
                             ${pre_tkt_crt_date}
                         </td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Ticket Catogory</td>
                         <td style=" padding-top: 8px;">${ticket_catgy}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Nature of Complaint	</td>
                         <td style=" padding-top: 8px;">${ticket_type}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Customer Name</td>
                         <td style=" padding-top: 8px;">${customer_name}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Customer Phone No.</td>
                         <td style=" padding-top: 8px;">${customer_phone}</td>
                     </tr>
     
                     <tr>
                         <td style=" padding: 8px 0px 0px 10px;">Sales Person Phone No.</td>
                         <td style=" padding-top: 8px;">${sales_person_ph_no}</td>
                     </tr>
     
     
                 </table>
             </div>
     </div>
     
     
     
     
     
     <div 
     style="width: 100%;
     margin-top: 15px;
     ">
         <div 
         style="
         width: 80%;
         border: 1px solid lightgray;
         box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
         border-radius: 10px 10px 10px 10px;    
         ">
     
         <div 
         style="                 
         text-align: center;
         color: white;
         background: #0473cf;
         padding: 8px 0px 8px 0px;
         border-radius: 10px 10px 0px 0px;
         font-size: 15px;
         font-weight: 500;
         ">
             Product Details
         </div>
             <table style="
                 width: 100%;
                 padding-bottom: 10px;
                 font-size: 13px;      
                 color: black;             
                 ">
         
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Product Catogory</td>
                     <td style=" padding-top: 8px;">${product_catgy}</td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Batch No</td>
                     <td style=" padding-top: 8px;">
                         ${batch_no}
                     </td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Sku/Product Name</td>
                     <td style=" padding-top: 8px;">
                          ${product_name}
                         <br>
                          ${sku}
                     </td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Location</td>
                     <td style=" padding-top: 8px;">
                     ${customer_location}
                     </td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Quantity Purchase</td>
                     <td style=" padding-top: 8px;">${quantity_purchage}</td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Quantity Rejected</td>
                     <td style=" padding-top: 8px;">${quantity_rejected}</td>
                 </tr>
     
                 <tr>
                     <td style=" padding: 8px 0px 0px 10px;">Manufacturing Date</td>
                     <td style=" padding-top: 8px;">${manufacturing_date}</td>
                 </tr>
     
     
             </table>
         </div>
     </div>
     
     <div style="font-size: 15px; margin-top: 30px; font-weight: bold;">
         Thanks & Regards
     </div>
     
     <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
         JACPL Quality Team
     </div>
     <div style="font-style: italic; font-size: 10px;">
         *This is a system generated email, do not reply to this email id.
     </div>
     
     
     
     </body>
     
     </html>
     
            `
        };
      
          let mailOptions2 = {
            from: "g-smart.helpdesk@jubl.com",
            to:toAddresses,
            cc:ccAddresses,
            subject: `Ticket Id:${reopen_ticket_id}, ${tkt_status}, Raised by : ${employeeDataString}`,
    
            html: `
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>CMS</title>
            
            </head>
            <body>
            
              <div style="font-size: 13px;">Dear ${req.session.emp_Name},</div>
              <div style="font-size: 13px;">
              Please find the details below.
              </div>
            
            
              <div style="color: white; background-color: #0dcaf0; border-radius: 10px ;padding: 8px;  margin-top: 10px;">
                  <div style="color: #0dcaf0;">empty </div> 
                  <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp;Reopen Complaint No</div>
                  <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${reopen_ticket_id}</div>
                  <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Previous Complaint No</div>
                  <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${pre_ticket_id}</div>
                  <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
                  <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${reopen_tkt_crt_date}</div>
                  <div style="color: #0dcaf0;">empty </div> 
            
              </div>
            
              <div style="color: white; background-color: #198754; border-radius: 10px ;padding: 8px; margin-top: 10px;">
                <div style="color: #198754;">empty </div> 
                <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Status:</div>
                <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ tkt_status }</div>
                <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
                <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
                <div style="color: #198754;">empty </div> 
              </div>
            
              <div style="color: white; background-color: #ffc107; border-radius: 10px ;padding: 8px; margin-top: 10px;">
                <div style="color: #ffc107;">empty </div> 
                <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Closed By:</div>
                <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${employeeDataString}</div>
                <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
                <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
                <div style="color: #ffc107;">empty </div> 
              </div>
            
            
            
            <div style="font-size: 15px; margin-top: 60px; font-weight: bold;">
                Thanks & Regards
            </div>
            
            <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
                JACPL Quality Team
            </div>
            <div style="font-style: italic; font-size: 10px;">
                *This is a system generated email, do not reply to this email id.
            </div>
            
            
            
              
            </body>
            </html>
        `
        };
      
    
        const info1 = await transporter.sendMail(mailOptions1);
        console.log('Email 1 sent: ' + info1.response);
    
        const info2 = await transporter.sendMail(mailOptions2);
        console.log('Email 2 sent: ' + info2.response);
    
        res.status(200).send('emails sent successfully');
      }

    })
})
    } catch (error) {
      console.error(error);
      res.status(500).send('Error sending emails');
    }
  });
  

  


  router.get('/reopen_complaint_view/:reopen_ticket_id/:pre_ticket_id', authenticate, async (req, res) => {
    try {
        let reopen_ticket_id = req.params.reopen_ticket_id;
        let pre_ticket_id = req.params.pre_ticket_id;
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
        
        let pool = await dbConnection();
        
        let query = 
        `SELECT
        reopen_issues_master.reopen_ticket_id, 
        reopen_issues_master.raised_by AS reopen_tkt_raised_by,
        reopen_issues_master.pre_ticket_id,  
        DATE_FORMAT(reopen_issues_master.ticket_date, '%d-%m-%Y, %h:%i:%s %p') AS reopen_ticket_Created_on, 
        DATE_FORMAT(product_issues_master.ticket_date, '%d-%m-%Y, %h:%i:%s %p') AS pre_ticket_Created_on, 
        product_issues_master.raised_by AS pre_tkt_raised_by, 
        product_issues_master.inprocess_by AS pre_tkt_inprocess_by, 
        DATE_FORMAT(product_issues_master.inprocess_at, '%d-%m-%Y, %h:%i:%s %p') AS pre_tkt_inprocess_at,
        product_issues_master.resolved_by AS pre_tkt_resolved_by, 
        DATE_FORMAT(product_issues_master.resolved_at, '%d-%m-%Y, %h:%i:%s %p') AS pre_tkt_resolved_at,
        product_issues_master.closed_by AS pre_tkt_closed_by, 
        DATE_FORMAT(product_issues_master.closed_at, '%d-%m-%Y, %h:%i:%s %p') AS pre_tkt_closed_at,
        
        reopen_issues_master.inprocess_by AS tkt_inprocess_by, 
        DATE_FORMAT(reopen_issues_master.inprocess_at, '%d-%m-%Y, %h:%i:%s %p') AS tkt_inprocess_at,
        reopen_issues_master.resolved_by AS tkt_resolved_by, 
        DATE_FORMAT(reopen_issues_master.resolved_at, '%d-%m-%Y, %h:%i:%s %p') AS tkt_resolved_at,
        reopen_issues_master.closed_by AS tkt_closed_by, 
        DATE_FORMAT(reopen_issues_master.closed_at, '%d-%m-%Y, %h:%i:%s %p') AS tkt_closed_at,


        product_issues_master.product_category, 
        product_issues_master.ticket_category, 
        product_issues_master.ticket_location,
        product_issues_master.ticket_type, 
        product_issues_master.product_name, 
        product_issues_master.sku, 
        product_issues_master.front_image, 
        product_issues_master.back_image, 
        product_issues_master.video_link, 
        product_issues_master.batch_no, 
        product_issues_master.manufacturing_date, 
        product_issues_master.description, 
        product_issues_master.visit_type, 
        product_issues_master.customer_name, 
        product_issues_master.customer_address, 
        product_issues_master.customer_location, 
        product_issues_master.customer_phone, 
        product_issues_master.quantity_purchage, 
        product_issues_master.quantity_rejected, 
        reopen_issues_master.is_active, 
        product_issues_master.batch_no, 
        product_issues_master.customer_type,
        product_issues_master.person_meet,
        DATE_FORMAT(product_issues_master.investigated_at, '%d-%m-%Y') AS formate_investigated_at,
        product_issues_master.investigation_details,
        product_issues_master.action_taken,
        product_issues_master.inv_image_1,
        product_issues_master.inv_image_2,
        product_issues_master.inv_video,
        cms_user_login.emp_number

         FROM reopen_issues_master, product_issues_master, cms_user_login
         WHERE reopen_issues_master.reopen_ticket_id = ${reopen_ticket_id}
         AND product_issues_master.ticket_id = ${pre_ticket_id}
         AND cms_user_login.emp_code=${req.session.employeeId}`;
        
        pool.query(query, (err, results) => {
            if (err) throw err;


            let ticket_location = results[0].ticket_location
            let ticket_category = results[0].ticket_category
            let product_category = results[0].product_category
           
            
            let comp_location_query = `SELECT * FROM complaint_location WHERE c_location=?`
            pool.query(comp_location_query,[ticket_location], async (error, comp_location_result) => {

            let comp_loca = comp_location_result[0].id;

            console.log(comp_loca,'comp_loca')
            if (error) {
            console.error("Error retrieving data from complaint_location table:", error);
            return;
            }
   

            let c_locationData = `SELECT email_to,email_cc FROM cms_email_type WHERE c_category = ? AND FIND_IN_SET(?, complaint_location) > 0`;

            pool.query(c_locationData, [ticket_category,comp_loca], async (err, c_locationData_result) => {
                let email_to = c_locationData_result[0].email_to;
                
                const email_cc_array = c_locationData_result[0].email_cc.split(',');

            
            if (err) {
                console.error("Error retrieving data from cms_email_type table:", err);
                return;
            }

                let loginquery = `SELECT EMP_NAME FROM cms_user_login WHERE Emp_Email_ID=?`;
                pool.query(loginquery,[email_to], async (loginquery_error,loginquery_result) => {


                    if (loginquery_error) {
                        console.error("Error retrieving data from cms_user_login table:", loginquery_error);
                        return;
                    }

             
                let loginquery_cc = `SELECT EMP_NAME FROM cms_user_login WHERE Emp_Email_ID IN (?)`;
                pool.query(loginquery_cc,[email_cc_array], async (loginquery_cc_error,loginquery_cc_result) => {

                    

                    if (loginquery_cc_error) {
                        console.error("Error retrieving data from cms_user_login table:", loginquery_cc_error);
                        return;
                    }
                    let employeeNames = [];
                    for (let i = 0; i < loginquery_cc_result.length; i++) {
                        const empName = loginquery_cc_result[i].EMP_NAME;
                        employeeNames.push(empName);
                       
                    }

                let loginquery_to = `SELECT EMP_NAME,REP_MANAGER_NAME,RSM_ZSM_Name FROM cms_user_login WHERE EMP_CODE=?`;
                pool.query(loginquery_to,[req.session.employeeId], async (loginquery_to_error,loginquery_to_result) => {
  
                    if (loginquery_to_error) {
                        console.error("Error retrieving data from cms_user_login table:", loginquery_to_error);
                        return;
                    }
            

                    let product = `SELECT business_head_email FROM product_equation WHERE c_category=? AND p_category=?` 
                    pool.query(product,[ticket_category,product_category], async (loginquery_error,loginquery_bus) => {
   
                       if (loginquery_error) {
                           console.error("Error retrieving data from cms_user_login table:", loginquery_error);
                           return;
                       }

                       let loginquery111 = loginquery_bus[0].business_head_email

                       let loginqu = `SELECT EMP_NAME FROM cms_user_login WHERE Emp_Email_ID=?`;
                       pool.query(loginqu,[loginquery111], async (loginqu_error,loginqu_result) => {
       
                        console.log()
                           if (loginqu_error) {
                               console.error("Error retrieving data from cms_user_login table:", loginqu_error);
                               return;
                           }


                       
            
            res.render('reopen_complaint_view', { 
                data1: results, 
                reopen_ticket_id: reopen_ticket_id, 
                employeeDataString: employeeDataString,
                data_1:loginquery_result,
                data_2:employeeNames,
                data_3:loginquery_to_result,
                data_4:loginqu_result

            });
                       });
                    });
                });
                })
                })

            })
            })

        })
    } catch (err) {
        console.log(err);
    }
});


router.post('/reopen_ticket_status_inprocess',authenticate,async (req,res)=>{
    try{
        let pool=await dbConnection();
        let reopen_ticket_id=req.body.reopen_ticket_id;
      
        let tkt_status_chg=req.body.tkt_status_chg;
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
        let closed_date=getCurrentDateAndTime()

        let query1=`UPDATE reopen_issues_master SET is_active=?, inprocess_by=?, inprocess_at=? WHERE reopen_ticket_id=?`
        let queryData1=[tkt_status_chg, employeeDataString, closed_date, reopen_ticket_id]
        pool.query(query1,queryData1,(err,results)=>{
            if(err) throw err;
            // console.log(results)
            res.status(200).json({ message: 'Updated successfully' });
        })
    }
    catch(err){
        console.log(err,'err')
    }
})

router.post('/reopen_ticket_status_resolved', authenticate, upload.fields([
    { name: 'invest_img1', maxCount: 1 },
    { name: 'invest_img2', maxCount: 1 },
    { name: 'invest_video', maxCount: 1 }
]), async (req, res) => {
    try {
        // Access form data
        let formData = req.body;
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
        let closed_date = getCurrentDateAndTime();
        const attachments = req.files;

        // Parse and format the date using moment.js
        let invest_date = moment(formData.invest_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
        console.log(invest_date,'invest_date')
        let query1 = `
        UPDATE reopen_issues_master SET 
        is_active=?, 
        resolved_by=?, 
        resolved_at=?,  
        person_meet=?, 
        investigated_at=?, 
        investigation_details=?, 
        action_taken=?, 
        inv_image_1=?, 
        inv_image_2=?, 
        inv_video=? 
        WHERE reopen_ticket_id=?`;
        let queryData1 = [
            formData.tkt_status_chg,
            employeeDataString,
            closed_date,
            formData.person_meet,
            invest_date,
            formData.invst_detl,
            formData.action_taken,
            attachments.invest_img1 && attachments.invest_img1[0].filename,
            attachments.invest_img2 && attachments.invest_img2[0].filename,
            attachments.invest_video && attachments.invest_video[0].filename,    
            formData.reopen_ticket_id
        ];

        // Execute database query
        let pool = await dbConnection();
        pool.query(query1, queryData1, (err, result1) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log(result1, 'result121212121');
            res.status(200).json({ message: 'Updated successfully' });
        });
    } catch (err) {
        console.log(err, 'err');
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/reopen_ticket_status_closed',authenticate,async (req,res)=>{
    try{
        let pool=await dbConnection();
        let reopen_ticket_id=req.body.reopen_ticket_id;
        let close_comment=req.body.close_comment;

        console.log(reopen_ticket_id,'reopen_ticket_id')
        let tkt_status_chg=req.body.tkt_status_chg;
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
        let closed_date=getCurrentDateAndTime()
        
        let query1=`UPDATE reopen_issues_master SET is_active=?, closed_by=?, closed_at=?, closed_comment=? WHERE reopen_ticket_id=?`
        let queryData1=[tkt_status_chg,employeeDataString,closed_date, close_comment,reopen_ticket_id];
        
        pool.query(query1,queryData1,(err,results)=>{
            if(err) throw err;
            console.log(results)
            res.status(200).json({ message: 'Updated successfully' });
        })
    }
    catch(err){
        console.log(err,'err')
    }
})


router.post('/ticket_status_open',authenticate,async (req,res)=>{
    try{
        let pool=await dbConnection();
        let ticket_id=req.body.ticket_id;
        console.log(ticket_id,'ticket_id')
        let tkt_status_chg=req.body.tkt_status_chg;
        let query1=`UPDATE product_issues_master SET is_active=? WHERE ticket_id=?`
        let queryData1=[tkt_status_chg,ticket_id]
        pool.query(query1,queryData1,(err,results)=>{
            if(err) throw err;
          
            res.status(200).json({ message: 'Updated successfully' });
        })
    }
    catch(err){
        console.log(err,'err')
    }
})

router.post('/ticket_status_inprocess',authenticate,async (req,res)=>{
    try{
        let pool=await dbConnection();
        let ticket_id=req.body.ticket_id;
      
        let tkt_status_chg=req.body.tkt_status_chg;
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
        let closed_date=getCurrentDateAndTime()

        let query1=`UPDATE product_issues_master SET is_active=?, inprocess_by=?, inprocess_at=? WHERE ticket_id=?`
        let queryData1=[tkt_status_chg,employeeDataString,closed_date,ticket_id]
        pool.query(query1,queryData1,(err,results)=>{
            if(err) throw err;

            res.status(200).json({ message: 'Updated successfully' });
        })
    }
    catch(err){
        console.log(err,'err')
    }
})


router.post('/ticket_status_resolved', authenticate, upload.fields([
    { name: 'invest_img1', maxCount: 1 },
    { name: 'invest_img2', maxCount: 1 },
    { name: 'invest_video', maxCount: 1 }
]), async (req, res) => {
    try {
        // Access form data
        let formData = req.body;
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
        let closed_date = getCurrentDateAndTime();
        const attachments = req.files;

        // Parse and format the date using moment.js
        let invest_date = moment(formData.invest_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
        console.log(invest_date,'invest_date')
        let query1 = `
        UPDATE product_issues_master SET 
        is_active=?, 
        resolved_by=?, 
        resolved_at=?,  
        person_meet=?, 
        investigated_at=?, 
        investigation_details=?, 
        action_taken=?, 
        inv_image_1=?, 
        inv_image_2=?, 
        inv_video=? 
        WHERE ticket_id=?`;
        let queryData1 = [
            formData.tkt_status_chg,
            employeeDataString,
            closed_date,
            formData.person_meet,
            invest_date,
            formData.invst_detl,
            formData.action_taken,
            attachments.invest_img1[0] ? attachments.invest_img1[0].filename : null,
            attachments.invest_img2[0] ? attachments.invest_img2[0].filename : null,
            attachments.invest_video && attachments.invest_video[0].filename,
            // attachments.invest_video[0] ? attachments.invest_video[0].originalname : null,    
            formData.ticket_id
        ];

        // Execute database query
        let pool = await dbConnection();
        pool.query(query1, queryData1, (err, result1) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log(result1, 'result121212121');
            res.status(200).json({ message: 'Updated successfully' });
        });
    } catch (err) {
        console.log(err, 'err');
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/ticket_status_closed',authenticate,async (req,res)=>{
    try{
        let pool=await dbConnection();
        let ticket_id=req.body.ticket_id;
        let close_comment=req.body.close_comment;

        console.log(ticket_id,'ticket_id')
        let tkt_status_chg=req.body.tkt_status_chg;
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
        let closed_date=getCurrentDateAndTime()
        
        let query1=`UPDATE product_issues_master SET is_active=?, closed_by=?, closed_at=?, closed_comment=? WHERE ticket_id=?`
        let queryData1=[tkt_status_chg,employeeDataString,closed_date, close_comment,ticket_id];
        
        pool.query(query1,queryData1,(err,results)=>{
            if(err) throw err;
            console.log(results)
            res.status(200).json({ message: 'Updated successfully' });
        })
    }
    catch(err){
        console.log(err,'err')
    }
})


router.post('/ticket_status_reopen',authenticate,async (req,res)=>{
    try{
        let pool=await dbConnection();
        let ticket_date=getCurrentDateAndTime();
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;


        let {ticket_id, tkt_status_chg}=req.body

        let query1=`UPDATE product_issues_master SET is_active=? WHERE ticket_id=?`
        let queryData1=[tkt_status_chg, ticket_id];
        
        pool.query(query1,queryData1,(err,results)=>{
            if(err) throw err;
            console.log(results,'results__results')
            let query2=`
            INSERT INTO reopen_issues_master (
            pre_ticket_id,
            ticket_date,
            is_active,
            raised_by
            ) VALUES (?,?,?,?)`
            let queryData2=[
                ticket_id,
                ticket_date, 
                tkt_status_chg,
                employeeDataString]

            pool.query(query2,queryData2,(err2,results2)=>{
            if(err2) throw err2;
            console.log(results2,'results2__results2_ereureureoi')

            res.status(200).json({ message: 'Updated successfully' });
            })
        })
    }
    catch(err){
        console.log(err,'err')
    }
})


router.get('/complaint_form',authenticate, async (req, res) => {
    try {

        let pool = await dbConnection()
        let query = `SELECT DISTINCT c_category FROM complaint_type WHERE is_active = 1;`
        pool.query(query, (err, results) => {
            if (err) throw err;
            
            res.render('complaint_form', { data: results })
        })
    } catch (error) {
        logger.error('error in get complaint_form:: ', error)
    }
})


router.get('/all_sla_wise_tickets',authenticate, (req, res) => {
    res.render('all_sla_wise_tickets')
})
router.get('/all_ticket_list',authenticate, (req, res) => {
    res.render('all_ticket_list')
})
router.get('/complaint_resolution',authenticate, (req, res) => {
    res.render('complaint_resolution')
})



router.get('/complaint_handling_form',authenticate, (req, res) => {
    res.render('complaint_handling_form')
})
router.get('/sla_tat_config',authenticate, async (req, res) => {
    try {

        let pool = await dbConnection();

        let query = `SELECT id,c_category,ticket_category,ticket_type,1st_Level_TAT,1st_Level_SLA,2nd_Level_TAT,2nd_Level_SLA,3rd_Level_TAT,3rd_Level_SLA,created_at FROM cms_slandtat_config`
        pool.query(query, (err, results) => {
            console.log(results,'resultsqqqqqqqqq11111')

            if (err) throw err;
            res.render('sla_tat_config', { data: results, })
        })
    } catch (error) {
        logger.error('error in get complaint_form:: ', error)
    }


   
})
router.get("/sla_tat_config_edit/:id", authenticate,async (req, res) => {
    try {
      let pool = await dbConnection();
      let sla_tat_id=req.params.id;
   
  
      let query1 = `SELECT c_category,ticket_category,1st_Level_TAT, 1st_Level_SLA, 2nd_Level_TAT, 2nd_Level_SLA, 3rd_Level_TAT, 3rd_Level_SLA  FROM cms_slandtat_config WHERE id= ${sla_tat_id}`;
  
      pool.query(query1, (err, results) => {
        if (err) throw err;
        console.log(results,'resultsqwq1111')
        res.render('sla_tat_config_edit', { data: results, sla_tat_id:sla_tat_id })
    })
    } catch (error) {
    logger.error('error in get complaint_form:: ', error)
    }
  });

  router.post('/sla_tat_config_edit', authenticate, async (req, res) => {
    try {
        const pool = await dbConnection();
        const { ticket_type, level_1st_tat, level_1st_sla, level_2nd_tat, level_2nd_sla, level_3rd_tat, level_3rd_sla,sla_tat_id } = req.body;
        const currentDateAndTime = getCurrentDateAndTime();
        

        const updateQuery = `UPDATE cms_slandtat_config SET 1st_Level_TAT = ?, 1st_Level_SLA = ?, 2nd_Level_TAT = ?, 2nd_Level_SLA = ?,3rd_Level_TAT = ?, 3rd_Level_SLA = ?, ticket_type = ?, modified_date = ?
        WHERE id=?`;

        const queryParams =[level_1st_tat, level_1st_sla, level_2nd_tat, level_2nd_sla, level_3rd_tat, level_3rd_sla, ticket_type, currentDateAndTime,sla_tat_id ];
        // console.log(queryParams,'queryParamsqueryParamsqueryParams')
        pool.query(updateQuery, queryParams, (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            // console.log(results,'resultsresultsresults11')
            console.log('Updated successfully');
            return res.status(200).json({ message: 'Updated successfully' });
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

  router.get("/add_sla_tat_config", authenticate,async (req, res) => {
    try{
      let pool=await dbConnection();
      let c_catgy= `SELECT DISTINCT c_category FROM complaint_type`;
      let ticket_catgy=`SELECT DISTINCT ticket_category FROM complaint_type`;
      let ticket_type=`SELECT DISTINCT ticket_type FROM complaint_type`;
  
    
  
      let [c_catgyData, ticket_catgyData, ticket_typeData] = await Promise.all([
        new Promise((resolve, reject) => {
          pool.query(c_catgy, (err, results) => {
            if (err) reject(err);
          
            resolve(results);
  
          });
        }),
        new Promise((resolve, reject) => {
          pool.query(ticket_catgy, (err, results) => {
            if (err) reject(err);
           
            resolve(results);
  
          });
        }),
        new Promise((resolve, reject) => {
          pool.query(ticket_type, (err, results) => {
            if (err) reject(err);
            
            resolve(results);
  
          });
        }),
        
      ]);
      
      
  
      res.render("add_sla_tat_config",{
        c_catgyData:c_catgyData,
        ticket_catgyData:ticket_catgyData,
        ticket_typeData:ticket_typeData
  
      });
    }
    catch(error){
      console.log(error)
    }
  });

  
  
router.get("/add_sla_tat_config", authenticate,async (req, res) => {
    try{
      let pool=await dbConnection();
      let c_catgy= `SELECT DISTINCT c_category FROM complaint_type`;
      let ticket_catgy=`SELECT DISTINCT ticket_category FROM complaint_type`;
      let ticket_type=`SELECT DISTINCT ticket_type FROM complaint_type`;
  
      // let query2=`INSERT INTO cms_slandtat_config (c_category,ticket_category,ticket_type,1st_Level_TAT, 1st_Level_SLA, 2nd_Level_TAT, 2nd_Level_SLA, 3rd_Level_TAT, 3rd_Level_SLA) VALUE (?,?,?,?,?,?,?,?,?)`;
  
      let [c_catgyData, ticket_catgyData, ticket_typeData] = await Promise.all([
        new Promise((resolve, reject) => {
          pool.query(c_catgy, (err, results) => {
            if (err) reject(err);
          //   console.log(results,'results111')
            resolve(results);
  
          });
        }),
        new Promise((resolve, reject) => {
          pool.query(ticket_catgy, (err, results) => {
            if (err) reject(err);
            console.log(results,'results222')
            resolve(results);
  
          });
        }),
        new Promise((resolve, reject) => {
          pool.query(ticket_type, (err, results) => {
            if (err) reject(err);
            console.log(results,'results333')
            resolve(results);
  
          });
        }),
        
      ]);
      
      
  
      res.render("add_sla_tat_config",{
        c_catgyData:c_catgyData,
        ticket_catgyData:ticket_catgyData,
        ticket_typeData:ticket_typeData
  
      });
    }
    catch(error){
      console.log(error)
    }
  });
  
  router.post('/ticket_category_dropdown', async (req, res) => {
      try {
          let pool = await dbConnection();
  
          let complaint_category = req.body.complaint_category;
          
      
          let query = `SELECT DISTINCT ticket_category FROM complaint_type WHERE c_category=?`;
          pool.query(query, [complaint_category], (err, results) => {
              
              if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Database error' });
              } else {
                  res.json({ data: results });
              }
          });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
      }
  });
  
  
  router.post('/ticket_type_dropdown111', async (req, res) => {
      try {
          let pool = await dbConnection();
  
          let ticket_category = req.body.ticket_category;
          
  
          let query = `SELECT DISTINCT ticket_type FROM complaint_type WHERE ticket_category=?`;
          pool.query(query, [ticket_category], (err, results) => {
                  console.log(results,'results999999999')
              if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Database error' });
              } else {
                  res.json({ data: results });
              }
          });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
      }
  });
  
  
  router.post('/add_sla_tat_config',async(req,res)=>{
      try{
          let pool = await dbConnection();
          let {c_catgy,ticket_catgy,ticket_type,level_1st_tat,level_1st_sla,level_2nd_tat,level_2nd_sla,level_3rd_tat,level_3rd_sla}=req.body;
          let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
          const currentDateAndTime = getCurrentDateAndTime();
  
          let query1=`INSERT INTO cms_slandtat_config(c_category, ticket_category, ticket_type, 1st_Level_TAT, 1st_Level_SLA, 2nd_Level_TAT, 2nd_Level_SLA, 3rd_Level_TAT, 3rd_Level_SLA, created_at, creation_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
          let values_inst=[c_catgy,ticket_catgy,ticket_type,level_1st_tat,level_1st_sla,level_2nd_tat,level_2nd_sla,level_3rd_tat,level_3rd_sla,employeeDataString,currentDateAndTime]
          // console.log(values_inst,'values_inst1111')
          pool.query(query1,values_inst,(err,results)=>{
              if(err){
                  console.error(err);
                  res.status(500).json({error:'Database error'})
              }
              else{
                  // console.log(results,'results111111')
                  res.json({ data:results })
              }
          })
      
      
      }
      catch(error){
          console.log(error)
          res.status(500).json({ error: 'Internal server error' });
      }
  })
  


router.post('/ticket_type_dropdown', async (req, res) => {
    try {
        let pool = await dbConnection();

        let ticket_category = req.body.ticket_category;
        
    
        let query = `SELECT DISTINCT ticket_category FROM complaint_type WHERE c_category=?`;
        pool.query(query, [ticket_category], (err, results) => {
            
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ data: results });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/ticket_type1_dropdown', async (req, res) => {
    try {
        let pool = await dbConnection();

        let ticket_category1 = req.body.ticket_category1;
        let cate= req.body.cate;

        let query = `SELECT DISTINCT ticket_type FROM complaint_type WHERE ticket_category=? AND c_category=?`;
        pool.query(query, [ticket_category1,cate], (err, results) => {
                console.log(results,'results')
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ data: results });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/product_category', async (req, res) => {
    try {
        let pool = await dbConnection();
        let ticket_category =req.body.ticket_type;
       
        let query = `SELECT DISTINCT p_category FROM product_equation where c_category=?`;
        pool.query(query,[ticket_category], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Database error' });
            } else {


                let query2 = `SELECT DISTINCT visit_type FROM visit_type WHERE is_active=1`;
                pool.query(query2, (err, results2) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Database error' });
                    } else {

                        let query3 = `SELECT DISTINCT customer_name FROM customer_type WHERE is_active=1`;
                        pool.query(query3, (err, results3) => {
                            if (err) {
                                console.error(err);
                                res.status(500).json({ error: 'Database error' });
                            } else {


                                
                                res.json({ data: results, data2: results2, data3: results3 });
                            }

                        })
                    }

                })
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/product_name', async (req, res) => {
    try {
        let pool = await dbConnection();

        let category = req.body.category;

        let query = `SELECT product_name FROM product_master WHERE product_category=?`;
        pool.query(query, [category], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ data: results });
            }   
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
});
router.post('/sku', async (req, res) => {
    try {
        let pool = await dbConnection();

        let product = req.body.product;

        let query = `SELECT sku, unit FROM product_master WHERE product_name=?`;
        pool.query(query, [product], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ data: results });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// router.get('/c_location', async (req, res) => {
//     try {
//         let pool = await dbConnection();

//         let query = `SELECT c_location,id FROM complaint_location `;
//         pool.query(query, (err, results) => {
//             if (err) {
//                 console.error(err);
//                 res.status(500).json({ error: 'Database error' });
//             } else {
//                 console.log(results,'results_fjljfijeeii')
//                 res.json({ data: results });
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

router.post('/ticket_location', async (req, res) => {
    try {
        let pool = await dbConnection();

        let query = `SELECT DISTINCT id, c_location FROM complaint_location `;
        pool.query(query, (err, results) => {
                // console.log(results,'resultsjflkajjflajfljajf')
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ data: results });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});







router.post('/insert_data', 
    upload.fields([
        { name: 'Attachment1', maxCount: 1 },
        { name: 'Attachment2', maxCount: 1 },
        { name: 'Attachment3', maxCount: 1 }
    ]), async function (req, res) {    
    
    try {
        let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;
        const currentDateAndTime = getCurrentDateAndTime();
        let pool = await dbConnection();
        const formData = req.body;
      

        

        const attachments = req.files;
        console.log(attachments,'attachments_12_12_12')
      
        const insertQuery = `INSERT INTO product_issues_master(
            ticket_category,
            ticket_sub_category,
            ticket_type,
            product_category,
            product_name,
            sku,
            batch_no,
            manufacturing_date,
            visit_type,
            customer_type,
            customer_phone,
            customer_name,
            customer_address,
            customer_location,
            quantity_purchage,
            quantity_rejected,
            person_meet,
            description,
            front_image,
            back_image,
            video_link,
            ticket_date,
            raised_by,
            customer_code,
            ticket_location
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const values = [
            formData.ticket_type,
            formData.ticket_type_dd,
            formData.ticket_type1_dd,
            formData.product_category,
            formData.product_name,
            formData.sku,
            formData.batch_no,
            formData.manufacturing,
            formData.visit_type,
            formData.cutomer_type,
            formData.customer_phone,
            formData.customer_name,
            formData.customer_address,
            formData.Customer_Location,
            formData.quantity_Purchase,
            formData.quantity_Rejected,
            formData.Person_Meet,
            formData.reason_for_complaint,
            attachments.Attachment1 && attachments.Attachment1[0].filename,
            attachments.Attachment2 && attachments.Attachment2[0].filename,
            attachments.Attachment3 && attachments.Attachment3[0].filename,
            currentDateAndTime,
            employeeDataString,
            formData.cusotmer_code,
            formData.ticket_location
            
        ];

        pool.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error('Error inserting data into the database:', err);
                res.status(500).json({ success: false, message: 'Error inserting data into the database' });
            } else {
                console.log(result,'result_12_12')
                console.log('Data inserted successfully');

                let ticket_id_query = `SELECT * FROM product_issues_master ORDER BY ticket_id DESC LIMIT 1;`;

                pool.query(ticket_id_query, (err,ticket_id_results) => {
                    if (err) {
                        console.error('Error retrieving ticket ID:', err);
                        res.status(500).json({ success: false, message: 'Error retrieving ticket ID' });
                    } else {
                      
                        res.json({ success: true, message: 'Data inserted successfully', all_data1:ticket_id_results });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



router.post('/insert_data_2', 
    upload.fields([
        { name: 'Attachment1', maxCount: 1 },
        { name: 'Attachment2', maxCount: 1 },
        { name: 'Attachment3', maxCount: 1 }
    ]), async function (req, res) {    
    
    try {
        let employeeDataString = `${req.body.emp_id}:${req.body.emp_name}`;
        let emp_id = req.body.emp_id;
           
        const currentDateAndTime = getCurrentDateAndTime();
        let pool = await dbConnection();
        const formData = req.body;

        const attachments = req.files;
        const insertQuery = `INSERT INTO product_issues_master(
            ticket_category,
            ticket_sub_category,
            ticket_type,
            product_category,
            product_name,
            sku,
            batch_no,
            manufacturing_date,
            visit_type,
            customer_type,
            customer_phone,
            customer_name,
            customer_address,
            customer_location,
            quantity_purchage,
            quantity_rejected,
            person_meet,
            description,
            front_image,
            back_image,
            video_link,
            ticket_date,
            raised_by,
            customer_code,
            ticket_location
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const values = [
            formData.ticket_type,
            formData.ticket_type_dd,
            formData.ticket_type1_dd,
           
            formData.product_category,
            formData.product_name,
            formData.sku,
            formData.batch_no,
            formData.manufacturing,
            formData.visit_type,
            formData.cutomer_type,
            formData.customer_phone,
            formData.customer_name,
            formData.customer_address,
            formData.Customer_Location,
            formData.quantity_Purchase,
            formData.quantity_Rejected,
            formData.Person_Meet,
            formData.reason_for_complaint,
            attachments.Attachment1 && attachments.Attachment1[0].filename,
            attachments.Attachment2 && attachments.Attachment2[0].filename,
            attachments.Attachment3 && attachments.Attachment3[0].filename,
            currentDateAndTime,
            employeeDataString,
            formData.cusotmer_code,
            formData.ticket_location
            
        ];

        pool.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error('Error inserting data into the database:', err);
                res.status(500).json({ success: false, message: 'Error inserting data into the database' });
            } else {
                console.log(result,'result_12_12')
                console.log('Data inserted successfully');
                let ticket_id_query = `SELECT * FROM product_issues_master ORDER BY ticket_id DESC LIMIT 1;`;

                pool.query(ticket_id_query, (err, ticket_id_results) => {
                    if (err) {
                        console.error('Error retrieving ticket ID:', err);
                        res.status(500).json({ success: false, message: 'Error retrieving ticket ID' });
                    } else {
                       
                        res.json({ success: true, message: 'Data inserted successfully', all_data1:ticket_id_results,emp_id:emp_id });
                    }
                });
            }
              // Call the function to start checking status and timer
                checkStatusAndStartTimer();
        });
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});




router.post("/send-email", async (req, res) => {

    const emp = req.session.employeeId;
   
    let ticket_data=req.body.ticket_data
    let ticket_id = ticket_data.ticket_id;
    let ticket_category = ticket_data.ticket_category;
    let ticket_type = ticket_data.ticket_type;
    let ticket_location = ticket_data.ticket_location;
    let customer_name = ticket_data.customer_name;
    let customer_phone = ticket_data.customer_phone;
    let product_category = ticket_data.product_category;
    let batch_no = ticket_data.batch_no;
    let sku = ticket_data.sku;
    let product_name = ticket_data.product_name;
    let customer_location = ticket_data.customer_location;
    let quantity_purchage = ticket_data.quantity_purchage;
    let quantity_rejected = ticket_data.quantity_rejected;
    let manufacturing_date = ticket_data.manufacturing_date;
    let ticket_status=ticket_data.is_active;
 


    let pool = await dbConnection();
    let format = formatCurrentDate();
    let time = getCurrentTime()
   
    let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;

    let comp_location_query = `SELECT * FROM complaint_location WHERE c_location=?`
    pool.query(comp_location_query,[ticket_location], async (error, comp_location_result) => {

        let comp_loca = comp_location_result[0].id;
        if (error) {
            console.error("Error retrieving data from complaint_location table:", error);
            return;
        }
        console.log(comp_location_result, 'comp_location_result');

        let c_locationData = `SELECT email_to, email_cc,levels FROM cms_email_type WHERE c_category = ? AND FIND_IN_SET(?, complaint_location) > 0`;

        pool.query(c_locationData, [ticket_category, comp_loca], async (err, c_locationData_result) => {

            let email_to=c_locationData_result[0].email_to;
            let email_cc=c_locationData_result[0].email_cc;
            let levels = c_locationData_result[0].levels;
           
            if (err) {
                console.error("Error retrieving data from cms_email_type table:", err);
                return;
            }
            



    let product = `SELECT business_head_email FROM product_equation WHERE c_category=?`
  
    pool.query(product,[ticket_category],async(error,product_result) => {

        let product_res = product_result[0].business_head_email

       
        let mailquery = `SELECT * FROM cms_user_login WHERE EMP_CODE=?`
        pool.query(mailquery, [emp], async (error, results) => {
        if (error) throw error;
       
       
        let cc1 = results[0].Emp_Email_ID
        let cc2 = results[0].REP_MANAGER_Email_ID
        let receiver1 = results[0].RSM_ZSM_Email_ID
        let sales_preson_ph_no=results[0].EMP_NUMBER

        let toAddresses = `${cc1}`;
        let ccAddresses = `${receiver1},${cc2}`;
        let business_head_email=`${product_res}`;

        let transporter = nodemailer.createTransport({
            host: 'jublcorp.mail.protection.outlook.com',
            port: 25,
            secure: false,
            auth: {
                user: 'g-smart.helpdesk@jubl.com',
                pass: 'jubl@123'
            },
            debug: true
        });
    const mailOptions = {
        
        from: "g-smart.helpdesk@jubl.com",
        to:email_to,
        cc:[email_cc,business_head_email],
        subject: `Ticket Id:${ticket_id}, Created, Raised by : ${employeeDataString}`,


       html:`
       <!DOCTYPE html>
       <html lang="en">

       <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>CMS</title>
       </head>

       <body>

       <div style="font-size: 13px;>Dear Team,</div>
                      
                        <div style="font-size: 13px;">New Complaint has been raised by ( ${employeeDataString} ).</div>
                        <div style="font-size: 13px;">Please find the complaint details below:</div>
                        <div style="font-size: 13px;">Status: Open</div>



                        
                    <div style="margin-top: 40px;">
           <div style="width: 100%;margin-top: 20px;">
               <div style="width: 80%; border: 1px solid lightgray;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
               border-radius: 10px 10px 10px 10px;">
            <div style="text-align: center;color: white;background: #0473cf;padding-top:8px !important;padding-bottom:8px !important;border-radius: 10px 10px 0px 0px;font-size: 15px;font-weight: 500;">Ticket Details</div>

                   <table style="width: 100%;
                       padding-bottom: 10px;
                       font-size: 13px;
                       color: black;
                       ">                
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint No</td>
                           <td style=" padding-top: 8px;">${ticket_id}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint Received on</td>
                           <td style=" padding-top: 8px;">
                               ${format}
                               <br>
                               ${time}
                           </td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Ticket Catogory</td>
                           <td style=" padding-top: 8px;">${ticket_category}</td>
                       </tr>
       
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Nature of Complaint	</td>
                           <td style=" padding-top: 8px;">${ticket_type}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Name</td>
                           <td style=" padding-top: 8px;">${customer_name}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Phone No.</td>
                           <td style=" padding-top: 8px;">${customer_phone}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Sales Person Phone No.</td>
                           <td style=" padding-top: 8px;">${sales_preson_ph_no}</td>
                       </tr>


                   </table>
               </div>
       </div>





       <div 
       style="width: 100%;
       margin-top: 15px;
       ">
           <div 
           style="
           width: 80%;
           border: 1px solid lightgray;
           box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
           border-radius: 10px 10px 10px 10px;    
           ">

           <div 
           style="                 
           text-align: center;
           color: white;
           background: #0473cf;
           padding: 8px 0px 8px 0px;
           border-radius: 10px 10px 0px 0px;
           font-size: 15px;
           font-weight: 500;
           ">
               Product Details
           </div>
               <table style="
                   width: 100%;
                   padding-bottom: 10px;
                   font-size: 13px;      
                   color: black;             
                   ">
           
                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Product Catogory</td>
                       <td style=" padding-top: 8px;">${product_category}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Batch No</td>
                       <td style=" padding-top: 8px;">
                           ${batch_no}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Sku/Product Name</td>
                       <td style=" padding-top: 8px;">
                            ${product_name}
                           <br>
                            ${sku}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Location</td>
                       <td style=" padding-top: 8px;">
                       ${customer_location}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Purchase</td>
                       <td style=" padding-top: 8px;">${quantity_purchage}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Rejected</td>
                       <td style=" padding-top: 8px;">${quantity_rejected}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Manufacturing Date</td>
                       <td style=" padding-top: 8px;">${manufacturing_date}</td>
                   </tr>


               </table>
           </div>
       </div>

       <div style="font-size: 15px; margin-top: 30px; font-weight: bold;">
           Thanks & Regards
       </div>

       <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
           JACPL Quality Team
       </div>
       <div style="font-style: italic; font-size: 10px;">
           *This is a system generated email, do not reply to this email id.
       </div>

       </body>

       </html>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Email Error:", error);
            res.status(500).send("Error sending email");
        } else {
            console.log("Email sent:", info.response);

            const additionalMailOptions = {
                from: "g-smart.helpdesk@jubl.com",
                to: toAddresses,
                cc:[ccAddresses,business_head_email],
                subject: `Ticket Id:${ticket_id}, Created, Raised by : ${employeeDataString}`,
                html: `
           
                
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMS</title>

</head>
<body>

  <div style="font-size: 13px;">Dear ${req.session.emp_Name},</div>
  <div style="font-size: 13px;">
  Please find the details below.
  </div>


  <div style="color: white; background-color: #0dcaf0; border-radius: 10px ;padding: 10px;  margin-top: 10px;">
      <div style="color: #0dcaf0;">empty </div> 
      <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp;  Complaint No</div>
      <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ticket_id}</div>
      <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
      <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
      <div style="color: #0dcaf0;">empty </div> 

  </div>

  <div style="color: white; background-color: #198754; border-radius: 10px ;padding: 10px; margin-top: 10px;">
    <div style="color: #198754;">empty </div> 
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Status:</div>
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Open</div>
    <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
    <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
    <div style="color: #198754;">empty </div> 
  </div>

  <div style="color: white; background-color: #ffc107; border-radius: 10px ;padding: 10px; margin-top: 10px;">
    <div style="color: #ffc107;">empty </div> 
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Raised By:</div>
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${employeeDataString}</div>
    <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
    <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
    <div style="color: #ffc107;">empty </div> 
  </div>



<div style="font-size: 15px; margin-top: 60px; font-weight: bold;">
    Thanks & Regards
</div>

<div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
    JACPL Quality Team
</div>
<div style="font-style: italic; font-size: 10px;">
    *This is a system generated email, do not reply to this email id.
</div>



  
</body>
</html>
              
            
            `,
            };

            
       
            transporter.sendMail(additionalMailOptions, (additionalError, additionalInfo) => {
                if (additionalError) {
                    console.error("Additional Email Error:", additionalError);

                } else {
                    console.log("Additional Email sent:", additionalInfo.response);
                    
                }

            });

            res.status(200).send("Existing email sent successfully");
       
        }
    });
    });
    });
    });
})
    });

router.post("/send-email-connect", async (req, res) => {

   
 const emp = req.body.emp_id;
   
    let ticket_data=req.body.ticket_data
    let ticket_id = ticket_data.ticket_id;
    let ticket_category = ticket_data.ticket_category;
    let ticket_type = ticket_data.ticket_type;
    let ticket_location = ticket_data.ticket_location;
    let customer_name = ticket_data.customer_name;
    let customer_phone = ticket_data.customer_phone;
    let product_category = ticket_data.product_category;
    let batch_no = ticket_data.batch_no;
    let sku = ticket_data.sku;
    let product_name = ticket_data.product_name;
    let customer_location = ticket_data.customer_location;
    let quantity_purchage = ticket_data.quantity_purchage;
    let quantity_rejected = ticket_data.quantity_rejected;
    let manufacturing_date = ticket_data.manufacturing_date;
    let ticket_status=ticket_data.is_active;
 


    let pool = await dbConnection();
    let format = formatCurrentDate();
    let time = getCurrentTime()
   
    let employeeDataString = `${req.session.employeeId}:${req.session.emp_Name}`;

    let comp_location_query = `SELECT * FROM complaint_location WHERE c_location=?`
    pool.query(comp_location_query,[ticket_location], async (error, comp_location_result) => {

        let comp_loca = comp_location_result[0].id;
        if (error) {
            console.error("Error retrieving data from complaint_location table:", error);
            return;
        }
        console.log(comp_location_result, 'comp_location_result');

        let c_locationData = `SELECT email_to, email_cc,levels FROM cms_email_type WHERE c_category = ? AND FIND_IN_SET(?, complaint_location) > 0`;

        pool.query(c_locationData, [ticket_category, comp_loca], async (err, c_locationData_result) => {

            let email_to=c_locationData_result[0].email_to;
            let email_cc=c_locationData_result[0].email_cc;
            let levels = c_locationData_result[0].levels;
           
            if (err) {
                console.error("Error retrieving data from cms_email_type table:", err);
                return;
            }
            



    let product = `SELECT business_head_email FROM product_equation WHERE c_category=?`
  
    pool.query(product,[ticket_category],async(error,product_result) => {

        let product_res = product_result[0].business_head_email

        let issue_maaster= `SELECT raised_by FROM product_issues_master where ticket_id=?`
        pool.query(issue_maaster,[ticket_id],async(errorr,resultss)=>{
            if (errorr) throw errorr;

            let emp_id = resultss[0].raised_by;
            console.log(emp_id,'emp_id')

        let mailquery = `SELECT * FROM cms_user_login WHERE EMP_CODE=?`
        pool.query(mailquery, [emp_id], async (error, results) => {
        if (error) throw error;
       
       
        let cc1 = results[0].Emp_Email_ID
        let cc2 = results[0].REP_MANAGER_Email_ID
        let receiver1 = results[0].RSM_ZSM_Email_ID
       
        let toAddresses = `${cc1}`;
        let ccAddresses = `${receiver1},${cc2}`;
        let business_head_email=`${product_res}`;
      

    
        let transporter = nodemailer.createTransport({
            host: 'jublcorp.mail.protection.outlook.com',
            port: 25,
            secure: false,
            auth: {
                user: 'g-smart.helpdesk@jubl.com',
                pass: 'jubl@123'
            },
            debug: true
        });
    const mailOptions = {
        from: "g-smart.helpdesk@jubl.com",
        to: business_head_email,
      
        subject: `Ticket Id:${ticket_id}, Created, Raised by : ${employeeDataString}`,


       html:`
       <!DOCTYPE html>
       <html lang="en">

       <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>CMS</title>
       </head>

       <body>

       <div style="font-size: 13px;>Dear Team,</div>
                      
                        <div style="font-size: 13px;">New Complaint has been raised by ( ${employeeDataString} ).</div>
                        <div style="font-size: 13px;">Please find the complaint details below:</div>
                        <div style="font-size: 13px;">Status: Open</div>



                        
                    <div style="margin-top: 40px;">
           <div style="width: 100%;margin-top: 20px;">
               <div style="width: 80%; border: 1px solid lightgray;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
               border-radius: 10px 10px 10px 10px;">
            <div style="text-align: center;color: white;background: #0473cf;padding-top:8px !important;padding-bottom:8px !important;border-radius: 10px 10px 0px 0px;font-size: 15px;font-weight: 500;">Ticket Details</div>

                   <table style="width: 100%;
                       padding-bottom: 10px;
                       font-size: 13px;
                       color: black;
                       ">                
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint No</td>
                           <td style=" padding-top: 8px;">${ticket_id}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint Received on</td>
                           <td style=" padding-top: 8px;">
                               ${format}
                               <br>
                               ${time}
                           </td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Ticket Catogory</td>
                           <td style=" padding-top: 8px;">${ticket_category}</td>
                       </tr>
       
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Nature of Complaint	</td>
                           <td style=" padding-top: 8px;">${ticket_type}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Name</td>
                           <td style=" padding-top: 8px;">${customer_name}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Phone No.</td>
                           <td style=" padding-top: 8px;">${customer_phone}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Sales Person Phone No.</td>
                           <td style=" padding-top: 8px;">880020602</td>
                       </tr>


                   </table>
               </div>
       </div>





       <div 
       style="width: 100%;
       margin-top: 15px;
       ">
           <div 
           style="
           width: 80%;
           border: 1px solid lightgray;
           box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
           border-radius: 10px 10px 10px 10px;    
           ">

           <div 
           style="                 
           text-align: center;
           color: white;
           background: #0473cf;
           padding: 8px 0px 8px 0px;
           border-radius: 10px 10px 0px 0px;
           font-size: 15px;
           font-weight: 500;
           ">
               Product Details
           </div>
               <table style="
                   width: 100%;
                   padding-bottom: 10px;
                   font-size: 13px;      
                   color: black;             
                   ">
           
                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Product Catogory</td>
                       <td style=" padding-top: 8px;">${product_category}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Batch No</td>
                       <td style=" padding-top: 8px;">
                           ${batch_no}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Sku/Product Name</td>
                       <td style=" padding-top: 8px;">
                            ${product_name}
                           <br>
                            ${sku}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Location</td>
                       <td style=" padding-top: 8px;">
                       ${customer_location}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Purchase</td>
                       <td style=" padding-top: 8px;">${quantity_purchage}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Rejected</td>
                       <td style=" padding-top: 8px;">${quantity_rejected}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Manufacturing Date</td>
                       <td style=" padding-top: 8px;">${manufacturing_date}</td>
                   </tr>


               </table>
           </div>
       </div>

       <div style="font-size: 15px; margin-top: 30px; font-weight: bold;">
           Thanks & Regards
       </div>

       <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
           JACPL Quality Team
       </div>
       <div style="font-style: italic; font-size: 10px;">
           *This is a system generated email, do not reply to this email id.
       </div>

       </body>

       </html>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Email Error:", error);
            res.status(500).send("Error sending email");
        } else {
            console.log("Email sent:", info.response);

            const additionalMailOptions = {
                from: "g-smart.helpdesk@jubl.com",
                to: toAddresses,
                cc:ccAddresses,
                subject: `Ticket Id:${ticket_id}, Created, Raised by : ${employeeDataString}`,
                html: `
           
                
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMS</title>

</head>
<body>

  <div style="font-size: 13px;">Dear ${req.session.emp_Name},</div>
  <div style="font-size: 13px;">
  Please find the details below.
  </div>


  <div style="color: white; background-color: #0dcaf0; border-radius: 10px ;padding: 10px;  margin-top: 10px;">
      <div style="color: #0dcaf0;">empty </div> 
      <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp;  Complaint No</div>
      <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${ticket_id}</div>
      <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
      <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
      <div style="color: #0dcaf0;">empty </div> 

  </div>

  <div style="color: white; background-color: #198754; border-radius: 10px ;padding: 10px; margin-top: 10px;">
    <div style="color: #198754;">empty </div> 
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Status:</div>
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Open</div>
    <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
    <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
    <div style="color: #198754;">empty </div> 
  </div>

  <div style="color: white; background-color: #ffc107; border-radius: 10px ;padding: 10px; margin-top: 10px;">
    <div style="color: #ffc107;">empty </div> 
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; Raised By:</div>
    <div style="font-size: 18px; font-weight: bold;">&nbsp;&nbsp;&nbsp; ${employeeDataString}</div>
    <div style="font-size: 15px; ">&nbsp;&nbsp;&nbsp;&nbsp; LOGGED ON</div>
    <div style="font-size: 15px;">&nbsp;&nbsp;&nbsp;&nbsp; ${format}, ${time}</div>
    <div style="color: #ffc107;">empty </div> 
  </div>



<div style="font-size: 15px; margin-top: 60px; font-weight: bold;">
    Thanks & Regards
</div>

<div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
    JACPL Quality Team
</div>
<div style="font-style: italic; font-size: 10px;">
    *This is a system generated email, do not reply to this email id.
</div>



  
</body>
</html>
              
            
            `,
            };

            
       
            transporter.sendMail(additionalMailOptions, (additionalError, additionalInfo) => {
                if (additionalError) {
                    console.error("Additional Email Error:", additionalError);

                } else {
                    console.log("Additional Email sent:", additionalInfo.response);
                    
                    if(levels === "L-1"){

                        const additionalMailOption = {
                            from: "g-smart.helpdesk@jubl.com",
                            to: email_to,
                            cc:email_cc,
                            subject: `Ticket Id:${ticket_id}, Created, Raised by : ${employeeDataString}`,
                            html: `
                        <!DOCTYPE html>
                        <html lang="en">

                        
                        <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>CMS</title>
                        <body>

                        <div style="font-size: 13px;>Dear Team,</div>
                      
                        <div style="font-size: 13px;">New Complaint has been raised by ( ${employeeDataString} ).</div>
                        <div style="font-size: 13px;">Please find the complaint details below:</div>
                        <div style="font-size: 13px;">Status: Open</div>



                        
                    <div style="margin-top: 40px;">
           <div style="width: 100%;margin-top: 20px;">
               <div style="width: 80%; border: 1px solid lightgray;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
               border-radius: 10px 10px 10px 10px;">
            <div style="text-align: center;color: white;background: #0473cf;padding-top:8px !important;padding-bottom:8px !important;border-radius: 10px 10px 0px 0px;font-size: 15px;font-weight: 500;">Ticket Details</div>

                   <table style="width: 100%;
                       padding-bottom: 10px;
                       font-size: 13px;
                       color: black;
                       ">                
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint No</td>
                           <td style=" padding-top: 8px;">${ticket_id}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Complaint Received on</td>
                           <td style=" padding-top: 8px;">
                               ${format}
                               <br>
                               ${time}
                           </td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Ticket Catogory</td>
                           <td style=" padding-top: 8px;">${ticket_category}</td>
                       </tr>
       
                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Nature of Complaint	</td>
                           <td style=" padding-top: 8px;">${ticket_type}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Name</td>
                           <td style=" padding-top: 8px;">${customer_name}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Customer Phone No.</td>
                           <td style=" padding-top: 8px;">${customer_phone}</td>
                       </tr>

                       <tr>
                           <td style=" padding: 8px 0px 0px 10px;">Sales Person Phone No.</td>
                           <td style=" padding-top: 8px;">880020602</td>
                       </tr>


                   </table>
               </div>
       </div>





       <div 
       style="width: 100%;
       margin-top: 15px;
       ">
           <div 
           style="
           width: 80%;
           border: 1px solid lightgray;
           box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.229),-5px -5px 10px rgba(0, 0, 0, 0.229);
           border-radius: 10px 10px 10px 10px;    
           ">

           <div 
           style="                 
           text-align: center;
           color: white;
           background: #0473cf;
           padding: 8px 0px 8px 0px;
           border-radius: 10px 10px 0px 0px;
           font-size: 15px;
           font-weight: 500;
           ">
               Product Details
           </div>
               <table style="
                   width: 100%;
                   padding-bottom: 10px;
                   font-size: 13px;      
                   color: black;             
                   ">
           
                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Product Catogory</td>
                       <td style=" padding-top: 8px;">${product_category}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Batch No</td>
                       <td style=" padding-top: 8px;">
                           ${batch_no}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Sku/Product Name</td>
                       <td style=" padding-top: 8px;">
                            ${product_name}
                           <br>
                            ${sku}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Location</td>
                       <td style=" padding-top: 8px;">
                       ${customer_location}
                       </td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Purchase</td>
                       <td style=" padding-top: 8px;">${quantity_purchage}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Quantity Rejected</td>
                       <td style=" padding-top: 8px;">${quantity_rejected}</td>
                   </tr>

                   <tr>
                       <td style=" padding: 8px 0px 0px 10px;">Manufacturing Date</td>
                       <td style=" padding-top: 8px;">${manufacturing_date}</td>
                   </tr>


               </table>
           </div>
       </div>

       <div style="font-size: 15px; margin-top: 30px; font-weight: bold;">
           Thanks & Regards
       </div>

       <div style="font-size: 15px; font-weight: 500; padding: 10px 0px 5px 0px;">
           JACPL Quality Team
       </div>
       <div style="font-style: italic; font-size: 10px;">
           *This is a system generated email, do not reply to this email id.
       </div>

                        
                        </body>
                        </html>
                        `,};
                        transporter.sendMail(additionalMailOption, (additionalErro, additionalInf) => {
                            if (additionalErro) {
                                console.error("Additional Email Error:", additionalErro);

                            } else {
                                console.log("Additional Email sent:", additionalInf.response);


                            }
                    })

                    }
                    
                }

            });

            res.status(200).send("Existing email sent successfully");
       
        }
    });
    });
    });
    });
    });

    });
});





router.post('/login', async (req, res) => {
    try {

        const currentDateAndTime = getCurrentDateAndTime();

        let empId = req.body.Employeid;
        let empPassword = req.body.password;
       
        const pool = await dbConnection();

        let data = qs.stringify({
            'loginInfoSales': JSON.stringify({ "empId": empId, "empPassword": empPassword, "empVal": "1" })
        });
        let config = {
            method: 'post',
            url: process.env.JACPL_ATTENDED_API,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'JSESSIONID=432B7D6836A988969AFFA9B470F6DC12'
            },
            data: data
        };

        const response = await axios.request(config);
        console.log(response,'response')
       
        if (response.data.result == '1') {
            req.session.employeeId = empId;
            req.session.emp_Name = response.data.empName;
            req.session.designation = response.data.designation
            req.session.teEmailId = response.data.teEmailId
            req.session.msisdn = response.data.msisdn


            
            const designation = response.data.designation

           
            const query = `SELECT action_type FROM cms_master WHERE action_value = ? AND action_status = 1`;

            pool.query(query, [designation], (err, result) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    req.session.role = 'DefaultRole';
                } else {
                    if (result.length > 0) {
                        req.session.role = result[0].action_type;
                       


                        const branch = response.data.branch
                        const zone = response.data.zone
                        let supeviosrName = response.data.supeviosrName
                        let supeviosrId = response.data.supeviosrId
                        let zmRSMId = response.data.zmRSMId
                        let zmRSMName = response.data.zmRSMName
                        let teEmailId = response.data.teEmailId
                        let bmEmailId = response.data.bmEmailId
                        let zmEmailId = response.data.zmEmailId
                        let hqname = response.data.hqName
                        let hqcode = response.data.hqCode
                        let msisdn = response.data.msisdn
                        let category = response.data.category
                    

                        let roleQuery = `SELECT * FROM cms_user_login WHERE EMP_CODE = ?`;
                        pool.query(roleQuery, [empId], function (error, results, fields) {

                           
                            if (error) {
                                console.error(error);
                                return res.status(500).send('Error executing the query');
                            }

                            if (results.length > 0) {
                                const updateQuery = `UPDATE cms_user_login SET ROLE=?, EMP_NAME=?,PASSWORD=?,Emp_Email_ID=?,REP_MANAGER_ID=?,REP_MANAGER_NAME=?,REP_MANAGER_Email_ID=?,RSM_ZSM_ID=?,RSM_ZSM_Name=?,RSM_ZSM_Email_ID=?,BRANCH=?,ZONE=?,L_LOGIN_DATE=?,EMP_DESI=?,EMP_HQ_NAME=?,EMP_HQ_CODE=?,EMP_NUMBER=?,EMP_VERTICAL=?
                                 WHERE EMP_CODE=?`;
                                const updateValues = [req.session.role, req.session.emp_Name, empPassword, teEmailId, supeviosrId, supeviosrName, bmEmailId, zmRSMId, zmRSMName, zmEmailId, branch, zone, currentDateAndTime, designation,hqname,hqcode,msisdn,category,empId];
                                pool.query(updateQuery, updateValues, function (error, results, fields) {
                                    if (error) {
                                        console.error(error);
                                        return res.status(500).send('Error updating record');
                                    } else {
                                        // console.log(results)
                                    }
                                });
                            } else {
                                const insertQuery = `INSERT INTO cms_user_login (EMP_CODE, ROLE, EMP_NAME, PASSWORD ,F_LOGIN_DATE ,EMP_DESI,BRANCH,ZONE,Emp_Email_ID,REP_MANAGER_ID,REP_MANAGER_NAME,REP_MANAGER_Email_ID,RSM_ZSM_ID,RSM_ZSM_Name,RSM_ZSM_Email_ID,EMP_HQ_NAME,EMP_HQ_CODE,EMP_NUMBER,EMP_VERTICAL) VALUES (?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                                const insertValues = [empId, req.session.role, req.session.emp_Name, empPassword, currentDateAndTime, designation, branch, zone, teEmailId, supeviosrId, supeviosrName, bmEmailId, zmRSMId, zmRSMName, zmEmailId,hqname,hqcode,msisdn,category];
                                pool.query(insertQuery, insertValues, function (error, results, fields) {
                                    if (error) {
                                        console.error(error);
                                        return res.status(500).send('Error inserting record');
                                    } else {
                                        console.log(results)
                                    }
                                });
                            }
                        });


                        if (req.session.role === 'MANAGER') {
                            res.json({ redirect: '/manager_dashboard' });
                        }
                        
                        else if (req.session.role === 'QUILITY TEAM') {
                            res.json({ redirect: '/quality_team_dashboard' });
                        }
                        

                        
                        else if (req.session.role === 'EMPLOYEE') {
                            res.json({ redirect: '/employee_dashboard' });
                        }
                        else if (req.session.role === 'BUSINESS HEAD') {
                            res.json({ redirect: '/business_head_dashboard' });
                        }
                        

                        else {
                            res.json({ redirect: '/dashboard' });
                        }

                    } else {
                        req.session.role = 'DefaultRole';
                    }
                }
            });


        } else {

            let roleQuery = `SELECT ROLE, EMP_NAME, PASSWORD,EMP_DESI,EMP_EMAIL_ID,EMP_NUMBER FROM cms_user_login WHERE EMP_CODE = ?`;
            pool.query(roleQuery, [empId], function (error, results, fields) {
                if (results.length > 0) {
                    const role = results[0].ROLE || 'DefaultRole';
                    req.session.emp_Name = results[0].EMP_NAME;
                    req.session.password = results[0].PASSWORD;
                    req.session.employeeId = empId;
                    req.session.role = role;
                    req.session.designation = results[0].EMP_DESI
                    req.session.teEmailId =results[0].EMP_EMAIL_ID
                    req.session.msisdn = results[0].EMP_NUMBER


                    console.log(req.session.designation)



                    if (empPassword == req.session.password) {
                        req.session.role = role;

                        let redirectUrl;
                        switch (role) {
                            case 'MANAGER':
                                redirectUrl = '/manager_dashboard';
                                break;
                            case 'QUILITY TEAM':
                                redirectUrl = '/quality_team_dashboard';
                                break;
                            case 'EMPLOYEE':
                                redirectUrl = '/employee_dashboard';
                                break;

                            case 'BUSINESS HEAD':
                                redirectUrl = '/business_head_dashboard';
                                break;
                            
                            default:
                                redirectUrl = '/dashboard';
                                break;
                        }
                        res.json({ redirect: redirectUrl });


                        let selectQuery = `SELECT F_LOGIN_DATE FROM cms_user_login WHERE EMP_CODE = ?`;

                        pool.query(selectQuery, [empId], function (err, results) {
                            if (err) {
                                console.log(err);
                                logger.error(err);
                            }

                            if (results.length > 0 && results[0].F_LOGIN_DATE !== null) {
                                let updateQuery = `UPDATE cms_user_login SET L_LOGIN_DATE = ? WHERE EMP_CODE = ?`;
                                pool.query(updateQuery, [currentDateAndTime, empId], (err, result) => {
                                    if (err) throw err;
                                    logger.error(err);
                                });
                            } else {
                                let insertQuery = `UPDATE cms_user_login SET F_LOGIN_DATE= ? WHERE EMP_CODE = ?`;
                                pool.query(insertQuery, [currentDateAndTime, empId], (err, result) => {
                                    if (err) throw err;
                                    logger.error(err);
                                });
                            }
                        });

                    } else {
                        req.session.role = 'DefaultRole';
                        res.json({ passwordError: 'Invalid Password' });
                    }
                } else {
                    req.session.role = 'DefaultRole';
                    res.json({ usernameError: 'Invalid Employee ID' });
                }

            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        logger.error(error + ' in login');
    }
});

router.get('/complaint_mail5', function (req, res) {
    try {

        res.render('complaint_mail5')
        logger.info('Accessed GET in forgetpassword ')

    } catch (error) {
        logger.error('Error GET in forgetpassword ')

    }
})

router.get("/demo", authenticate,async (req, res) => {
    try {
      let pool = await dbConnection();
   
  
      let query1 = `SELECT * FROM product_issues_master`;
  
      pool.query(query1, (err, results) => {
        if (err) throw err;
        console.log(results,'resultsqwq1111')
        res.render('demo', { data: results})
    })
    } catch (error) {
    logger.error('error in get complaint_form:: ', error)
    }
  });


  
router.get("/demo2", authenticate,async (req, res) => {
    try {
      let pool = await dbConnection();
   
  
      let query1 = `SELECT * FROM reopen_issues_master`;
  
      pool.query(query1, (err, results) => {
        if (err) throw err;
        res.render('demo2', { data: results})
    })
    } catch (error) {
    logger.error('error in get complaint_form:: ', error)
    }
  });


  function current_Date(){
    const currentDate = moment().format('DD-MMMM-YYYY');
    return { random_num: currentDate };
}

router.get('/open-ticket-report', async (req, res) => {
    try {
        const result = await open_ticket_report();
        res.json(result); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define route for reopen ticket report
router.get('/reopen-ticket-report', async (req, res) => {
    try {
        const result = await reopen_ticket_report();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function open_ticket_report() {
   
    let pool = await dbConnection();
    let query1 = `SELECT ticket_id,CASE is_active
            WHEN 1 THEN 'Open'
            WHEN 2 THEN 'In-process'
            WHEN 3 THEN 'Resolved'
            WHEN 4 THEN 'Closed'            
            ELSE 'Unknown'
            END AS status_description, 
            DATE_FORMAT(ticket_date,'%d-%m-%Y') AS formatted_date,            
            ticket_category, 
            ticket_type, 
            ticket_location,
            raised_by, 
            description, 
            product_category, 
            product_name, 
            sku, 
            batch_no, 
            manufacturing_date, 
            customer_name, 
            customer_type, 
            customer_location, 
            quantity_purchage, 
            quantity_rejected, 
            visit_type, 
            person_meet, 
            customer_phone, 
            inprocess_by, 
            DATE_FORMAT(inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
            closed_by, 
            DATE_FORMAT(closed_at, '%d-%m-%Y') AS formatted_closed_at, 
            resolved_by, 
            DATE_FORMAT(resolved_at, '%d-%m-%Y') AS formatted_resolved_at,
            DATE_FORMAT(investigated_at, '%d-%m-%y') AS formatted_investigated_at,
            investigation_details, 
            closed_comment,
            action_taken 
        FROM product_issues_master 
        WHERE is_active IN  ('1','2')`;

    pool.query(query1, async function(err, result) {
        if (err) throw err;

        let csvData = 'Ticket No.,Status,Ticket Date,Complaint Category,Ticket Type,Ticket Location,Ticket Raised By,Remarks,Product Category,Product Name,SKU Name,Batch No,Manufacturing Date,Customer Name,Customer Type,Customer Location,Quantity Purchase,Quantity Rejected,Visit Type,Person Meet,Customer Phone,In-Process By,In-Process At,Close By,Close At,Resolve By,Resolve At,Investigation date,Investigation details,Close Comment,Action Taken\n';
      
        result.forEach(row => {
            csvData += Object.values(row).join(',') + '\n';
        });

        let current_date1 = current_Date().random_num;
        
        let excel_file_name = `Open Tickets Report (${current_date1})`;

        let auto = `SELECT * FROM cms_auto_email WHERE action ='open';`
        pool.query(auto, (err, results) => {
        if (err) throw err;
       
            
            let email_to = results[0].email_to;
            let email_cc = results[0].email_cc;
           
            
            let transporter = nodemailer.createTransport({
                host: 'jublcorp.mail.protection.outlook.com',
                port: 25,
                secure: false,
                auth: {
                    user: 'g-smart.helpdesk@jubl.com',
                    pass: 'jubl@123'
                },
                debug: true
            });

        let mailOptions = {
            from: 'g-smart.helpdesk@jubl.com',
            to: email_to,
            cc: email_cc,
            subject: 'Daily Open Tickets Report',
            attachments: [{
                filename: `${excel_file_name}.csv`,
                content: csvData 
            }],
            html:`
            <div style="font-size: 13px;" >Dear Sir,</div>
            
            <div style="padding-top: 20px; font-size: 13px;">Please find the attached Open Complaints list.</div>

            <div style="padding-top: 20px; font-weight: bold; font-size: 15px;">
                Thanks & Regards
            </div>
            <div style="font-weight: bold; font-size: 15px;">
                JACPL
            </div>
            `
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
})
}


// cron.schedule('0 0 * * *', () => {
//     open_ticket_report();
// }, {
//     timezone: 'Asia/Kolkata' // Adjust timezone as needed
// });

// cron.schedule('0 0 * * *', () => {
//     reopen_ticket_report();
   
// }, {
//     timezone: 'Asia/Kolkata' 
// });


async function reopen_ticket_report() {
  
    let pool = await dbConnection();
    let query1 = `
        SELECT 
        reopen_issues_master.pre_ticket_id,
            reopen_issues_master.reopen_ticket_id,
            CASE reopen_issues_master.is_active
            WHEN 5 THEN 'Reopen'
            WHEN 2 THEN 'In-process'
            WHEN 3 THEN 'Resolved'
            WHEN 4 THEN 'Closed'            
            ELSE 'Unknown'
            END AS status_description, 
            DATE_FORMAT(reopen_issues_master.ticket_date,'%d-%m-%Y') AS reopen_ticket_date,
            product_issues_master.ticket_category, 
            product_issues_master.ticket_type, 
            product_issues_master.raised_by AS pre_ticket_raised_by,
            reopen_issues_master.raised_by AS reopen_ticket_raised_by,
            DATE_FORMAT(product_issues_master.ticket_date,'%d-%m-%Y') AS pre_ticket_date,
            product_issues_master.description, 
            product_issues_master.product_category,
            product_issues_master.product_name,
            product_issues_master.sku,
            product_issues_master.batch_no,
            product_issues_master.manufacturing_date,
            product_issues_master.customer_name,
            product_issues_master.customer_type, 
            product_issues_master.customer_location, 
            product_issues_master.quantity_purchage, 
            product_issues_master.quantity_rejected, 
            product_issues_master.visit_type, 
            product_issues_master.person_meet, 
            product_issues_master.customer_phone, 
            reopen_issues_master.inprocess_by,
            DATE_FORMAT(reopen_issues_master.inprocess_at, '%d-%m-%Y') AS formatted_inprocess_at, 
            reopen_issues_master.resolved_by, 
            DATE_FORMAT(reopen_issues_master.resolved_at, '%d-%m-%Y') AS formatted_resolved_at, 
            DATE_FORMAT(reopen_issues_master.investigated_at, '%d-%m-%Y' ) AS formated_investigated_at, 
            reopen_issues_master.investigation_details, 
            reopen_issues_master.action_taken, 
            reopen_issues_master.closed_by, 
            DATE_FORMAT(reopen_issues_master.closed_at, '%d-%m-%Y') AS formatted_closed_at, 
            reopen_issues_master.closed_comment 
        FROM 
            reopen_issues_master, product_issues_master 
        WHERE 
            product_issues_master.ticket_id = reopen_issues_master.pre_ticket_id
           AND reopen_issues_master.is_active IN ('2','5')`;

    pool.query(query1, async function(err, result) {
        if (err) throw err;

        
        let csvData = 'Reopen Ticket No.,Previous Ticket No.,status_description,Reopen Date,Ticket Catogery,Ticket Type,Ticket Location,Pre Ticket Raised By,Reopen Ticket Raised By,Pre Ticket Datepre,Description,Product Category,Product Name,Sku,Batch No,Manufacturing Date,Customer Name,Customer Type,Customer Location,Quantity Purchage,Quantity Rejected,Visit Type,Person Meet,Customer Phone,Inprocess By,Formatted Inprocess At,Closed By,Formatted Closed At,Resolved By,Formatted Resolved At,Formated Investigated At,Investigation Details,Closed Comment,Action Taken\n';

        
        result.forEach(row => {
            csvData += Object.values(row).join(',') + '\n';
        });

        let current_date1 = current_Date().random_num;
        
        let excel_file_name = `Reopen Tickets Report (${current_date1})`;
        
        let transporter = nodemailer.createTransport({
            host: 'jublcorp.mail.protection.outlook.com',
            port: 25,
            secure: false,
            auth: {
                user: 'g-smart.helpdesk@jubl.com',
                pass: 'jubl@123'
            },
            debug: true
        });
        let auto = `SELECT * FROM cms_auto_email WHERE action ='reopen';`
        pool.query(auto, (err, results) => {
        if (err) throw err;
       
            
            let email_to = results[0].email_to;
            let email_cc = results[0].email_cc;
           

        let mailOptions = {
            from: 'g-smart.helpdesk@jubl.com',
            to: email_to,
            cc: email_cc,
            subject: 'Daily Reopen Tickets Report',
            attachments: [{
                filename: `${excel_file_name}.csv`,
                content: csvData 
            }],
            html:`
            <div style="font-size: 13px;" >
                Dear Sir,
            </div>
            
            <div style="padding-top: 20px; font-size: 13px;">
                Please find the attached Reopen Complaints list.
            </div>

            <div style="padding-top: 20px; font-weight: bold; font-size: 15px;">
                Thanks & Regards
            </div>
            <div style="font-weight: bold; font-size: 15px;">
                JACPL
            </div>
            `
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
})
}


module.exports = router;
