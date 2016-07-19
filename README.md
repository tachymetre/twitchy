**Twitchy**
============

Twitchy is a web application that utilize the Twitch API to display list of streams for a particular game. User can search streams for a game query and navigate through search results. The application is hosted at [Twitchy](https://tachymetre.github.io/) and be available for review. When implemented, it follows some specific guidelines such as the following: 

- Write a simple web app that hits the Twitch API URL
- Use JSONP when utilizing the Twitch API's
- Build the URL based on the query entered by the user in the search box shown in the mock
- Build out the list as shown
- All UI elements are mandatory and self-explanatory
- Feel free to add more/better UI, as long as you include the mandatory elements
- No frameworks like jQuery/AngularJS, please use vanilla JS to implement UX, hit the API and render content

## Development Environment
If you've never used [Node](https://nodejs.org/en/) or [npm](https://www.npmjs.com/) before, you'll need to install Node.
If you use homebrew, do:

```
brew install node
```

Clean all dependencies cache, if any

```
npm run app-clean
```

Remove `node_modules` folder for a fresh build

```
npm run app-remove
```

Install all the needed development dependencies

```
npm run app-update
```

Boot up a local server for live editing

```
npm run serve
```

## Version
1.0.0

## License

Pantoum is written and maintained by [Minh Pham](https://github.com/tachymetre), and is licensed under [MIT](https://opensource.org/licenses/MIT).