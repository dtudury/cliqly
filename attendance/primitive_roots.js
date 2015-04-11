

function is_prime(v) {
    for(var i = 2; i <= Math.sqrt(v); i++) {
        if (!(v % i)) return false;
    }
    return true;
}

function next_prime(v) {
    while(!is_prime(v))v++;
    return v;
}

function powm(a, b, c) {
    var result = 1;
    for (var i = 0; i < b; i++) {
        result *= a;
        result %= c;
    }
    return result;
}


function primitive_roots_modulo_of_prime(p) {
    var set = [];
    var s = p - 1;
    var s_factors = [];
    for (var i = 2; i <= Math.sqrt(s); i++) {
        if (s % i === 0) {
            s_factors.push(i);
            while (s % i === 0) s /= i;
        }
    }
    if (s > 1) s_factors.push(s);
    s = p - 1;
    for (var i = 2; i < p; i++) {
        var is_good = true;
        for (var j = 0; j < s_factors.length && is_good; j++) {
            var e = s / s_factors[j];
            if (powm(i, e, p) === 1) is_good = false;
        }
        if (is_good) set.push(i);
    }
    return set;
}

function make_sequence(p, root) {
    var size = p - 1;
    var out = {root:root, i:[], p:[], r:[]};
    for (var i = 0; i < size; i++) {
        out.i[i] = i;
    }
    for (var i = 0; i < size; i++) {
        out.p[i] = ((i + 1) * root) % p - 1;
    }
    for (var i = 0; i < size; i++) {
        out.r[out.p[i]] = i;
    }
    return out;
}


function test_sequence_count(sequence_count, p, roots) {
    var size = p - 1;
    var sequences = [];
    //var sequence_count = 2;//Math.log(p) / Math.log(1.75);
    for (var i = 0; i < sequence_count; i++) {
        sequences[i] = make_sequence(p, roots[i]);
    }

    //console.log(sequences);

    var coverages = [];
    for (var i = 0; i < size; i++) {
        var coverage = [];
        for (var j = 0; j < size; j++) {
            coverage[j] = 0;
        }
        coverages[i] = coverage;
    }

    //console.log(coverages);

    var rounds = 0;

    function do_round() {
        rounds++;
        var next_coverages = JSON.parse(JSON.stringify(coverages));
        for (var s = 0; s < sequences.length; s++) {
            var sequence = sequences[s];

            for (var i = 0; i < size; i++) {
                var us = coverages[i];
                var them = coverages[sequence.p[i]];
                for (var j = 0; j < size; j++) {
                    if (them[j]) {
                        next_coverages[i][j] = them[j];
                        next_coverages[i][i] = them[j];
                    }
                }
            }
        }
        coverages = next_coverages;
    }

    function check_done() {
        for (var i = 0; i < size; i++) {
            var count = coverages[i].reduce(function (a, b){return a + b}, 0);
            if (count <= size / 2) return false;
            //if (count < size) return false;
        }
        return true;
    }

    coverages[0][0] = 1;

    while (!check_done()) do_round();
    //console.log(coverages);
    /*
    for (var i = 0; i < size; i++) {
        console.log(coverages[i].reduce(function (a, b) {
            return a + (b ? '*' : '.');
        }, ''));
    }
    */
    /*
    console.log("size  : %s", size);
    console.log("spread: %s", sequences.length);
    console.log("steps : %s", rounds);
    console.log("%s", rounds * sequences.length);
    */
    return rounds;// * sequences.length;
}

function find_lightest_sequence_count(p) {
    var roots = primitive_roots_modulo_of_prime(p);
    var previous = p;
    for (var i = 2; i < roots.length; i++) {
        var current = test_sequence_count(i, p, roots);

        if (i > current) return {spread:i, steps:previous};
        //if (current * i > previous * (i - 1)) return {spread:i, steps:previous};
        previous = current;
    }
    return {spread:i, steps:previous};
}

var p = next_prime(100);
while (p < 500) {
    console.log("lightest_sequence for %s:", p - 1, find_lightest_sequence_count(p));
    p = next_prime(p + 1);
}



/*
function ident(v) {return v;}
function clone_arr(v) {return v.map(ident);}

function turn_off(i, arr) {
    arr[i % arr.length] = 0;
}

var primes = [2];
for (var i = 0; i < 100; i++) {
    //primes.push(next_prime(1 + primes[primes.length - 1]));
    primes.push(1 + primes[primes.length - 1]);
}

var strong_primes = [
     11,  17,  29,  37,  41, 
     59,  67,  71,  79,  97, 
    101, 107, 127, 137, 149, 
    163, 179, 191, 197, 223, 
    227, 239, 251, 269, 277, 
    281, 307, 311, 331, 347, 
    367, 379, 397, 419, 431, 
    439, 457, 461, 479, 487, 
    499];

var branches = strong_primes.length;
var p = next_prime(130);

primes.forEach(function(a) {
    var count = 0;
    function sprawl(v, i, arr) {
        if (!v) {
            turn_off(i * a, arr_clone);
            for (var j = 0; j < branches; j++) {
                turn_off(i * strong_primes[j], arr_clone);
            }
        }
    }

    for (var arr = []; arr.length < p; arr.push(1));

    arr[0] = 0;
    arr[1] = 0;
    var arr_clone = clone_arr(arr);

    while (arr.some(ident) && count < p + 1) {
        count++;
        arr.forEach(sprawl);
        arr = arr_clone;
        arr_clone = clone_arr(arr);
        //console.log(JSON.stringify(arr));
    }
    var guess = powm(a, (p - 1) / 2, p);
    //console.log("%s % 4 = %s, % 8 = %s %s %s", a, a % 4, a % 8, count < p ? "good" : "    ", guess);
    console.log("%s %s %s %s %s %s %s %s", a, mu(a), mu(p), a % 2, a % 4, p % 4, count < p ? "good" : "    ", guess);
})

//for (var i = 1; i < 30; i++) console.log("mu(%s) = %s", i, mu(i));
*/


