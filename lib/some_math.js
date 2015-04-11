var nth_prime = (function () {
    /*
    var starting_primes = [ 2, 3, 5, 7, 11, 13];
    var cycle_length = starting_primes.reduce(function(x, y){return x * y}, 1);
    var cycle_steps = [];
    var previous = 1;
    for (var i = 3; i < cycle_length; i+= 2) {
        if (starting_primes.every(function(n) {return i % n})) {
            cycle_steps.push(i - previous);
            previous = i;
        }
    }
    cycle_steps.push(i - previous);
    console.log(JSON.stringify(cycle_steps));
    */
    var starting_primes = [2,3,5,7];
    var cycle_length = 210;
    var cycle_steps = [10,2,4,2,4,6,2,6,4,2,4,6,6,2,6,4,2,6,4,6,8,4,2,4,2,4,8,6,4,6,2,4,6,2,6,6,4,2,4,6,2,6,4,2,4,2,10,2];
    var x = 1 + cycle_steps[0];
    var added_primes = [x];
    var step_index = 1;
    return function (n) {
        while (starting_primes.length + added_primes.length < n) {
            x += cycle_steps[step_index++ % cycle_steps.length];
            if (is_coprime(added_primes, x)) added_primes.push(x);
        }
        return starting_primes.concat(added_primes)[n - 1];
    }
})();

function primitive_roots(p) {
    var factors = uniq(factor(p - 1));
    console.log(p, factors);
    var roots = [];
    for (var i = 2; i < p; i++) {
        if (factors.every(function (f) {return npowm(i, (p - 1) / f, p) != 1 })) {
            roots.push(i);
        }
    }
    return roots;
}

function npowm(n, p, m) {
    var result = 1;
    while (p) {
        if  (p & 1) result = result * n % m;
        n = n * n % m;
        p >>>= 1;
    }
    return result;
}

function is_coprime(sorted_primes, x) {
    for (var i = 0; i < sorted_primes.length; i++) {
        var prime = sorted_primes[i];
        var q = Math.floor(x / prime);
        if (q < prime) break;
        if (prime * q == x) return false;
    }
    return true;
}

function factor(n) {
    var factors = [];
    var prime_index = 1;
    while (n > 1) {
        var prime = nth_prime(prime_index++);
        while (!(n % prime)) {
            n /= prime;
            factors.push(prime);
        }
    }
    return factors;
}

function uniq(arr) {
    if (!arr.length) return [];
    var result = [arr[0]];
    for (var i = 1; i < arr.length; i++) if (arr[i] != arr[i - 1]) result.push(arr[i]);
    return result;
}

exports.npowm = npowm;
exports.nth_prime = nth_prime;
exports.primitive_roots = primitive_roots;
