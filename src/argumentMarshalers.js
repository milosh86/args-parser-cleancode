import * as utils from './utils';
import argsExceptionEnum from './argsExceptionEnum';

export class StringArgumentMarshaler {
    constructor() {
        this.stringVal_ = '';
    }

    set(currentArgument) {
        utils.assertIterable(currentArgument);

        try {
            this.stringVal_ = currentArgument.next();
        } catch (e) {
            throw {
                name: 'ArgsException',
                message: argsExceptionEnum.MISSING_STRING
            };
        }
    }

    static getValue(am) {
        if (am && am.set) {
            return am.stringVal_;
        } else {
            return '';
        }
    }
}

export class BooleanArgumentMarshaler {
    constructor() {
        this.booleanVal_ = '';
    }

    set() {
        this.booleanVal_ = true;
    }

    static getValue(am) {
        if (am && am.set) {
            return am.booleanVal_;
        } else {
            return false;
        }
    }
}

export class IntegerArgumentMarshaler {
    constructor() {
        this.intVal_ = 0;
    }

    set(currentArgument) {
        utils.assertIterable(currentArgument);
        let param,
            numVal;
        
        try {
            param = currentArgument.next();
            numVal = parseInt(param, 10);

            this.intVal_ = numVal;
        } catch (e) {
            throw {
                name: 'ArgsException',
                message: argsExceptionEnum.MISSING_OR_INVALID_NUMBER
            };
        };
    }

    static getValue(am) {
        if (am && am.set) {
            return am.intVal_;
        } else {
            return 0;
        }
    }
}

export class DoubleArgumentMarshaler {
    constructor() {
        this.doubleVal_ = 0;
    }

    set(currentArgument) {
        utils.assertIterable(currentArgument);
        let param,
            numVal;
        try {
            param = currentArgument.next();
            numVal = parseFloat(param);

            this.doubleVal_ = numVal;
        } catch (e) {
            throw {
                name: 'ArgsException',
                message: argsExceptionEnum.MISSING_OR_INVALID_NUMBER
            };
        }
    }

    static getValue(am) {
        if (am && am.set) {
            return am.doubleVal_;
        } else {
            return 0;
        }
    }
}

export class StringArrayArgumentMarshaler {
    constructor() {
        this.strArr_ = [];
    }

    set(currentArgument) {
        utils.assertIterable(currentArgument);
        
        while (currentArgument.hasNext()) {
            this.strArr_.push(currentArgument.next());
        }
    }

    static getValue(am) {
        if (am && am.set) {
            return am.strArr_;
        } else {
            return [];
        }
    }
}