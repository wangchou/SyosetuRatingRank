// follow the tutorial from https://www.geeksforgeeks.org/nodejs-web-crawling-using-cheerio/
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('fs');

const loadPage = (pageNumber) => {
  return new Promise(function(resolve, reject) {
    const URL = `https://yomou.syosetu.com/search.php?&page=2&order_former=search&order=hyokacnt&notnizi=1&p=${pageNumber}`;
    var options = {
      url: URL,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
      }
    };

    request(options, (err, res, body) => {
      if(err){
        console.log(err);
        reject(error)
      } else {
        let $ = cheerio.load(body);  //loading of complete HTML body

        $('.searchkekka_box').each( (index, elem) => {
          let title = $(elem).find('.novel_h>a').text()
          let link = $(elem).find('.novel_h>a').attr('href')
          let allSpans = $(elem).find('span')
          let raterCount = $(allSpans[allSpans.length - 2]).text().split(" ")[2].replace(',',"")
          let totalRating = $(allSpans[allSpans.length - 1]).text().split("\n")[2].replace(',',"")
          console.log(`=HYPERLINK(\"${link}\",\"${title}\");${raterCount};${totalRating}`)
        });
        resolve()
      }
    });
  })
}

async function main() {
  for(let pageNumber = 1; pageNumber < 60; pageNumber++) {
    await loadPage(pageNumber)
  }
}
main()
