const fs = require('fs');
const { Rettiwt } = require('rettiwt-api')
const API_KEY = ''

const client = new Rettiwt({ apiKey: API_KEY })

const hashtag = 'kmssmitochondria'
const data = fs.readFileSync(`modified-${hashtag}.json`, 'utf8');
const tweets = JSON.parse(data);

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to retrieve quoted tweet and add quotedObject property
async function addQuotedObject(tweets) {
  let quotedCount = 0;
  for (let [index, tweet] of tweets.entries()) {
    // Go through 40-50 entries every 10 minutes
    if (quotedCount >= 40) {
      console.log(`INDEX ${index}, QUOTED COUNT ${quotedCount}: Exiting now...`)
      break;
    }

    if (tweet.quoted) {
      try {
        console.log(`INDEX ${index}, QUOTED COUNT ${quotedCount}: About to retrieve ${tweet.id}'s quoted tweet with quoted ID ${tweet.quoted}`)
        const quotedTweet = await client.tweet.details(tweet.quoted)
        tweet.quotedObject = quotedTweet;
        console.log(`INDEX ${index}, QUOTED COUNT ${quotedCount}: Retrieved ${tweet.id}'s quoted tweet`);
        quotedCount++;
        await delay(10000);
      } catch (error) {
        console.error(`INDEX ${index}, QUOTED COUNT ${quotedCount}: Failed to retrieve ${tweet.id}'s quoted tweet:`, error);
      }
    } else {
      console.log(`INDEX ${index}, QUOTED COUNT ${quotedCount}: No quoted tweet for ${tweet.id}`);
    }
  }
  return tweets;
}

// Call the function and log the result
addQuotedObject(tweets).then(updatedTweets => {
  fs.writeFile(`./modified-${hashtag}.json`, JSON.stringify(updatedTweets, null, 2), (error) => {
    if (error) {
      console.log('An error has occurred ', error);
      return;
    }
    console.log(`Data written successfully to modified-${hashtag}.json`);
  });
}).catch(error => {
  console.error('Error:', error);
});
