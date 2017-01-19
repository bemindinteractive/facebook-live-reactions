const fetch = require('isomorphic-fetch')

if(!process.env.APP_ID || !process.env.APP_SECRET || !process.env.SHORT_LIVED_TOKEN || !process.env.POST_ID) {
  throw new Error('Please fill all the environment variables in the .env file.');
}

exports.getGraphData = async () => {
  const APP_SECRET = process.env.APP_SECRET
  const APP_ID = process.env.APP_ID
  const SHORT_LIVED_TOKEN = process.env.SHORT_LIVED_TOKEN

  const POST_ID = process.env.POST_ID
  const API_ROOT = 'https://graph.facebook.com/v2.8'

  try {
    const longLivedTokenRequest = await fetch(`${API_ROOT}/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&grant_type=fb_exchange_token&fb_exchange_token=${SHORT_LIVED_TOKEN}`)
    const longLivedToken = await longLivedTokenRequest.json()

    const reactionsRequest = await fetch(`${API_ROOT}/${POST_ID}/reactions?summary=total_count&access_token=${longLivedToken.access_token}`)
    const reactions = await reactionsRequest.json()

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
