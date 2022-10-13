
import fetch from 'node-fetch';
import config from 'config';
import express from 'express';
import cors from 'cors';
import {readFile} from 'fs/promises';

const app = express();

app.use(cors());

const host = config.get('server.host');
const port = config.get('server.port');

const apiKey = config.get('FMApi.apikey');
const apiURL = "http://ws.audioscrobbler.com/2.0";


const randomArtistNameList = JSON.parse(
    await readFile(
        new URL('./randomArtistNames.json', import.meta.url)
    )
)

/**
 * 
 * @param {string} artistName   Name of an artist to search for. If the result is an emtpy array, we chose a random existing 
 *                              artist name from ./src/randomArtistNames.json
 * @param {string} fileName     Filename without suffix to download. Suffix '.csv' will be added
 * @param {response} res        Response from API
 */
async function getArtistDataAsCSV(artistName, fileName, res){
    var url = `${apiURL}/?method=artist.search&artist=${artistName}&api_key=${apiKey}&format=json`;

    await fetch(url).then(response => {
        return response.json()
    }).then(data => {
        const artistArray = data.results.artistmatches.artist;
        if (artistArray.length === 0){
            const randomName = randomArtistNameList[Math.floor(Math.random()*randomArtistNameList.length)].artist;
            getArtistDataAsCSV(randomName, fileName, res).then(() => {
                console.log("Input name didnt get results. Selected a random Artist Name: " + randomName)
            })
        }else{
            //format: name, mbid, url, image_small, image(_large)
            const csv = artistArray.map(artist => {return `${artist.name},${artist.mbid},${artist.url},${Object.values(artist.image.filter(img => img.size==="small" )[0])[0]},${Object.values(artist.image.filter(img => img.size==="large" )[0])[0]}\r\n`}).join("")
            res.setHeader('Content-disposition', `attachment; filename=${fileName}.csv`);
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csv)
        }
    }).catch(err => {
        console.log(err);
        res.status(500)
    }).finally(() => {

    });
}

/**
 * URL: localhost:5000/getArtistDataAsCSV?artistName={artistName}&fileName={fileName}
 * What it does: Downloads a CSV file with artist informations
 */
app.get('/getArtistDataAsCSV', async function(req, res){
    const artistName = req.query.artistName;
    const fileName = req.query.fileName;
    
    await getArtistDataAsCSV(artistName, fileName, res).then(() =>{
        console.log("Get CSV Data for Artist: " + artistName)
    });
    
})

app.listen(port, host, (error) => {
    if (error){
        console.error("FM Rest API could not start.\nError occured: ", error);
        process.exit(1);
    }
    console.log(`FM Rest API is running on ${host}:${port}`);
})