(() =>{

    const app = {
            initialize() {
                this.cacheElements();
                this.fetchWeatherData();
                this.fetchCovidData();
                this.fetchUsersData();
                this.updateGitHubUsersContainer();
            },

            cacheElements () {  
                this.$weatherContainer = document.querySelector('#weather__container');
                this.$covidCasesContainer = document.querySelector('#covid-cases__container');
                this.$searchBar = document.querySelector('#search-bar');
                this.$usersContainer = document.querySelector('#users__container');
                this.$userDetail = document.querySelector('#user__detail');
                this.$userReposContainer = document.querySelector('#repositories__container');
                this.$userFollowersContainer = document.querySelector('#followers__container');
                this.$gitHubUsersContainer =  document.querySelector('#github-users__container')
            },

            async fetchWeatherData () {
               const weatherApi = new WeatherApi();
               const weatherData = await weatherApi.getWeatherData();
               this.updateWeatherContainer(weatherData)
            },

            updateWeatherContainer (weatherData) {
                const weatherContainer =  `
                                        <span>${weatherData.location.name} ${weatherData.current.temp_c} °</span>
                                        <img src="${weatherData.current.condition.icon}" alt=" ${weatherData.current.condition.text}">
                                        `;
                this.$weatherContainer.innerHTML = weatherContainer;
            },

            async fetchCovidData () {
                const covidApi = new CovidApi();
                const covidData = await covidApi.getCovidData();
                this.updateCovidContainer(covidData);
            },

            updateCovidContainer(data) {
                console.log(data.records[0].fields.cases)
                this.$covidCasesContainer.innerHTML = `${data.records[0].fields.cases}`;
            },

            async fetchUsersData () {
                const usersApi = new UsersApi();
                const usersData = await usersApi.getUserData();
                this.updateUserContainer(usersData);
            },

            updateUserContainer(data){
                const sortedUsers = data.users.sort((user1, user2) => {
                    return user1.lastName.localeCompare(user2.lastName); 
                });

                const updatedUserContainer = sortedUsers.map((user) => {
                    console.log(user.gitHubUserName)
                    return `
                            <li class="user__card" id="${user.portfolio.gitHubUserName}">
                                <img class="user__card__image" src="${user.thumbnail}" alt="Photo of ${user.firstName} ${user.lastName}">
                                <span class="user__card__name">${user.firstName} ${user.lastName}</span>
                            </li>
                                `;
                        }).join('');
                                       
                this.$usersContainer.innerHTML = updatedUserContainer;

                sortedUsers.forEach(user => {
                    const $user = document.querySelector(`#${user.portfolio.gitHubUserName}`);
                    console.log($user)
                    $user.addEventListener('click', () => {
                        this.updateUserDetail(user);
                        this.updateUserRepos(user.portfolio.gitHubUserName);
                        this.updateUserFollowers(user.portfolio.gitHubUserName);
                    } )
                });               
            },            

            updateUserDetail (user) {                
                const updatedUserDetail = `
                                <img class="user__detail__image" src="${user.thumbnail}" alt="Photo of ${user.firstName} ${user.lastName}">
                                <h2 class="user__detail__name">${user.firstName} ${user.lastName}</h2>
                                <p class="user__detail__motto">${user.motto}</p> 
                                <span>${user.lecturer ? 'Lecturer' : 'Student'}</span>
                                <span class="user__detail__age">Age: ${this.calculateAge(user.dateOfBirth)}`;
                this.$userDetail.innerHTML = updatedUserDetail;
            },

            calculateAge (userAge) {
                const newDate =  new Date();
                const currentYear = newDate.getFullYear();
                const userDate = new Date(userAge);
                const yearOfBirth  = userDate.getFullYear();
                return currentYear - yearOfBirth;                
            },

            async fetchUserRepos(user) {
                const userReposApi = await new GitHubApi();
                const userReposData = await userReposApi.getUserRepos(user);
                return userReposData;
            },

            async updateUserRepos (user) {
                const userReposData = await this.fetchUserRepos(user);
                console.log(userReposData)
                const userRepos = await userReposData.map((repo) => {
                    console.log(repo)
                    return `<li>${repo.name}</li>`
                }).join('')
                if(userRepos.length > 0){
                    this.$userReposContainer.innerHTML = userRepos;
                } else {
                    this.$userReposContainer.innerHTML = `${user} has no repositories.`;
                }
                
            },

            async fetchUserFollowers(user) {
                const userFollowersApi = await new GitHubApi();
                const userFollowersData = await userFollowersApi.getUserFollowers(user);
                return userFollowersData;
            },

            async updateUserFollowers (user) {
                const userFollowersData = await this.fetchUserFollowers(user)
                const userFollowers = await userFollowersData.map((follower) => {
                    return `
                            <li class="follower">
                                <img class="follower__image" src="${follower.avatar_url}" alt="Photo of ${follower.login}">
                                <span class="follower__name">${follower.login}</span>
                            </li>
                            `;
                
                }).join('');
                if(userFollowers.length > 0){
                    this.$userFollowersContainer.innerHTML = userFollowers;
                } else {
                    this.$userFollowersContainer.innerHTML = `${user} has no followers.`;
                }
                
            },

            async fetchGitHubUsers (searchInput) {
                const gitHubUsersApi = await new GitHubApi();
                const gitHubUsers = gitHubUsersApi.getGitHubUsers(searchInput);
                return gitHubUsers; 
            },
            
            updateGitHubUsersContainer () {
                this.$searchBar.addEventListener('input', async () => {
                    console.log(this.$searchBar.value);

                    const searchData = await this.fetchGitHubUsers(this.$searchBar.value);
                    console.log(searchData.items)
                    const searchedUsers = await searchData.items.map((user) => {
                        return `
                            <li id="${user.login}" class="user__card">
                                <img class="user__card__image" src="${user.avatar_url}" alt="Photo of ${user.login}">
                                <span class="user__card__name">${user.login}</span>
                            </li>
                            `;
                    }).join('');

                    this.$gitHubUsersContainer.innerHTML = searchedUsers;
                    console.log(searchedUsers)
                    searchData.items.forEach(user => {
                        const $user = document.querySelector(`#${user.login}`);
                        console.log($user)
                        $user.addEventListener('click', () => {
                            this.updateGitHubUserDetail(user);
                            this.updateUserRepos(user.login);
                            this.updateUserFollowers(user.login);
                        } )
                    });        
                })
            },

            updateGitHubUserDetail (user) {                
                const updatedUserDetail = `
                                        <img src="${user.avatar_url}" alt="Photo of ${user.login}">
                                        <h2>${user.login}</h2>
                                        `
                this.$userDetail.innerHTML = updatedUserDetail;
            },

            
    }
    app.initialize();
})();