import express, {Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import fs from 'fs';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    let { image_url } = req.query;

    //Confirming that image url is part of request
    if (!image_url ) {
      return res.status(400).send(`image url is required`);
    }

    try {
      //Filtering image in URL
      let filteredImage: string = await filterImageFromURL(image_url);
      if (filteredImage) {

      // After filtering image, sending back in response
      let filteredImageResponse = fs.createReadStream(filteredImage);
      filteredImageResponse.pipe(res);

      //deletes any files on the server after sending response
        filteredImageResponse.on('Server side', () => {
          deleteLocalFiles([filteredImage])
        });
      } else {
        res.status(422).send(`Error occurred during image filtering`);
      }
    }
    catch (error) {
      console.log(`Could not process image ${image_url}`);
      res.status(422).send(`Error`);
    }
  } );


  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req:Request, res:Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();


