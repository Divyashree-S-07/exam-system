const fs = require('fs');
const path = require('path');
console.log('Current directory:', process.cwd());
try {
    fs.writeFileSync('test_output.txt', 'Hello World');
    console.log('Write successful');
} catch (e) {
    console.error('Write failed:', e);
}
