const express=require('express')
const app=express()
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')
const mainRoute=require('./routes/routes')
app.use('/static', express.static("public"));
app.use('/static/images', express.static('/var/log/cms/images'));
app.use('/static/videos', express.static('/var/log/cms/videos'));
const dbConnection=require('./db/connection')

dbConnection()



const logger=require('./util/logger')
app.use(bodyParser.json());
const dotenv=require('dotenv')
dotenv.config({ path: './config.env' });

app.use('/',mainRoute)
const port = process.env.PORT;
try {
    app.listen(port, () => {
        console.log(`CMS is running on port ${port}`);
    });
} catch (error) {
    logger.error('Error in CMS running: ' + error);
}