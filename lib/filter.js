'use strict';

var cheerio = require('cheerio');

var fixUrl = function(url){
    if (url.substr(0,1) === '#'){
        return url;
    }

    // fix bad relative link, like `index.html` instead `/index.html`

    if(url.substr(0,4) !== 'http'){
        url = url.replace(/^(\w)/i, '/$1');
    }

    url = url.replace(/^\/\//, '/');

    return url;
};

module.exports = function(data){
    var $ = cheerio.load(data.content, {
        decodeEntities: false
    });

    $('a').each(function(){
        var $this = $(this);

        $this.attr('href', fixUrl($this.attr('href')));
    });

    $('img').each(function(){
        var $this = $(this);

        $this.attr('src', fixUrl($this.attr('src')));
    });

    data.content = $.html();
    return data;
};
