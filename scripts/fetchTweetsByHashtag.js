const fs = require('fs')
const { Rettiwt } = require('rettiwt-api')
const API_KEY = ''

const client = new Rettiwt({ apiKey: API_KEY })
const hashtag = 'kmssmitochondria'

async function fetchTweets(cursor = null) {
  return new Promise((resolve) => setTimeout(resolve, 6000)).then(async () => {
    return client.tweet.search({ fromUsers: ['marinagamba1909'], hashtags: [hashtag] }, 20, cursor)
      .then((result) => {
        console.log({ message: 'Success!', landmark: result?.list?.[0]?.createdAt })
        return {
          cursor: result.next.value,
          data: result.list,
          hasNext: result.list.length !== 0,
        }
      })
      .catch((reason) => {
        console.log({ message: 'Error!', reason});
      })
  });
}

(async () => {
  let defaultCursor = ''
  let hasNextPage = true
  let defaultData = []

  while (hasNextPage) {
    const { data, hasNext, cursor } = await fetchTweets(defaultCursor)
    defaultData.push(...data)
    console.log({ hasNext, hasNextPage, length: data.length });
    if (hasNext) {
      defaultCursor = cursor
      continue
    }

    fs.writeFile(`./${hashtag}.json`, JSON.stringify(defaultData, null, 2), (error) => {
      if (error) {
        console.log('An error has occurred ', error);
        return;
      }
      console.log(`Data written successfully to ${hashtag}.json`);
    });
    hasNextPage = false
  }
})()
