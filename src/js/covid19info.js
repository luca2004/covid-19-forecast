import axios from 'axios';


class Covid19InfoAPI{

    constructor(opts){

        this.opts = Object.assign( {}, 
            { 
                uri: 'https://covidapi.info/api/v1'       
            }, 
            opts);

    }

    request_get_api(uri){
        return new Promise( (resolve, reject) => {
            axios.get( uri,
                {
                    headers: {
                        
                    }
                }
            )
            .then( (response) => {
                resolve( response.data );
            } )
            .catch( (error) => {
                reject( error );
            })
        });
    }

    CountryHistoricData(CountryCodeISO3166){
        return this.request_get_api( this.opts.uri +'/country/' +  CountryCodeISO3166);
    }

    CountryTimeSeriesData(CountryCodeISO3166, datestart, dateend){
        return this.request_get_api( this.opts.uri +'/country/' +  CountryCodeISO3166 + '/timeseries/'+datestart+'/'+dateend);
    }


}

export default Covid19InfoAPI;