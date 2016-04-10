var cheerio = require('cheerio');
var URI = require('uri-js');

var blog_host = URI.parse(hexo.config.url)['host'];

hexo.extend.filter.register('after_post_render', function(data){
    $ = cheerio.load(data.content, {
        decodeEntities: false
    });

    $('a').each(function(){
        var $this = $(this),
            href = $this.attr('href');

        if(href.substr(0,1) === '#'){
            return;
        }

        // disable unwanted relative links

        if ('relative_link' in hexo.config && !hexo.config.relative_link && href.substr(0,4)!== 'http'){
            href = href.replace(/^(\w)/i, '/$1');
        }

        // temporary workaround for https://github.com/hexojs/hexo/pull/1345

        href = href.replace(/^\/\//, '/');

        $this.attr('href', href);
    });

    $('img').each(function(){ // temporary workaround for https://github.com/hexojs/hexo/pull/1345
        var $this = $(this);
        if($this.attr('src')){
            var src = $this.attr('src');
            $this.attr('src',
                src.replace(/^\/\//, '/')
            );
        };
    });

    data.content = $.html();
    return data;
});