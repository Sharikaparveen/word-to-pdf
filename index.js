const express = require('express');
var app = express();
var upload = require('express-fileupload');
var docxConverter = require('docx-pdf');
var path = require('path');
var fs = require('fs');

const extend_pdf = '.pdf'
const extend_docx = '.docx'

var down_name

app.use(express.static('public'));

app.use(upload());


 
app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
})

app.get('/word',(req,res)=>{
    res.sendFile(__dirname+'/word.html');
})


app.post('/upload',function(req,res){
  console.log(req.files);
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    //File where .docx will be downloaded  
    var uploadpath = __dirname + '/upload/' + name;
    //Name of the file --ex test,example
    const First_name = name.split('.')[0];
    //Name to download the file
    down_name = First_name;
    file.mv(uploadpath,function(err){
      if(err){
        console.log(err);
      }else{
        //Path of the downloaded or uploaded file
        var initialPath = path.join(__dirname, `./upload/${First_name}${extend_docx}`);
        //Path where the converted pdf will be placed/uploaded
        var upload_path = path.join(__dirname, `./upload/${First_name}${extend_pdf}`);
        //Converter to convert docx to pdf -->docx-pdf is used
        //If you want you can use any other converter
        //For example -- libreoffice-convert or --awesome-unoconv
        docxConverter(initialPath,upload_path,function(err,result){
        if(err){
          console.log(err);
        }
        console.log('result'+result);
        res.sendFile(__dirname+'/down.html')
        });
      }
    });
  }else{
    res.send("No File selected !");
    res.end();
  }
});

app.get('/download', (req,res) =>{
  //This will be used to download the converted file
  res.download(__dirname +`/upload/${down_name}${extend_pdf}`,`${down_name}${extend_pdf}`,(err) =>{
    if(err){
      res.send(err);
    }
  })
})


  
app.listen(3000,() => {
    console.log("Server Started at port 3000...");
})
