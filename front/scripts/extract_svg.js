/* script to extract departements from france.svg */

const fs = require('fs')
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
const { SVGPathData } = require('svg-pathdata')
const lo = require('lodash')
const window = createSVGWindow()
const document = window.document
registerWindow(window, document)

const SVG_PATH = '../public/circonscriptions/2012'

// loads france.svg
const franceSvgStr = fs
  .readFileSync(`${SVG_PATH}/france.svg`, 'utf-8')
  .toString()
const franceSvg = SVG().size(600, 600).svg(franceSvgStr)

// build list of uniques available zones in the SVG - "ab" if for "Corsica"
const matchRegexp = new RegExp('^([\\dab]+)-\\d+$', 'i')
const zones = lo
  .uniq(
    franceSvg
      .find(`path.circo`)
      .map(_ => _.attr('id'))
      .map(_ => {
        return _.replace(matchRegexp, '$1')
      }),
  )
  .sort()

// extract each zone and its circos into its own SVG
zones.forEach(zone => {
  const tmpSvg = SVG()
  const circosSvg = franceSvg.find(`*[id^=${zone}-]`)
  circosSvg.forEach(svg => tmpSvg.add(svg))
  const bbox = tmpSvg.bbox()
  const outSvg = SVG()

  tmpSvg.find('path.circo').forEach(circoSvg => {
    const pathData = new SVGPathData(circoSvg.plot().toString())
    const pathTranslated = pathData
      .translate(-bbox.x, -bbox.y)
      .scale(5) // make it big by default
      .encode()
    circoSvg.plot(pathTranslated)

    // fix path ids to be SVG compatible ( The id value must begin with a letter ([A-Za-z]))
    circoSvg.attr('id', `id-${circoSvg.attr('id')}`)
    outSvg.add(circoSvg)
  })
  const bbox2 = outSvg.bbox()
  outSvg.size(bbox2.width, bbox2.height)

  // make borders visible
  outSvg
    .fill('#eee')
    .stroke('#ccc')
    .attr(
      'xmlns:sodipodi',
      'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd',
    )
  const outSvgPath = `${SVG_PATH}/departements`
  if (!fs.existsSync(outSvgPath)) {
    fs.mkdirSync(outSvgPath)
  }
  fs.writeFileSync(`${outSvgPath}/${zone}.svg`, outSvg.svg())
  console.info(`Wrote ${outSvgPath}/${zone}.svg`)
})
