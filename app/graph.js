const fetch = require('isomorphic-fetch')

if(!process.env.APP_ID || !process.env.APP_SECRET || !process.env.POST_ID) {
  throw new Error('Please fill all the environment variables in the .env file.');
}

exports.getGraphData = async () => {
  const APP_SECRET = process.env.APP_SECRET
  const APP_ID = process.env.APP_ID

  const POST_ID = process.env.POST_ID
  const API_ROOT = 'https://graph.facebook.com/v2.8'

  try {
    const accessTokenRequest = await fetch(`${API_ROOT}/oauth/access_token?grant_type=client_credentials&client_id=${APP_ID}&client_secret=${APP_SECRET}`)
    const accessToken = await accessTokenRequest.json()

    // This generates a long lived access token
    // const longLivedTokenRequest = await fetch(`${API_ROOT}/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&grant_type=fb_exchange_token&fb_exchange_token=${SHORT_LIVED_TOKEN}`)
    // const longLivedToken = await longLivedTokenRequest.json()
    //
    // console.log(longLivedToken)

    const reactionsRequest = await fetch(`${API_ROOT}/${POST_ID}/reactions?summary=total_count&access_token=${accessToken.access_token}`)
    const reactions = await reactionsRequest.json()

    if(reactions.error) {
      if(reactions.error.message) {
        console.log(reactions.error.message)
      }
    }

    const reactionGroups = {}
    reactions.data.forEach(reaction => {
      if(!reactionGroups[reaction.type]) {
        reactionGroups[reaction.type] = {count: 0}
      }
      reactionGroups[reaction.type].count += 1
    })

    return reactionGroups
  } catch(e) {
    console.log(e)
  }

}
