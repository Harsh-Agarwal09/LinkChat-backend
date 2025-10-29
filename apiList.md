# LinkChat APIs

## authRouter - User Authentication
- POST /signup - To signup a new user
- POST /login - To login a user
- POST /logout - To logout a user

## profileRouter - User Profile
- GET /profile/view - To get or view my profile
- PATCH /profile/edit - To update my profile
- PATCH /profile/password - To change my password

## connectionRequestRouter - Connection Request
- POST /request/send/:status/:userId
<!-- -- POST /request/send/interested/:userId -->
<!-- -- POST /request/send/ignored/:userId -->

- POST /request/review/:status/:requestId
<!-- - POST /request/review/accepted/:requestId -->
<!-- - POST /request/review/rejected/:requestId -->
 
## userRouter - User
- GET /user/requests/received - Gets you the requests you have received
- GET /user/connections - To get my connections
- GET /user/feed - Gets you the profile of other users on the platform


Status: interested,ignored, accepted, rejected