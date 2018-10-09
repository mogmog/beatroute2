from quart import Quart, websocket, send_file
from pyppeteer import launch
import io

app = Quart(__name__)

@app.route('/')



async def hello():
    browser = await launch({'executablePath': '/usr/bin/chromium-browser', 'networkIdleTimeout': 500, 'waitUntil': 'networkidle' })

    page = await browser.newPage()
    await page.goto('http://localhost:8000/404')
    await page.screenshot({'path': 'example.png',   'fullPage': True})

    dimensions = await page.evaluate('''() => {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio,
        }
    }''')

    print(dimensions)
    # >>> {'width': 800, 'height': 600, 'deviceScaleFactor': 1}
    return await send_file('example.png')

@app.websocket('/ws')
async def ws():
    while True:
        await websocket.send('hello')

app.run()
