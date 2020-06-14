import axios from 'axios';


class Covid19InfoAPI {

    constructor(opts) {

        this.opts = Object.assign({},
            {
                uri: 'https://covidapi.info/api/v1'
            },
            opts);

    }

    request_get_api(uri) {
        return new Promise((resolve, reject) => {
            axios.get(uri,
                {
                    headers: {

                    }
                }
            )
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                })
        });
    }

    async CountryHistoricData(CountryCodeISO3166) {
        return await this.request_get_api(this.opts.uri + '/country/' + CountryCodeISO3166);
    }

    async CountryTimeSeriesData(CountryCodeISO3166, datestart, dateend) {
        let data = await this.request_get_api(this.opts.uri + '/country/' + CountryCodeISO3166 + '/timeseries/' + datestart + '/' + dateend);
        console.log(data);
        data.result = data.result.filter((value, index) => {
            const _value = JSON.stringify(value);
            return index === data.result.findIndex(obj => {
                return JSON.stringify(obj) === _value;
            });
        })
        return data;
    }


}

export default Covid19InfoAPI;