/*jslint node: true*/

// import 'utils' as utils; todo: check this syntax
import * as utils from 'utils';

import {BooleanArgumentMarshaler, StringArgumentMarshaler, IntegerArgumentMarshaler, DoubleArgumentMarshaler, StringArrayArgumentMarshaler} from 'argumentMarshalers';

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


class Args {
    constructor(schema, args) {
        this.marshalers_ = new Map();
        this.argsFound_ = new Set();
        this.currentArgument_ = null;

        this.parseSchema_(schema);
        this.parseArgumentStrings_(args);
    }

    parseSchema_(schema) {
        utils.assertString(schema);

        schema.split(',').forEach(element => {
            let trimmed = element.trim();

            if (trimmed.length > 0) {
                this.parseSchemaElement_(trimmed);
            }
        });
    }

    parseSchemaElement_(element) {
        assertString(schema);

        let elementId = element.charAt(0),
            elementTail = element.substring(1);

        this.validateSchemaElementId_(elementId);

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

    validateSchemaElementId_(elementId) {
        if (!utils.isLetter(elementId)) {
            throw new ArgsException(INVALID_ARGUMENT_NAME, {
                elementId
            });
        }
    }

    parseArgumentStrings_(args) {
        utils.assertArray(args);

        // todo: make iterator
        for (let i = 0; i < args.length; i++) {
            utils.assertString(args[i]);
            
            let argString = args[i];
            this.currentArgument_ = i;

            if (argString.charAt(0) === '-') {
                this.parseArgumentCharacters_(argString.substring(1));
            } else {
                this.currentArgument_ -= 1;
                break;
            }
        }
    }

    parseArgumentCharacters_(argChars) {
        for (let i = 0; i < argChars.length; i++) {
            this.parseArgumentCharacter_(argChars.charAt(i));
        }
    }
    
    parseArgumentCharacter_(argChar) {
        let m = this.marshalers_.get(argChar);
        
        if (!m) {
            throw new ArgsException(UNEXPECTED_ARGUMENT, {argChar});
        } else {
            this.argsFound_.add(argChar);
            try {
                m.set(this.currentArgument_);
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
        return BooleanArgumentMarshaler.getValue(this.marshalers_.get(arg));
    }
    
    getString(arg) {
        return StringArgumentMarshaler.getValue(this.marshalers_.get(arg));
    }
    
    getIntiger(arg) {
        return IntegerArgumentMarshaler.getValue(this.marshalers_.get(arg));
    }
    
    getDouble(arg) {
        return DoubleArgumentMarshaler.getValue(this.marshalers_.get(arg));
    }
    
    getStringArray(arg) {
        return StringArrayArgumentMarshaler.getValue(this.marshalers_.get(arg));
    }


}