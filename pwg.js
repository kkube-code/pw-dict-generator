import fs from 'fs'
import { argv } from 'process'



var words = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*(){}[]<>'\";:,.?/\\-_=+`~"

const torange = (n) => {
    var ans = []
    while (n > 0) {
        ans.unshift(n)
        n--
    }
    return ans
}

await fs.mkdir('./output', 
    { recursive: true }, async (err) => { 
    await console.log('Directory created successfully!'); 
});



const generator = async (words, n) => {

    for (var i = 0; i < words.length; i++) {
        await fs.appendFileSync('./output/temp-1.txt', words[i]+"\n", async err=> {
            if (err) {
                await console.log(err)
            }
        })
    }
    await console.log(`created output/temp-1.txt`)

    const a = async(words, _n) => {
        const i = _n
        if (i <= n) {
            var readl = await fs.createReadStream(`./output/temp-${i-1}.txt`, 'utf8');
            await console.log(`read output/temp-${i-1}.txt`)
            await readl.on('data', async (chunk) => {
                var writet = await fs.createWriteStream(`./output/temp-${i}.txt`, 
                { 'flags': 'a'
                , 'encoding': null
                , 'mode': 0x0666
                })
                await console.log(`created output/temp-${i}.txt`)
                for (const j of chunk.split('\n')) {
                    for (var k = 0; k < words.length; k++) {
                        if ((j+words[k]).length >= i && j != '') {
                            await writet.write(j+words[k]+"\n")
                        }
                    }
                }
                await writet.end()
            })
            setTimeout(async () => {
                await a(words, i+1)
            }, 1000)
        }
    }

    //for (var i = 2; i <= n; i++) {
            await a(words, 2)
    //}
}

if (argv.length > 4) {
    words = ""
    if (argv.slice(4).includes("-up")) {
        words += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }

    if (argv.slice(4).includes("-un")) {
        words += "abcdefghijklmnopqrstuvwxyz"
    }

    if (argv.slice(4).includes("-n")) {
        words += "1234567890"
    }

    if (argv.slice(4).includes("-p")) {
        words += "!@#$%^&*(){}[]<>'\";:,.?/\\-_=+`~"
    }
}

if (argv.length < 4 || argv[2] == '-h' || argv[2] == '--help') {
    console.log("\n\nUsage: yarn dev [path] [maxlength]\nIt will rewrite target file and ./output/if exist\n\n")
    console.log(words)
} else {
    setTimeout(async () => {
        await generator(words, Number(argv[3]))
    }, 1000)
}