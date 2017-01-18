/**
 * Created by Z on 2017.1.10 0010.
 */
const cheerio = require('cheerio');
const fs = require('fs');
const rootPath = 'F:\\WebInf\\news\\';
const targetPath = 'F:\\WebInf\\target\\cssF\\'
const file = [];

fs.exists(targetPath,exists => {                          //预处理 移除缓存提取网页
    if(exists){
        let fileTemp = fs.readdirSync(targetPath);
        fileTemp.forEach(f => {
            fs.unlinkSync(targetPath + '\\' + f);       //移除提取网页文件
        })
        fs.rmdir(targetPath,err => {                  //删除提取网站目录
            if(err){
                console.log('清除缓存失败'+err);
                return err;
            }else {
                console.log('成功清除缓存');


            }

        });
    }
})

fs.readdir(rootPath,(err,dir) => {              //获取源文件目录信息
    if(err)
        console.log('文件目录信息获取失败');
    else
    {
        fs.mkdir(targetPath);
        dir.forEach(e => {
          // file.push(e);//  console.log(file[file.length-1]);
           fs.readFile(rootPath + e,'utf-8',(errF,data) => {
               if(errF){
                   console.log('文件读取错误');
                   return;
               }else {
                   let $ = cheerio.load(data,{decodeEntities: false});
                   let flag = [];
                   let content = new Object();            //创建对象存储文章结构
                   let article = $('#j_article_desc');
                   let fileName = '';
                   let contentJson = '';

                   content.title = article.find('.x_box13').find('.title').text();            //根据css样式特征抽取文章内容，并存入js对象中
                   content.information = article.find('.sum').find('.it').text().replace(/\s+/ig, "*");
                   content.content = article.find('#content').children('p').text();
                   content.detail_authhor = article.find('.x_detail1_author').text().replace(/\s+/ig, "");
                   content.state = $('.state').text().replace(/\s+/ig, "*");
                   contentJson = JSON.stringify(content);                         //将js对象转化为json字符串

                   flag =  e.split('.');
                   fileName = flag[0] + '.txt';

                   fs.open(targetPath +fileName,'w',(err1,fd) => {         //打开存放抓取网页的目标目录
                       if(err1){
                           console.log('文件打开失败');
                       }else {

                           fs.write(fd,contentJson,0,contentJson.length,(error,ytesWritten, buffer) => {            //将json字符串存入目标文件中
                               if(error){
                                   console.log('写入文件失败');
                                   fs.close;
                               }else{
                                   console.log('写入文件成功' + '\t' + targetPath+ fileName + '\n');
                                   fs.close;
                               }
                           })
                       }

                   });


               }

           })

       });



    }
})
