(() =>{

    const app = {
            initialize() {
                this.cacheElements();
                this.fetchWeatherData();
                this.onClickShowPgmList();
                this.onClickShowGitHubList();
                this.onClickToggleDarkmode();
                this.updateGitHubUsersContainer();
                setInterval(() => this.updateDigitalClock(), 1000);
                
                               
            },

            cacheElements () {  
                this.$weatherContainer = document.querySelector('#weather__container');
                this.$covidCasesContainer = document.querySelector('#covid-cases__container');
                this.$searchBar = document.querySelector('#search-bar');
                this.$usersContainer = document.querySelector('#users__container');
                this.$userDetail = document.querySelector('#user__detail');
                this.$userReposContainer = document.querySelector('#repositories__container');
                this.$userFollowersContainer = document.querySelector('#followers__container');
                this.$gitHubUsersContainer =  document.querySelector('#github-users__container');
                this.$gitHubUsersWrapper = document.querySelector('#github-users__wrapper')
                this.$pgmListButton = document.querySelector('#pgm-list__button');
                this.$gitHubListButton = document.querySelector('#github-list__button');
                this.$modeSelectorButton = document.querySelector('#mode-selector__button')
                this.$ditigalClock = document.querySelector('#digital-clock');
                this.$utcSelector = document.querySelector('#utc-selector')

            },

            async fetchWeatherData () {
               const weatherApi = new WeatherApi();
               const weatherData = await weatherApi.getWeatherData();
               this.updateWeatherContainer(weatherData);
               this.fetchCovidData();
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
                this.fetchUsersData();
            },

            updateCovidContainer(data) {
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
                    $user.addEventListener('click', () => {
                        this.updateUserDetail(user);
                        this.updateUserRepos(user.portfolio.gitHubUserName);
                        this.updateUserFollowers(user.portfolio.gitHubUserName);
                    } )
                });               
            },            

            updateUserDetail (user) {                
                const updatedUserDetail = `
                                <a href="https://github.com/${user.portfolio.gitHubUserName}" target="_blank">
                                    <img class="user__detail__image" src="${user.thumbnail}" alt="Photo of ${user.firstName} ${user.lastName}">
                                    <h2 class="user__detail__name">${user.firstName} ${user.lastName}</h2>
                                    <p class="user__detail__motto">${user.motto}</p> 
                                    <span>${user.lecturer ? 'Lecturer' : 'Student'}</span>
                                    <span class="user__detail__age">Age: ${this.calculateAge(user.dateOfBirth)}</span>
                                </a>`;
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
                const userRepos = await userReposData.map((repo) => {
                    return  `
                            <li>
                            <a href="${repo.html_url}" target="_blank">
                                    <ul class="repository">
                                        <li><h3 class="repository__name">${repo.name}</h3></li>
                                        <li><p class="repository__description">${repo.description !== null ? repo.description : 'No description'}</p></li>
                                        <li><ul class="repository__info">
                                                <li>${repo.size} KB</li>
                                                <li><img src="static/media/SVG/git-branch.svg" alt="Icon git-branch">${repo.default_branch}</li>
                                                <li><img src="static/media/SVG/law.svg" alt="Icon git-branch">${repo.license !== null ? repo.license.name : `No License`}</li>
                                                <li><img src="static/media/SVG/shield.svg" alt="Icon git-branch">${repo.private ? `Private` : `Public`}</li>
                                                <li><img src="static/media/SVG/repo-forked.svg" alt="Icon git-branch">${repo.fork}</li>
                                                <li><img src="static/media/SVG/issue-opened.svg" alt="Icon git-branch">${repo.open_issues}</li>
                                                <li><img src="static/media/SVG/eye.svg" alt="Icon git-branch">${repo.watchers}</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </a>
                            </li>
                            `
                }).join('')
                if(userRepos.length > 0){
                    this.$userReposContainer.innerHTML = userRepos;
                } else {
                    this.$userReposContainer.innerHTML = `<p>${user} has no repositories.</p>`;
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
                                <a  href="${follower.html_url}" target="_blank">
                                    <img class="follower__image" src="${follower.avatar_url}" alt="Photo of ${follower.login}">
                                    <span class="follower__name">${follower.login}</span>
                                </a>
                            </li>
                            `;
                
                }).join('');
                if(userFollowers.length > 0){
                    this.$userFollowersContainer.innerHTML = userFollowers;
                } else {
                    this.$userFollowersContainer.innerHTML = `<p>${user} has no followers.</p>`;
                }
                
            },

            async fetchGitHubUsers (searchInput) {
                const gitHubUsersApi = await new GitHubApi();
                const gitHubUsers = gitHubUsersApi.getGitHubUsers(searchInput);
                return gitHubUsers; 
            },

            async updateGitHubUsers (searchInput) {
                const searchData = await this.fetchGitHubUsers(searchInput);
                const searchedUsers = searchData.items.map((user) => {
                    return `
                        <li id="${user.login}" class="user__card">
                            <img class="user__card__image" src="${user.avatar_url}" alt="Photo of ${user.login}">
                            <span class="user__card__name">${user.login}</span>
                        </li>
                        `;
                }).join('');

                this.$gitHubUsersContainer.innerHTML = searchedUsers;
                searchData.items.forEach(user => {
                    const $user = document.querySelector(`#${user.login}`);
                    $user.addEventListener('click', () => {
                        this.updateGitHubUserDetail(user);
                        this.updateUserRepos(user.login);
                        this.updateUserFollowers(user.login);
                    });
                    console.log('done')
                });
            },
            
            updateGitHubUsersContainer () {
                this.$searchBar.addEventListener('keydown', (event) => {
                    
                    if(event.keyCode === 13) {
                        console.log('click');
                        // if(this.$searchBar.value != 0){
                            this.updateGitHubUsers(this.$searchBar.value);
                        // }
                               
                    }else{
                        console.log('not enter')
                    }        
                }, false);
            },

            updateGitHubUserDetail (user) {                
                const updatedUserDetail = `
                                        <a href="${user.html_url}" target="_blank">
                                            <img class="user__detail__image" src="${user.avatar_url}" alt="Photo of ${user.login}">
                                            <h2 class="user__detail__name">${user.login}</h2>
                                        </a>
                                        `
                this.$userDetail.innerHTML = updatedUserDetail;
            },

            onClickShowPgmList () {
                this.$pgmListButton.addEventListener('click', () => {
                    if(this.$usersContainer.classList.contains('hidden')){
                        this.$usersContainer.classList.remove('hidden');
                        this.$gitHubUsersWrapper.classList.add('hidden');                    
                    };                    
                })
            },

            onClickShowGitHubList () {
                this.$gitHubListButton.addEventListener('click', () => {
                    if(this.$gitHubUsersWrapper.classList.contains('hidden')){
                        this.$gitHubUsersWrapper.classList.remove('hidden');
                        this.$usersContainer.classList.add('hidden');
                    
                    };                    
                })
            },

            onClickToggleDarkmode () {
                this.$modeSelectorButton.addEventListener('click', ()  => {
                    document.body.classList.toggle('dark');
                    this.$modeSelectorButton.classList.toggle('selected');
                })
            },

            updateDigitalClock () {
                const utc = parseInt(this.$utcSelector.value, 10);
                const digitalClock = new DigitalClock ();
                const currentTime = digitalClock.startTime(utc);
                this.$ditigalClock.innerHTML = currentTime;               
            }
            
    }
    app.initialize();
})();