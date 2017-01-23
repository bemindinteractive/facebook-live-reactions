const jetpack = require('fs-jetpack')
const fs = require('fs')
const path = require('path')
const phantom = require('phantom')
const ejs = require('ejs')

const getGraphData = require('./graph.js').getGraphData
let reactionsCache = {}

async function main() {
  try {
    const reactions = await getGraphData()

    if(JSON.stringify(reactions) !== JSON.stringify(reactionsCache)) {
      reactionsCache = reactions

      const instance = await phantom.create()
      const page = await instance.createPage()
      const templateString = await jetpack.readAsync(path.join(__dirname, 'assets', 'index.ejs'))
      const template = ejs.render(templateString, {reactions: reactions})

      page.property('content', template)
      page.render('output.tmp.jpeg', { format: 'jpeg' })

      if(jetpack.exists('output.tmp.jpeg')) {
        jetpack.move('output.tmp.jpeg', 'output.jpeg', { overwrite: true })
      }

      console.log('Page rendered: ', reactions)
    } else {
      console.log('Same reactions: skipping render!')
    }
  } catch(e) {
    console.log(e)
  }
}

setInterval(main, 5000)
