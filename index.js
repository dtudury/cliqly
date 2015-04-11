var some_math = require('./lib/some_math');



var prime = some_math.nth_prime(10);
var roots = some_math.primitive_roots(prime);
roots.forEach(function(root) {
    var ring = [];
    for (var i = 0; i < prime - 1; i++) {
        ring.push(some_math.npowm(root, i, prime));
    }
    console.log(root, JSON.stringify(ring));
});

console.time("asdf");
console.log(some_math.nth_prime(1));
console.log(some_math.nth_prime(1000000));
console.timeEnd("asdf");
console.time("asdf2");
console.log(some_math.nth_prime(1000001));
console.timeEnd("asdf2");
