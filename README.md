# node-postgres
CRUD operations

Tables
  Users: create table Users (email text primary key not null, password text);
  Email: create table Email (id serial primary key, sender text not null, receiver text not null, subject text, body text, date text, time text);
  
  Email: Alter table Email add read_status text;
  
  
  Deleted: create table Deleted (id serial primary key, sender text not null, receiver text not null, subject text, body text, date text, time text);
