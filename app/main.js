const fs = require('fs')
const path = require('path')
const phantom = require('phantom')
const ejs = require('ejs')

const getGraphData = require('./graph.js').getGraphData

async function main() {
  try {
    const reactions = await getGraphData()
    const instance = await phantom.create()
    const page = await instance.createPage()
    const templateString = fs.readFileSync(path.join(__dirname, 'assets', 'index.ejs'), 'utf-8')

    const template = ejs.render(templateString, {reactions: reactions})

    page.property('content', template)
    page.render('output.png', { format: 'png' })
  } catch(e) { console.log(e) }
}

setInterval(main, 5000)
