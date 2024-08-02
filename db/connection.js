const mysql = require('mysql');
const util = require('util');
const logger = require('../util/logger');

const createConnectionPool = async () => {
    const pool = mysql.createPool({
        // user: 'cmshrm',
        // password: 'k>7ETi8#BI',
      
        // host: '3.6.247.182',
        // port: '3306',
        // database: 'cms',
        // timezone: 'GMT',

        user: 'testapr',
password: 'THYfI9xH%h[itdq',
host: '13.234.68.241',
port: '3306',
database: 'cmstest', 
    });

    const getConnectionAsync = util.promisify(pool.getConnection).bind(pool);

    try {
        const connection = await getConnectionAsync();
        console.log('Connected to CMS database successfully...');
        connection.release();
        return pool;
    } catch (err) {
        console.error('Error connecting to CMS database:', err.message);
        logger.error('Error connecting to CMS database:', err.message)
        throw err; 
    }
};

module.exports = createConnectionPool;




// user: 'root',
// password: 'f3a54d600135878b36814c7462a87b16',
// host: 'localhost',
// port: '3306',
// database: 'activityportal',






