const fs = require('fs-jetpack')
const path = require('path')
const phantom = require('phantom')
const ejs = require('ejs')

const getGraphData = require('./graph.js').getGraphData

async function main() {
  try {
    const reactions = await getGraphData()
    const instance = await phantom.create()
    const page = await instance.createPage()
    const templateString = await fs.readAsync(path.join(__dirname, 'assets', 'index.ejs'))

    const template = ejs.render(templateString, {reactions: reactions})

    page.property('content', template)
    page.render('output.png', { format: 'png' })
    
    console.log('Page rendered:', reactions)
  } catch(e) { console.log(e) }
}

setInterval(main, 5000)
