import * as utils from 'utils';
import argsExceptionEnum from 'argsExceptionEnum';


class StringArgumentMarshaler {
    constructor() {
        this.stringVal_ = '';
    }

    set(currentArgument) {
        utils.assertIterable(currentArgument);

        try {
            this.stringVal_ = currentArgument_.next();
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

class BooleanArgumentMarshaler {
    constructor() {
        this.booleanVal_ = '';
    }

    set() {
        this.booleanVal_ = true;
    }

    static getValue(am) {
        if (am && am.set) {
            return this.booleanVal_;
        } else {
            return false;
        }
    }
}

class IntegerArgumentMarshaler {
    constructor() {
        this.intVal_ = 0;
    }

    set(currentArgument) {
        utils.assertIterable(currentArgument);
        let param,
            numVal;
        try {
            param = currentArgument_.next();
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
            return this.intVal_;
        } else {
            return 0;
        }
    }
}

class DoubleArgumentMarshaler {
    constructor() {
        this.doubleVal_ = 0;
    }

    set(currentArgument) {
        utils.assertIterable(currentArgument);
        let param,
            numVal;
        try {
            param = currentArgument_.next();
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
            return this.doubleVal_;
        } else {
            return 0;
        }
    }
}