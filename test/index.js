'use strict';

var should  = require('chai').should();
var cheerio = require('cheerio');
var sprintf = require('sprintf');

var filter = require('../lib/filter');

var t = function(url){
    var result = filter({
        content: sprintf('<a href="%s">test</a>', url)
    });
    var $ = cheerio.load(result.content);

    return $('a').attr('href');
};

describe('URI Filter', function(){
    it('Double slashes (relative link artifacts)', function(){
        t('//index.html').should.be.equal('/index.html');
        t('//a/index.html').should.be.equal('/a/index.html');
    });

    it('Bad relative urls', function(){
        t('index.html').should.be.equal('/index.html');
        t('a/index.html').should.be.equal('/a/index.html');
    });

    it('Special URL preserving', function(){
        t('/index.html#test').should.be.equal('/index.html#test');
        t('#test').should.be.equal('#test');
        t('/index.html?param=value').should.be.equal('/index.html?param=value');
    });

    it('<img> tag', function(){
        var result = filter({
            content: '<img src="//test.jpg">'
        });
        result.content.should.be.equal('<img src="/test.jpg">');
    });

});
