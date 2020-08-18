db_gen.sql is an SQL file that creates all tables necessary for the database.
db_mock.sql is an SQL file that adds mock data to all the tables. 

Run db_gen.sql before db_mock.sql

The first admin account will need the isSuperAdmin and active attributes manually set through the database. 

The endscores created by db_mock.sql will not necessarily line up with the actual game result. 