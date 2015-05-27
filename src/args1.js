/*jslint node: true*/

// import 'utils' as utils; todo: check this syntax
import * as utils from 'utils';

import {BooleanArgumentMarshaler, StringArgumentMarshaler, IntegerArgumentMarshaler, DoubleArgumentMarshaler, StringArrayArgumentMarshaler} from 'argumentMarshalers';

import argsExceptionEnum from 'argsExceptionEnum';

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
            this.marshalers_.set(elementId, new BooleanArgumentMarshaler());
        } else if (elementTail === '*') {
            this.marshalers_.set(elementId, new StringArgumentMarshaler());
        } else if (elementTail === '#') {
            this.marshalers_.set(elementId, new IntegerArgumentMarshaler());
        } else if (elementTail === '##') {
            this.marshalers_.set(elementId, new DoubleArgumentMarshaler());
        } else if (elementTail === '[*]') {
            this.marshalers_.set(elementId, new StringArrayArgumentMarshaler());
        } else {
            throw {
                name: 'ArgsException',
                message: argsExceptionEnum.INVALID_ARGUMENT_FORMAT,
                elementID: elementId,
                elementTail: elementTail
            };
        }
    }

    validateSchemaElementId_(elementId) {
        if (!utils.isLetter(elementId)) {
            throw {
                name: 'ArgsException',
                message: argsExceptionEnum.INVALID_ARGUMENT_NAME,
                elementID: elementId
            };
        }
    }

    parseArgumentStrings_(args) {
        utils.assertArray(args);
        this.currentArgument_ = utils.arrToIterator(args);
        
        while (this.currentArgument_.hasNext()) {
            let argString = this.currentArgument.next();

            if (argString.charAt(0) === '-') {
                this.parseArgumentCharacters_(argString.substring(1));
            } else {
                this.currentArgument_.previous();
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
            throw {
                name: 'ArgsException',
                message: argsExceptionEnum.UNEXPECTED_ARGUMENT,
                argument: argChar
            };
        } else {
            this.argsFound_.add(argChar);
            try {
                m.set(this.currentArgument_);
            } catch (e) {
                // e is ArgsException
                e.argument = argChar;
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