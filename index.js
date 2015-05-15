var cheerio = require('cheerio');
var URI = require('uri-js');

var blog_host = URI.parse(hexo.config.url)['host'];

hexo.extend.filter.register('after_post_render', function(data){
    $ = cheerio.load(data.content, {
        decodeEntities: false
    });

    $('a').each(function(){
        var link_host = URI.parse($(this).attr('href'))['host']
            .replace(/^www\./g, '');

        if(link_host !== blog_host){
            $(this).attr('rel', 'external'); 
        }
    });

    data.content = $.html();
    return data;
});