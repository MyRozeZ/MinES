/**
 * Created by Z on 2017.1.9 0009.
 */
var tidy = require('htmltidy').tidy;
tidy("F:\\WebInf\\news\\505633.html", function(err, html) {
    console.log(html);
});

