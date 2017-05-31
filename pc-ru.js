/**
 * Created by apetrov on 31.05.2017.
 */
/**
 * Данные предоставлены организацией "Аналитический центр при Правительстве Российской Федерации"
 * @type {exports|module.exports}
 */


const _ = require('lodash');
const http = require('http');
const fs = require('fs');

function Pcru(token) {
    if (!token) return console.log('ERROR! Not found token.');
    this.dt = new Date();
    this.url = 'http://data.gov.ru/api/json/dataset/7708660670-proizvcalendar/version/20151123T183036/content?search=';
    this.token = token;
    this.year = this.dt.getFullYear();
    this.month = [];
    this.holiday = [];
    this.pathData = 'data_' + this.year + '.json';
}


/**
 * Получить все данные за год.
 * По умолчанию текущий год.
 * Установить год (>1998) для календаря если нужно.
 * @param year
 */
Pcru.prototype.getCalendar = function (year) {
    if (year) {
        this.year = (year.match(/\d\d\d\d/i) && year > 1998) ? year : this.year;
        this.pathData = (this.year == year) ? 'data_' + this.year + '.json' : this.pathData;
    }
    if (fs.existsSync(this.pathData)) return;
    var file = fs.createWriteStream(this.pathData);
    console.log('Загружены новые данные: ' + this.year);
    http.get(this.url + this.year + '&access_token=' + this.token, function (res) {
        res.pipe(file);
    });
};


/**
 * Получить все праздничные дни год/месяц, если указать параметр monthNumber:
 * '1'  январь
 * '2'  февраль
 * '3'  март
 * и т.д.
 * @param monthNumber
 */
Pcru.prototype.getHolidays = function (monthNumber) {
    fs.readFile(this.pathData, (err, data) => {
        if (err) return ('Server Error');
        if (data.length) {
            var dataFile = JSON.parse(data.toString());
            if (_.isArray(monthNumber) && monthNumber.length > 0) {
                for (let i = 0; i < monthNumber.length; i++) {
                    this.month = monthNumber[i];

                    this.month = (this.month.match(/(^[1-9]$)|(^[1][0-2]$)/i)) ? this.month : '' ;

                    switch (this.month) {
                        case '1' :
                            this.month = 'Январь';
                            break;
                        case '2' :
                            this.month = 'Февраль';
                            break;
                        case '3' :
                            this.month = 'Март';
                            break;
                        case '4' :
                            this.month = 'Апрель';
                            break;
                        case '5' :
                            this.month = 'Май';
                            break;
                        case '6' :
                            this.month = 'Июнь';
                            break;
                        case '7' :
                            this.month = 'Июль';
                            break;
                        case '8' :
                            this.month = 'Август';
                            break;
                        case '9' :
                            this.month = 'Сентябрь';
                            break;
                        case '10' :
                            this.month = 'Октябрь';
                            break;
                        case '11' :
                            this.month = 'Ноябрь';
                            break;
                        case '12' :
                            this.month = 'Декабрь';
                            break;
                    }
                    console.log('МЕСЯЦ: '+this.month);

                    var t = dataFile[0][this.month];
                     this.holiday.push(t.split(','));
                }

                //console.log(this.month);
                console.log('HOLIDAY');
                console.log(this.holiday);
                return this.holiday;
            }
            return console.log(dataFile[0]);
        }
    });
};

module.exports = Pcru;