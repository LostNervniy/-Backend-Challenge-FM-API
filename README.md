# -Backend-Challenge-FM-API
Incedo Services GmbH - Backend Challenge FM API

-Node Version: `16.17.1`<br>
-npm Version: `8.19.2`


# Structure
* ArtistSearch
  *  config/
      * default.json
  *  src/
     * ArtistSearchRest.js
      * randomArtistNames.json
*  package-lock.json
*  package.json

# First Steps
* open a terminal and cd into the root folder
* install node packages `npm install`
* got into the config file `default.json`
  *  edit `host` and `port` from `server` as needed
  *  add your own fm api key in `FMApi.apikey`

# Start the api
* to start the api run follow command in root directory of project: `node src/ArtistSearchRest.js`

# API Calls
* /getArtistDataAsCSV<br>`{host}:{port}/getArtistDataAsCSV?artistName={artistName}&fileName={fileName}`<br>returns a downloadable `.csv` file with informations about the artits in the following format: `name,mbid,url,image_small,image`.
  * beware that the parameter `fileName` is without the suffix `.csv`
