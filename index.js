
const ftp = require("basic-ftp")
require('dotenv').config();

let client;
const bytesToMb = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

async function example() {
    client = new ftp.Client()
    // client.ftp.verbose = true
    try {
        const {
            FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_PORT
        } = process.env
        client.trackProgress(info => {
            console.log("File:", info.name)
            console.log("Type:", info.type)
            console.log("Transferred:", bytesToMb(info.bytes))
            console.log("Transferred Overall:", bytesToMb(info.bytesOverall))
        })
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
        const files = await client.list('/S3/assests/');
        // console.log({ files: data.map(f => f?.name) });
        // const files = data.map(f => f?.name);
        for (const file of files) {
            await client.downloadToDir(`./files/${file?.name}`, `/S3/assests/${file?.name}`);
        }
        // const path = await client.cd('/S3/new-build');
        // console.log({ path });
        // await Promise.all(data.map(f => client.downloadToDir(`./files/${f?.name}`, `/S3/assests/${f?.name}`)));
        // await client.downloadToDir('./files/','/S3/new-build/g0086');
    }
    catch (err) {
        console.log({ err });
    }
    client.close()
}

example();

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

function gracefulShutdown() {
    console.log('Shutting down gracefully...');
    client.close();
    process.exit(0);
}
