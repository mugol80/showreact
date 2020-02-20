
// create namespace
if (!window.GS) {
    window.GS = {};
}

document.addEventListener("deviceready", function() {
    // disable backbutton
    document.addEventListener("backbutton", function() {}, false);

    if (window.navigator && window.navigator.splashscreen && typeof window.navigator.splashscreen.hide == "function") {
        window.navigator.splashscreen.hide();
    }


    GS.internalDownloadsFolder = 'cdvfile://localhost/persistent/downloads/';
    GS.internalFileDownloadsFolder = cordova.file.documentsDirectory+'downloads/';

    GS.getInternalFileUri = function(targetFile, fileTarget) {
        return fileTarget ? GS.internalFileDownloadsFolder+targetFile : GS.internalDownloadsFolder+targetFile;
    };

    GS.downloadFile = function(downloadUri, targetFile, successCallback, errorCallback) {
        var ft = new FileTransfer();
        ft.download(
            downloadUri,
            GS.getInternalFileUri(targetFile),
            function(entry) {
                if (typeof successCallback == 'function') {
                    successCallback(entry);
                }
            },
            function(error) {
                if (typeof errorCallback == 'function') {
                    errorCallback(error);
                }
            }
        );
    };

    GS.fileExists = function(targetFile, callback) {
        window.resolveLocalFileSystemURL(GS.internalDownloadsFolder+targetFile, function(fileEntry) {
            if (typeof callback == 'function') {
                callback(true, fileEntry);
            }
        }, function(error) {
            if (typeof callback == 'function') {
                callback(false, error);
            }
        });
    };

    GS.getDownloadedFiles = function(successCallback, errorCallback) {
        window.resolveLocalFileSystemURL(GS.internalDownloadsFolder, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
                function (entries) {
                    if (typeof successCallback == 'function') {
                        successCallback(entries);
                    }
                },
                function (err) {
                    if (typeof errorCallback == 'function') {
                        errorCallback(error);
                    }
                }
            );
        }, function (err) {
            if (typeof errorCallback == 'function') {
                errorCallback(error);
            }
        });
    };
});
