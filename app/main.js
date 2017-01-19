const fs = require('fs')
const path = require('path')
const phantom = require('phantom')
const ejs = require('ejs')
const sleep = require('sleep').sleep

const getGraphData = require('./graph.js').getGraphData

async function main() {
  const instance = await phantom.create()
  const page = await instance.createPage()
  const templateString = await fs.readFileSync(path.join(__dirname, 'assets', 'index.ejs'), 'utf-8')

  const reactions = await getGraphData()
  const template = ejs.render(templateString, {reactions: reactions})

  page.property('content', template)
  page.render('output.png', { format: 'png' })

  console.log(reactions)
}

setInterval(main, 5000)
