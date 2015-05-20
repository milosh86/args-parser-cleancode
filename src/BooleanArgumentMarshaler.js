function set() {
    this.booleanVal_ = true;
}

function getValue(am) {
    if (am && am.set) {
        return this.booleanVal_;
    } else {
        return false;
    }
}


function booleanArgumentMarshaler() {
    return {
        booleanVal_: false,
        set: set
    };
};

booleanArgumentMarshaler.getValue = getValue;

module.exports = booleanArgumentMarshaler;

