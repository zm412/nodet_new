# nodet project

## Distinctiveness and complexity:

nodet_test is simple fullstack project based on NodeJS (ExpressJS) with
frontend on JS, pack by docker-compose. Frontend side has one page (/views/index.html).

During the development, the following functionality was implemented:

### Query elements by unique id
Request forms by id are located on the main page under the headings:
* Find country by id
* Find satellite by id


### Viewing the list of elements of each type by page
Output is available in the amount of 3, 5 or 10 elements per page).  Forms for requests are implemented in blocks:
* Get countries
* Get satellites

###  Getting related elements
The type of connection of conditional "entities" in this application is similar
ManyToMany (One satellite is launched by many countries, and each country
can launch many satellites).

### Search for elements by an arbitrary string key.
Search form is in the block: 
* Search item 

When a string is sent, searching is happaning for all
database records, by the name field. Field values starting with
searched string will also be displayed in the list of results.

## Additional Methods(development)

##### Adding a country 
**Add country**

##### Adding a satellite 
**Add satellite**

##### Open lists of all elements of type (with button Delete) 
**Open List of countries**
**Open List of satellites**

##### Delite element 
**If the satellite has no countries left, the satellite is removed from the database**

## Files: 
* docker-compose.yml
* dbdata/ - folder for data (in this project, db is included in pack)

### expressapp/ - main folder
* expressapp/app.js - server NodeJS/ExpressJS
* expressapp/Dockerfile - settings for nodeapp-container
* expressapp/views - folder for html pages
* expressapp/public - folder for js and css   
* expressapp/json_data.txt - file with data JSON


## Installation and configuration

1. Clone the git repository

$git clone https://github.com/zm412/nodet_new.git

2. Go to the nodet_new folder

$cd nodet_new 

3. Enter the instructions 

$docker-compose up --build

