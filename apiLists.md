# pingMe APIs

## authRouter
POST /signup
POST /login
POST/Logout

## profileRouter
GET/profile/view
PATCH/profile/edit
PATCH/profile/password

## connectionRequestRouter
POST/request/send/:status/:userId
POST/request/review/:status/:requestId

## userRouter
GET /user/connections
GET/requests/received
GET/feed Gets you the profiles of other users on platform

Status: ignore, interested, accepeted, rejected