function WeatherApi () {
    this.WEATHER_API = `http://api.weatherapi.com/v1/current.json?key=c9d40b6d9988427b969105456202312&q=%24Ghent`;
    this.getWeatherData = async () => {
        try {
            const response = await fetch(this.WEATHER_API);
            const weatherData = await response.json();
            return weatherData;
        }catch(error) {
            console.error(error);
        };         
    };
};

function CovidApi () {
    this.COVID_API = `https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=`;
    this.getCovidData = async () => {
        try {
            const response = await fetch(this.COVID_API);
            const covidData = await response.json();
            return covidData;
        } catch(error) {
            console.error(error);
        };         
    };
};

function UsersApi () {
    this.USERS_API = '../app/static/data/pgm.json';
    this.getUserData = async () => {
        try {
            const response = await fetch(this.USERS_API);
            const userData = await response.json();
            return userData;
        } catch(error) {
            console.error(error);
        };
    };
}

function GitHubApi () {
    this.getUserRepos = async (userName) => {
        this.USERREPOS_API = `https://api.github.com/users/${userName}/repos?page=1&per_page=50`
        try {
            const response = await fetch(this.USERREPOS_API);
            const userRepos = await response.json();
            return userRepos;
        } catch(error) {
            console.error(error)
        }
    };

    this.getUserFollowers = async (userName) => {
        this.USERFOLLOWERS_API = ` https://api.github.com/users/${userName}/followers?page=1&per_page=100`;
        try {
            const response = await fetch(this.USERFOLLOWERS_API);
            const userFollowers = await response.json();
            return userFollowers;
        } catch(error) {
            console.error(error)
        }
    };

    this.getGitHubUsers = async (searchInput) => {
        this.GITHUBUSERS_API = `https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=${searchInput}`;
        try {
            const response = await fetch(this.GITHUBUSERS_API);
            const gitHubUsers = await response.json();
            return gitHubUsers;
        } catch(error) {
            console.error(error)
        }
    };
}