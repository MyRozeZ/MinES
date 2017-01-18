/**
 * Created by Z on 2017.1.3 0003.
 */
const superagent = require("superagent");
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');
const tidy = require('htmltidy').tidy;
//var Q = require('q');

//var  deferred = Q.defer();

const targetURL = {};    //抓取目标网址
const actions = [];   //待抓取队列
const profileURL = 'http://heart.dxy.cn/tag/news';         //丁香园心血管模块最新资讯地址
const rootPath = 'F:\\WebInf';                                //文件存放根目录
const  path =  rootPath + "\\" + profileURL.split('/').pop();    //文件存放路径
let preHtml = '';

const  cookie = 'CMSSESSIONID=635BBEB0AEED43882FE8AD15D77B4204-n1;'    ;               //配置请求头参数
const  accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
const  accept_encoding = 'gzip, deflate, sdch';
const user_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
const accept_language = 'zh-CN,zh;q=0.8';

/*function save(save_path) {
    fs.open(save_path,'w',(err1,fd) => {         //存放抓取网页
        if(err1){
            console.log('文件打开失败');
            deferred.reject(new Error(err1));
        }else {
            filed = fd;
         //   console.log(fd.toString());
            deferred.resolve(fd);
        }
        })
    return deferred.promise;
}*/

fs.exists(path,exists => {                          //预处理 移除缓存网页
    if(exists){
        let fileTemp = fs.readdirSync(path);
        fileTemp.forEach(f => {
            fs.unlinkSync(path + '\\' + f);       //移除网页文件
        })
        fs.rmdir(path,err => {                  //删除网站目录
            if(err){
                console.log('清除缓存失败'+err);
                return err;
            }else {
                console.log('成功清除缓存');

            }

        });
    }
})

superagent
    .get(profileURL)
    .set('User-Agent',user_agent)
    .set('Connection', 'keep-alive')
    .set('Accept-Language',accept_language)
    .set('Accept',accept)
    .set('Accept-Encoding',accept_encoding)
    .set('Cache-Control','make-alive')
    .set('Host','heart.dxy.cn')
    .set('Upgrade-Insecure-Requests','1')
    .set('Cookie',cookie)
    .end((errin,resin) => {
    if(errin){
        console.log('url请求出错，具体错误为：' + errin);
        return errin;
    } else {
        let index = 0;   //待抓取队列数组下标
        let $ = cheerio.load(resin.text, {decodeEntities: false});
        let connection = resin.header['connection'];

        fs.mkdir(path);          //创建网页存放目录

        $('dl').each((i, elem) => {                  //根据结构特征dl抓取url，放入待抓取队列
            actions[i] = $(elem).find('a').attr('href');
            //      console.log(actions[i]);
        });
        console.log("待抓取队列有" + actions.length + "个网页");

        actions.forEach(function spider(e) {

            superagent
                .post(e)
                .set('User-Agent',user_agent)
                .set('Accept-Language',accept_language)
                .set('Cookie',cookie)
                .set('Accept',accept)
                .set('Accept-Encoding',accept_encoding)
                .end((err,res) => {
                    if(err){
                        console.log("正在抓取第" + (index) +"个网页");
                        console.log("网址为" + e);
                        console.log('抓取失败，失败原因为：' + err + '\n');
                        spider(e);
                        return err;
                    } else {
                        let route = path + '\\' + e.split('/').pop() + '.html';

                        console.log("正在抓取第" + (++index) +"个网页");
                        console.log("网址为" + e);
                        tidy(res.text,(errHtml,html) => {             //html预处理
                            if(errHtml){
                                console.log('html预处理失败');
                            } else{
                            preHtml = html;

                 /*       save(route)
                            .then( data => {
                                fs.write(filed,res.text,0,res.text.length,(error,ytesWritten, buffer) => {
                                    if (error) {
                                        console.log('写入文件失败');
                                    } else {
                                        console.log('写入文件成功' + index + +'   ' + route + '\n');
                                    }

                                })
                            });

                        fs.openSync(route,'w').then((fd) => {         //存放抓取网页
                                fs.write(fd,res.text,0,res.text.length)
                                })
                            .then((error,ytesWritten, buffer) => {
                                        console.log('写入文件成功' + index + +'\t' + route + '\n');

                                })


                        ;*/
                        fs.open(route,'w',(err1,fd) => {         //存放抓取网页
                            if(err1){
                                console.log('文件打开失败');
                            }else {

                                fs.write(fd,res.text,0,res.text.length,(error,ytesWritten, buffer) => {
                                    if(error){
                                        console.log('写入文件失败');
                                        fs.close;
                                    }else{
                                        console.log('写入文件成功' + index + + '\t' + route+'\n');
                                        fs.close;
                                    }
                                })
                            }

                        });
                            }
                        })

                    }
                })

        })


    }
})
