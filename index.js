
const ftp = require("basic-ftp")
require('dotenv').config();
async function example() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        const {
            FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_PORT
        } = process.env
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASSWORD,
            port: FTP_PORT,
            secure: true,
            secureOptions: {
                rejectUnauthorized: false
            }
        });
        const data = await client.list();
        console.log({ data });
    }
    catch (err) {
        console.log({ err });
    }
    client.close()
}

example();