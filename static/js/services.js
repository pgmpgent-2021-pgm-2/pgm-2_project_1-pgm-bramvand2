function WeatherApi () {
    this.weatherApiKey = 'c9d40b6d9988427b969105456202312';
    this.city = 'Ghent';
    this.WEATHER_API = `http://api.weatherapi.com/v1/current.json?key=c9d40b6d9988427b969105456202312&q=%24Ghent`;
    this.getWeatherData = async () => {
        try {
            const response = await fetch(this.WEATHER_API);
            const weatherData = await response.json();
            return weatherData;
        }catch(error) {
            console.error(error)
        }
        ; 
    };
};

function CovidApi () {
    this.COVID_API = `https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=`;
    this.getCovidData = async () => {
        try {
            const response = await fetch(this.COVID_API);
            const covidData = await response.json();
            return covidData;
        }catch(error) {
            console.error(error)
        }
        ; 
    };
};

function GitHubApi () {
    this.GITHUBAPI = ''
}