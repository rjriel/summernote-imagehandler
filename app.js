var fs = require('fs');
var temp = require('temp');
var uuid = require('uuid');

module.exports = Converter;

function Converter(src) {
    this.files = [];
    this.original_source = src;
    this.source = src;

        var imageIndex = this.source.indexOf("\"data:image/");
        while (imageIndex >= 0) {
            var endIndex = this.source.indexOf("\"", imageIndex + 1);
            if (endIndex >= 0) {
                var imageData = this.source.slice(imageIndex + 1, endIndex);
                var extension = null;
                var extensionIndex = 11;
                var extensionEndIndex = imageData.indexOf(";", extensionIndex);
                if (extensionEndIndex >= 0) {
                    extension = imageData.substr(extensionIndex, extensionEndIndex - extensionIndex);
                    var base64Index = imageData.indexOf("base64,", extensionEndIndex);
                    if (base64Index > 0) {
                        var identifier = uuid.v4();
                        base64Index += 7;
                        var base64 = imageData.substr(base64Index);
                        var newFile = temp.path({suffix: '.' + extension});
                        fs.writeFile(newFile, base64, 'base64', function (err) {
                            if(err) {
                                console.log(err);
                            }
                        });
                        this.files.push({
                            id: identifier,
                            base64: base64,
                            origSrc: imageData,
                            file: newFile
                        });
                        this.source = this.source.substr(0, imageIndex + 1) + identifier + this.source.substr(endIndex);
                    }
                }
                imageIndex = this.source.indexOf("\"data:image/");
            }
        }
    };

Converter.prototype.setSrc = function(identifier, src) {
    for(var i = 0; i < this.files.length; i++) {
        if (this.files[i].id === identifier) {
            this.files[i].src = src;
            break;
        }
    }
};

Converter.prototype.getSource = function() {
    var finalSource = this.source;
    for(var i = 0; i < this.files.length; i++) {
        var file = this.files[i];
        var start = finalSource.indexOf(file.id);
        if(start >= 0) {
            if(file.src == null) {
                finalSource = finalSource.substr(0,start) + file.origSrc + finalSource.substr(start + file.id.length);
            } else {
                finalSource = finalSource.substr(0,start) + file.src + finalSource.substr(start + file.id.length);
            }

        }
    }
    return finalSource;
};

Converter.prototype.cleanupFiles = function(next) {
    for(var i = 0; i < this.files.length; i++) {
        fs.unlinkSync(this.files[i].file);
    }
};