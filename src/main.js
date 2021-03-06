/*jslint node: true*/

import {Args} from './args1';

(function main() {
    var arg,
        args = process.argv.slice(2),
        logging,
        directory,
        port;
    
    try {
        arg = new Args('l, p#, d*', args);
        
        logging = arg.getBoolean('l');
        port = arg.getNum('p');
        directory = arg.getString('d');
        
        executeApplication(logging, port, directory);
    } catch (e) {
        console.log('Argument error: %s\n', e.message);
    }
})();

function executeApplication(l,p,d) {
    console.log('Executing aplication with params: ',l, p, d)
}