/**
 * Created by ligan on 01/06/16.
 */

angular.module('websiteApp').filter('messageContentFilter', function() {
    return function(input) {

        if (input[0] === '"') {
            input[0] = " ";
            input[input.length - 1] = " "
        }
        return input;

    }
});
angular.module('websiteApp').filter('unsafeFilter', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

angular.module('websiteApp').filter('filenameFilter', function() {
    return function(uploadFilename) {
        if (uploadFilename !== undefined) {
            var filename = uploadFilename.split("-");
            if (filename == undefined) return "";
            var filenameOriginal = filename[0].split('/')[1];
            if (filenameOriginal !== undefined) {
                return filenameOriginal;
            } else return "";
        } else return "";
    };
});