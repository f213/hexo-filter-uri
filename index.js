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


        // temporary workaround for https://github.com/hexojs/hexo/pull/1345

        $this.attr('href',
            href.replace(/^\/\//, '/')
        );

        // disable unwanted relative links

        if ('relative_link' in hexo.config && !hexo.config.relative_link && href.substr(0,4)!== 'http'){
            $this.attr('href',
                href.replace(/^([a-z])/, '/$1')
            );
        }
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