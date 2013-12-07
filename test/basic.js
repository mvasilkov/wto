var assert = require('assert'),
    wto = require('../wto')

describe('što', function () {
    function eq(a, b) { assert.strictEqual(a, b) }
    function one(a, b) { assert.notEqual(b.indexOf(a), -1) }

    it('should retain plain text', function () {
        eq(wto('')(), '')
        eq(wto('{{mustache}}')(), '{{mustache}}')
        eq(wto('#define foo bar')(), '#define foo bar')
    })

    it('should retain trivial groups', function () {
        eq(wto('#{ab}')(), 'ab')
        eq(wto('#define #{foo} #{bar}')(), '#define foo bar')
    })

    it('should select random bits', function () {
        one(wto('#{a#b}')(), 'ab'.split(''))
        one(wto('/* #{foo#wto} #{bar#što} */')(),
            ['/* foo bar */', '/* foo što */', '/* wto bar */', '/* wto što */'])
        /* nested */
        one(wto('#{#{a}##{b}}')(), 'ab'.split(''))
        one(wto('del #{foo##{bar#što}}')(), ['del foo', 'del bar', 'del što'])
        one(wto('del #{foo#-f #{bar#što}}')(), ['del foo', 'del -f bar', 'del -f što'])
    })

    it('should support utf8', function () {
        one(wto('Мама мыла #{раму#дхарму#брахму}.')(),
            ['Мама мыла раму.', 'Мама мыла дхарму.', 'Мама мыла брахму.'])
    })
})
