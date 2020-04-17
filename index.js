var dir = require('./path.json')
var svgexport = require('svgexport')
var clear = require('clear');
var fs = require('fs');
var figlet = require('figlet')
var chalk = require('chalk')
var path = require('path');

var inputDir = dir.input
var outputDir = dir.output

clear();

console.log(
    chalk.yellow(
        figlet.textSync('.SVG to .PNG', { horizontalLayout: 'full' })
    )
);

function readInputDir (inputDir, cb) {
  fs.readdir(inputDir, function(err, list) {
    if (err) return console.log(err);

    var filtered = list.map(function(fileName) {
      return path.join(inputDir, fileName);
    }).filter(function(filePath) {
      return path.extname(filePath) === '.svg';
    })

    cb(null, filtered);
  })
}

function convertFileToPng (inputDir, outputDir) {
  console.log('Please wait, converting images...')

  readInputDir(inputDir, function(err, listOfImage) {
    if (err) throw err;

    const preparedImages = listOfImage.map((image) => {
      const fileName = path.parse(image).name
      const outputFile = outputDir + '/' + fileName + ".png"
      const dataFile = {
        input: [
          image, "100%"
        ],
        output: [
          outputFile, "100%"
        ]
      }
      return dataFile
    }).reduce((result, returnImage) => {
      return [...result, returnImage]
    }, [])

    svgexport.render(preparedImages, function() {
      console.log('All images successfully converted!')
    })
  })
}

convertFileToPng(inputDir, outputDir)