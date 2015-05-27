function isLetter(str) {
    var reg = /^[a-z]$/;

    if (typeof str === 'string') {
        str = str.toLowerCase();
        return reg.test(str);
    }

    return false;
}

function assertArray(arr) {
    if (!Array.isArray(arr)) {
        throw new TypeError('Invalid arguments, expecting array');
    }
}

function assertString(str) {
    if (typeof str !== 'string') {
        throw new TypeError('Invalid arguments, expecting string');
    }
}

function assertNumber(num) {
    if (typeof str !== 'number' && !(num !== num)) {
        throw new TypeError('Invalid arguments, expecting number');
    }
}

function assertArgumentMarshaler(am) {
    if (typeof am !== 'object' || am === null || typeof am.set !== 'function') {
        throw new TypeError('Invalid arguments, expecting ArgumentMarshaler');
    }
}

function assertIterable(it) {
    if (typeof it !== 'object' || it === null || typeof it.next !== 'function') {
        throw new TypeError('Invalid arguments, expecting ArgumentMarshaler');
    }
}

// java like iterator
function arrToIterator(arr) {
    'use strict';
    assertArray(arr);
    let current = 0;
    
    return {
        hasNext() {
            return current < arr.length;
        },
        next() {
            if (this.hasNext()) {
                let retVal = arr[current];
                current += 1;
                return retVal;
            } else {
                throw {
                    name: 'NoSuchElementException'
                };
            }
        },
        previous() {
            current -= 1;
        }
    };
}

export {isLetter, assertArgumentMarshaler, assertArray, assertIterable, assertNumber, assertString, arrToIterator};