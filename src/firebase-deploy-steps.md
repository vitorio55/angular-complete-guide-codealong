# Steps for deploy in Firebase

1- First build app for production

    $ ng build --prod

2- Install Firebase CLI

    $ npm install -g firebase-tools

3- Login into Firebase (using Google Account)

    $ firebase login

4- Initialize local project into Firebase

    $ firebase init
    (select 'Hosting: Configure and deploy Firebase Hosting sites')
    (select the project created in Firebase server*)
    (enter 'dist/ng4-complete-guide' for the public directory)
    (select 'y' for single-page app -> /index.html)
    (select 'n' for NOT overwriting the original index.html)

    *we created the project in Firebase servers when we created the backend

5- Deploy into Firebase

    $ firebase deploy

6- To stop the application on Firebase

    $ firebase hosting:disable
