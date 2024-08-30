const rettiwt = require('rettiwt-api');
const fs = require('fs');
const path = require('path');

// Function to download an image
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFile(filepath, buffer, () => console.log(`Downloaded and saved: ${filepath}`));
    }
  } catch (e) {
    throw Error(e)
  }
}

// Function to retrieve tweets and save media images grouped by tweet ID
async function retrieveAndSaveImages(hashtag) {
  try {
    const data = fs.readFileSync(`modified-${hashtag}.json`, 'utf8');
    const tweets = JSON.parse(data);
    const mediaBaseFolder = path.join(__dirname, '..', 'media', hashtag);
    console.log({ mediaBaseFolder })

    // Create base media folder if it doesn't exist
    if (!fs.existsSync(mediaBaseFolder)) {
      fs.mkdirSync(mediaBaseFolder);
    }

    for (const parentTweet of tweets) {
      if (parentTweet?.quotedObject?.media && parentTweet.quotedObject.media.length > 0) {
        const tweetFolder = path.join(mediaBaseFolder, parentTweet.quotedObject.id);

        if (fs.existsSync(tweetFolder) && fs.readdirSync(tweetFolder).length > 0) {
          console.log(`Skipping tweet ${parentTweet.quotedObject.id} as folder already exists with files`);
          continue;
        }

        // Create folder for each tweet ID if it doesn't exist
        if (!fs.existsSync(tweetFolder)) {
          fs.mkdirSync(tweetFolder);
        }

        let photoCount = 0;

        for (const media of parentTweet.quotedObject.media) {
          photoCount++
          if (media.type === 'photo') {
            const imageUrl = media.url;
            const filename = path.basename(imageUrl);
            const filepath = path.join(tweetFolder, filename);
            console.log({ imageUrl, filename, filepath })
            await downloadImage(imageUrl, filepath);
          }
        }

        const metadata = {
          photo: {
            size: photoCount
          }
        };
        const metadataFilePath = path.join(tweetFolder, 'metadata.json');
        fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
      }
    }
  } catch (error) {
    console.error('Error saving images:', error);
  }
}

// Retrieve tweets with the hashtag #testimonykmss and save media images grouped by tweet ID
retrieveAndSaveImages('kmssmitochondria');
