import * as cheerio from 'cheerio'
import { writeFileSync } from 'node:fs'
import * as puppeteer from 'puppeteer'
import Turndown from 'turndown'

const confDocsUrl = 'https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html'

type ParsedConf = {
    globalParams: Record<string, { md: string, default: string | null }>
    sharedParams: Record<string, { md: string, default: string | null }>
}

const webScrapeConfDocs = async () => {
    const output = { globalParams: {}, sharedParams: {} } as ParsedConf
    const turndownService = new Turndown({})

    turndownService.addRule('indentRule', {
        filter: (node) => node.tagName === 'DD',
        replacement: (content) => {
            return `<div style="margin-left: 40px">\n` + content + `\n</div>`
        },
    })
    turndownService.addRule('preRule', {
        filter: (node) => node.tagName === 'PRE',
        replacement: (content) => {
            return '```\n' + content + '\n````'
        },
    })
    turndownService.addRule('indentRuleDiv', {
        filter: (node) => node.classList.contains('variablelist') && node.tagName === 'DIV',
        replacement: (content) => {
            return `<div style="margin-left: 40px">\n` + content + `\n</div>`
        },
    })
    turndownService.addRule('noteRule', {
        filter: (node) => node.classList.contains('note') && node.tagName === 'DIV',
        replacement: (content) => {
            return '\n' + content.split('\n').map((l) => `> ${l}`).join('\n')
        },
    })
    turndownService.addRule('warningRule', {
        filter: (node) => node.classList.contains('warning') && node.tagName === 'DIV',
        replacement: (content) => {
            return '\n' + content.split('\n').map((l, i) => {
                if (i === 2) return `> <span style="font-size: 1.25em; color: #f7b011;">Warning</span>`

                return `> ${l}`
            }).join('\n')
        },
    })

    const browser = await puppeteer.launch({ ignoreDefaultArgs: true })
    const page = await browser.newPage()
    await page.goto(confDocsUrl)
    const data = await page.evaluate(() => document.querySelector('*')?.outerHTML) || '' as string

    const $ = cheerio.load(data)

    const sectionsList = 'body > div > div:nth-child(15) > div > .section'
    const htmlList = $(sectionsList)
    htmlList.each((_i, element) => {
        const name = $(element).find('div > div > .title').text().trim()

        const lastIndex = name.lastIndexOf(' ')
        const [before, after] = [name.slice(0, lastIndex), name.slice(lastIndex + 1)]
        if (after === '(G)' || after === '(S)') {
            const elementChildren = $(element).find('div.variablelist > dl.variablelist > dd > *')
            let ignoreIdxs = [] as number[];
            let defaultValue: string = undefined!;

            elementChildren.each((i, child_el) => {
                const el = $(child_el).text().trim()
                if (el.startsWith('Example:')) {
                    ignoreIdxs.push(i)
                }
                if (el.startsWith('Default:')) {
                    defaultValue = el.split('=').pop()?.trim() || ''
                    ignoreIdxs.push(i)
                }
            })

            const descriptionEl = $(element).find('div.variablelist > dl.variablelist > dd')
            let removedIdxs = 0
            for (const idx of ignoreIdxs) {
                descriptionEl.children().remove(`*:nth(${idx - removedIdxs})`)
                removedIdxs++
            }

            const md = turndownService.turndown(descriptionEl.html() || '')

            if (after === '(G)') output.globalParams[before] = { md, default: defaultValue }
            else output.sharedParams[before] = { md, default: defaultValue }
        } else {
            return
        }
    })

    await browser.close()
    writeFileSync('./parsedConfParams.json', JSON.stringify(output, null, 2))
};

(async () => {
    await webScrapeConfDocs()
})()
