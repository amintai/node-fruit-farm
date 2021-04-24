const http = require('http')
const url = require('url')
const fs = require('fs')
const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplate')

const PORT = 5000
// get the JSON data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
// get the overview html
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html` ,'utf-8')
// get the product html
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html` ,'utf-8')
// get the card html
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')
// replace each json object with the {%%} on html 

// parse the string data to JSON  format
const dataObj = JSON.parse(data)
const slugs = dataObj.map(el => slugify(el.productName ,{ lower : true}));
const server = http.createServer((req,res) => {

    const {query,pathname} = url.parse(req.url , true)
    // const pathname = req.url
    // const pathname = req.url
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200,{'Content-type':'text/html'})
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output);
     }
     else if(pathname === '/product'){
         res.writeHead(200,{'Content-type':'text/html'})

         const product = dataObj[query.id]

         const output = replaceTemplate(tempProduct,product)
        res.end(output)
    } else if(pathname === '/api') {
        res.writeHead(200 , {'Content-type':'application/json'})    
        // console.log(data)
        res.end(data)
    }
  // not found
  else {
    res.writeHead(404 , {
        'Content-type':'text/html',
        'my-own-header':'hello-world'
    })
    res.end('<h1>Page not found</h1>')
}
        
})

server.listen(5000,'127.0.0.1',() => {
    console.log(`Server is running on 5000`)
})      
    