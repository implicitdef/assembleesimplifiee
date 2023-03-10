/* script to extract departements from france.svg */
import fs from 'fs'
import { createSVGWindow } from 'svgdom'
import { SVG, registerWindow, Path, Rect } from '@svgdotjs/svg.js'
import { SVGPathData } from 'svg-pathdata'
import lo from 'lodash'

const window = createSVGWindow()
const document = window.document
registerWindow(window, document)

const SVG_PATH = './public/circonscriptions/2012'

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
      .map(_ => _.attr('id') as string)
      .map(_ => {
        return _.replace(matchRegexp, '$1')
      }),
  )
  .sort()

// extract each zone and its circos into its own SVG
zones
  // .filter(_ => _ == '092')
  .forEach(zone => {
    const circoPaths = franceSvg.find(`*[id^=${zone}-]`)
    const outSvg = SVG()
    circoPaths.forEach(svg => outSvg.add(svg))

    outSvg.find('path.circo').forEach(pathRaw => {
      // fix path ids to be SVG compatible ( The id value must begin with a letter ([A-Za-z]))
      pathRaw.attr('id', `id-${pathRaw.attr('id')}`)
      // outSvg.add(pathRaw)
    })

    const bbox2 = outSvg.bbox()
    // set the viewBox to the dimensions of the content
    outSvg.viewbox(bbox2.x, bbox2.y, bbox2.width, bbox2.height)

    // quick way to add a background color to the whole SVG to debug its size
    // const bgRect = new Rect()
    // bgRect.width('100%')
    // bgRect.height('100%')
    // bgRect.fill('lightblue')
    // outSvg.add(bgRect)

    const outSvgPath = `${SVG_PATH}/departements`
    if (!fs.existsSync(outSvgPath)) {
      fs.mkdirSync(outSvgPath)
    }
    fs.writeFileSync(`${outSvgPath}/${zone}.svg`, outSvg.svg())
    console.info(`Wrote ${outSvgPath}/${zone}.svg`)
  })
