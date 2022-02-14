const puppeteer = require("puppeteer")

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
		headless: false,
	})
	const page = await browser.newPage()
	await page.goto(url)
	// console.log(page);
	var iframes = await page.waitForSelector("iframe[class='vjs_iframe']")
	const iframe = await iframes.contentFrame()
	var videourl = await iframe.waitForSelector("#video-js_html5_api")
	var result = await videourl.evaluate((node) => node.src)
	await browser.close()
	return await result
}
