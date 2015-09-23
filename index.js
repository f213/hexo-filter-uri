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

        var link_host = URI.parse(href)['host'];
        if(!link_host){
            return;
        }
        if(link_host.replace(/^www\./g, '') !== blog_host){
            $this.attr('rel', 'external');
        }

        // temporary workaround for https://github.com/hexojs/hexo/pull/1345
        $this.attr('href',
            href.replace(/^\/\//, '/')
        );
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