var fs = require('fs');
var Converter = require('../app');
var assert = require('chai').assert;

describe('summernote-imagehandler', function () {

    var originalSource = fs.readFileSync('test/original_source.html', 'utf8');
    var expectedSource = fs.readFileSync('test/expected_source.html', 'utf8');
    var originalImage = fs.readFileSync('test/original_file.png', 'base64');

    var summernoteSource = new Converter(originalSource);
    it('should have found 2 images in the data', function () {
        assert.equal(summernoteSource.files.length, 2);
    });
    for (var i = 0; i < summernoteSource.files.length; i++) {
        var newFile = 'test/new_file' + i.toString() + '.' + summernoteSource.files[i].extension;
        fs.createReadStream(summernoteSource.files[i].file).pipe(fs.createWriteStream(newFile));
        it('File ' + i.toString() + ' should create a file equal to the original', function (done) {
            fs.readFile(newFile, 'base64', function (err, data) {
                assert.equal(originalImage, data);
                done();
            });
        });
        summernoteSource.setSrc(summernoteSource.files[i].id, newFile);
    }
    it('should have the same source as expected_source.html', function () {
        assert.equal(expectedSource, summernoteSource.getSource());
    });

    summernoteSource.cleanupFiles();
    it('should indicate the first file is no longer present', function (done) {
        fs.access(summernoteSource.files[0].file, fs.F_OK, function (err) {
            assert.isNotNull(err);
            done();
        });
    });
    it('should indicate the second file is no longer present', function (done) {
        fs.access(summernoteSource.files[0].file, fs.F_OK, function (err) {
            assert.isNotNull(err);
            done();
        });
    });
});
