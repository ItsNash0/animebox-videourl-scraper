const puppeteer = require("puppeteer-extra")
const logger = require("heroku-logger")
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
puppeteer.use(StealthPlugin())

const express = require("express")
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
	res.send("Hello World!")
})

app.post("/scrape", async (req, res) => {
	res.send(await getVideo(req.body.url))
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

async function getVideo(url) {
	const browser = await puppeteer.launch({
		headless: true,
	})
	const page = await browser.newPage()
	// await page.setUserAgent(
	// 	"User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:98.0) Gecko/20100101 Firefox/98.0"
	// )
	console.log(await browser.userAgent())
	await page.goto(url)
	// console.log(page);
	logger.info("Page content", await page.content())
	var iframes = await page.waitForSelector("iframe[class='vjs_iframe']")
	const iframe = await iframes.contentFrame()
	var videourl = await iframe.waitForSelector("#video-js_html5_api")
	var result = await videourl.evaluate((node) => node.src)
	await browser.close()
	return await result
}
