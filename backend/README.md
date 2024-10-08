# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

# PostGRES code

* docker exec -it iss-appointment-setter-db-1 psql -U postgres

* \c your_database_name

* \dt

* \q

* sudo lsof -i :5432
* sudo kill -9 {PID}



# Ruby Backend code

* docker exec -it iss-appointment-setter-backend-1 bash