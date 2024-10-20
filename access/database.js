var fs = require('fs');

module.exports.setToDB = (data) => {
    const dataJson = JSON.stringify(data)
    fs.writeFile('data.json', dataJson, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

module.exports.getToDB = (callBack) => {
    fs.readFile('server/data.json',function (err, data) {
        if (err) throw err;
        try {
            callBack(JSON.parse(data))
        } catch (e) {
            callBack(null)
        }
    });
}