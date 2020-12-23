(() =>{

    const app = {
            initialize() {
                this.cacheElements();
                this.fetchWeatherData();
                this.fetchCovidData();
                this.searchUsers();
            },

            cacheElements () {  
                this.$weatherDisplay = document.querySelector('#weather-display');
                this.$covidDisplayCases = document.querySelector('#covid-display__cases');
                this.$searchBar = document.querySelector('#search-bar');
                this.$searchButton = document.querySelector('#search-button')
            },

            async fetchWeatherData () {
               const weatherApi = new WeatherApi();
               const weatherData = await weatherApi.getWeatherData();
               this.updateWeatherDisplay(weatherData)
            },

            updateWeatherDisplay (weatherData) {
                const weatherDisplay =  `
                                        <li>${weatherData.location.name}</li>
                                        <li>${weatherData.current.temp_c} °</li>
                                        <li><img src="${weatherData.current.condition.icon}" alt=" ${weatherData.current.condition.text}"></li>
                                        `;
                this.$weatherDisplay.innerHTML = weatherDisplay;
            },

            async fetchCovidData () {
                const covidApi = new CovidApi();
                const covidData = await covidApi.getCovidData();
                this.updateCovidDisplay(covidData);
            },

            updateCovidDisplay(covidData) {
                console.log(covidData.records[0].fields.cases)
                this.$covidDisplayCases.innerHTML = `${covidData.records[0].fields.cases}`;
            },

            searchUsers () {
                this.$searchBar.addEventListener('input', () => {
                    console.log(this.$searchBar.value);
                })
            },

            
    }
    app.initialize();
})();