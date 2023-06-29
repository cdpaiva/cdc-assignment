## Pantry Manager

A Next.js app, where users can track the items they have in their pantry.

To run the app locally, clone the repo and install the dependencies with `npm install`.

The app requires some env variables to run properly, so you will need to create up a `.env.local` file in the root of the project.
This file should contain the following values:

```
MONGODB_URI=*mongodb connection string*
JWT_SECRET=*random string to hash the tokens*
JWT_EXPIRATION=*token expiration period*
SENDGRID_API_KEY=*sendgrid api key sending mail*
RAPID_API_KEY=*rapid api key to use the GeoDB Cities API*
RAPID_API_HOST=*rapid api host address*
```

Regarding the rubrics for the React project, this app:

- [x] Was created with Next.js
- [x] Uses several different data types
- [x] Has dynamic routes, following Next.js built-in routing
- [x] Consumes the GeoDB Cities API and renders the data
- [x] Allows users to sort the fetched data from GeoDB API
- [x] Uses different input fields: text fields and drop-down lists
- [x] Implements error handling for all api requests
- [x] Uses functional components, and built-in react hooks, such as useState, useReducer and useEffect
- [x] Has a Nav element to aid user navigation
- [x] API keys are not exposed
- [x] Styled with tailwind.css
- [x] Responsive

Additionally:

- [x] The app is full-stack, using API Routes for the back-end
- [x] Stores data in MongoDB, including user data
- [x] Requires user authorization by JWT to retrieve/change their data
- [x] Tokens are parsed with a Higher Order Function, that works simillar to express middleware
- [x] Is deployed in vercel
