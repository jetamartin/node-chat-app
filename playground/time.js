var moment = require('moment');
// display date
var date = moment();
console.log(date.format("hh:mm a"));

// Manipulate dates
date.add(100, 'year').subtract(9, 'months');
console.log(date.format('MMM Do, YYYY'));

//10:35 am
// 6:01 am
// 12 hour clock minute padded hour not
