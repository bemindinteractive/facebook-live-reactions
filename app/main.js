const jetpack = require('fs-jetpack')
const fs = require('fs')
const path = require('path')
const phantom = require('phantom')
const ejs = require('ejs')

const getGraphData = require('./graph.js').getGraphData
const templateString = jetpack.read(path.join(__dirname, 'assets', 'index.ejs'))
let reactionsCache = {}

async function main() {
  try {
    const reactions = await getGraphData()

    if(JSON.stringify(reactions) !== JSON.stringify(reactionsCache)) {
      const instance = await phantom.create()
      const page = await instance.createPage()
      const template = await ejs.render(templateString, {reactions: reactions})

      page.property('content', template)

      const pageRendered = await page.render('output.tmp.jpeg')
      if(pageRendered) {
        console.log('Page rendered: ', reactions)
        await jetpack.moveAsync('output.tmp.jpeg', 'output.jpeg', { overwrite: true })
        reactionsCache = reactions
        console.log('Page sent to streamer.')
      } else {
        console.log('Error: page failed to render.')
      }
    } else {
      console.log('Same reactions: skipping render!')
    }
  } catch(e) {
    console.log(e)
  }
}

setInterval(main, 5000)
