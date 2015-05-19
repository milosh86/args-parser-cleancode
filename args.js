/*jslint node: true*/

class ArgsException {
    constructor(message, data) {
        this.message = message;
        this.data = data;
        this.name = "ArgsException";
    }
}

var INVALID_ARGUMENT_FORMAT = 'Invalid argument format',
    INVALID_ARGUMENT_NAME = 'Invalid argument name',
    UNEXPECTED_ARGUMENT = 'Unexpected command-line argument';

// utils
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

function arrToIterable(arr) {
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
                return {done: false, value: retVal};
            } else {
                return {done: true, value: void 0};
            }
        },
        previous() {
            current -= 1;
        }
    };
}

// utils end

class Args {
    constructor(schema, args) {
        this.marshalers_ = new Map();
        this.argsFound_ = new Set();
        this.currentArgument_ = null;

        parseSchema(schema);
        parseArgumentStrings(args);
    }

    parseSchema(schema) {
        assertString(schema);

        schema.split(',').forEach(element => {
            let trimmed = element.trim();

            if (trimmed.length > 0) {
                parseSchemaElement(trimmed);
            }
        });
    }

    parseSchemaElement(element) {
        assertString(schema);

        let elementId = element.charAt(0),
            elementTail = element.substring(1);

        validateSchemaElementId(elementId);

        if (elementTail.length === 0) {
            this.marshalers_.set(elementId, 'boolean');
        } else if (elementTail === '*') {
            this.marshalers_.set(elementId, 'string');
        } else if (elementTail === '#') {
            this.marshalers_.set(elementId, 'number');
        } else if (elementTail === '[*]') {
            this.marshalers_.set(elementId, 'stringArray');
        } else {
            throw new ArgsException(INVALID_ARGUMENT_FORMAT, {
                elementId,
                elementTail
            });
        }
    }

    validateSchemaElementId(elementId) {
        if (!isLetter(elementId)) {
            throw new ArgsException(INVALID_ARGUMENT_NAME, {
                elementId
            });
        }
    }

    parseArgumentStrings(args) {
        assertArray(args);

        // todo: make iterator
        for (let i = 0; i < args.length; i++) {
            assertString(args[i]);
            
            let argString = args[i];
            this.currentArgument_ = i;

            if (argString.charAt(0) === '-') {
                parseArgumentCharacters(argString.substring(1));
            } else {
                this.currentArgument_ -= 1;
                break;
            }
        }
    }

    parseArgumentCharacters(argChars) {
        for (let i = 0; i < argChars.length; i++) {
            parseArgumentCharacter(argChars.charAt(i));
        }
    }
    
    parseArgumentCharacter(argChar) {
        let m = this.marshalers_.get(argChar);
        
        if (!m) {
            throw new ArgsException(UNEXPECTED_ARGUMENT, {argChar});
        } else {
            this.argsFound_.add(argChar);
            try {
                m.set(this.currentArgument_); // todo: check this
            } catch (e) {
                e.argChar = argChar;
                throw e;
            }
        }
    }
    
    has(arg) {
        return this.argsFound_.has(arg);
    }
    
    nextArgument() {
        return this.currentArgument_.nextIndex();
    }
    
    getBoolean(arg) {
        return BooleanArgumentMarchaler.getValue(arg);
    }
    
    getString(arg) {
        return StringArgumentMarchaler.getValue(arg);
    }
    
    getNumber(arg) {
        return NumberArgumentMarchaler.getValue(arg);
    }
    
    getStringArray(arg) {
        return StringArrayArgumentMarchaler.getValue(arg);
    }


}