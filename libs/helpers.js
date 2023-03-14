const bcrypt = require('bcryptjs');

const helpers = {};

helpers.registerHelper('selected', function(option, value){
    if (option === value) {
        return ' selected';
    } else {
        return ''
    }
});

module.exports = helpers;