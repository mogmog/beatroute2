# Beatroute

#### install git and tmux

sudo apt-get install git tmux

#### get repo

````
git clone https://github.com/mogmog/beatroute2.git
````

####Get Python
        ```
        $ sudo apt-get install python-virtualenv
        $ sudo apt-get install python3-pip
        $ sudo apt-get install python3-setuptools
        $ sudo easy_install3 pip
        
        $cd Propaganda
        $ virtualenv -p python3 env
        
        $ source env/bin/activate
        $ cd api
        $ pip install -r requirements.txt
        ```

* #### Environment Variables (start.sh does this for you)
    ```
    export APP_SETTINGS="development"
    export DATABASE_URL="postgresql://postgres:postgres@localhost/tracker"
    ```
    
  ### To create the database
  
  sudo apt-get install postgresql postgresql-contrib
  
  
  sudo -u postgres psql
  From the resulting prompt:
  
  ALTER USER postgres PASSWORD 'postgres';
  CREATE DATABASE beatroute2;
  
  update pg_database set encoding = pg_char_to_encoding('UTF8') where datname = 'beatroute2';

  
   
  (control d to exit)
  
    
  ### Install Node
  
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
  sudo apt-get install -y nodejs
  
  
  ### Install js requirements
  cd ..
  npm install
  

 #### Build database
 
     (Remember to be in the virtualenvironment and have set the environment variables)
     
       source brenv/bin/activate
       export APP_SETTINGS="development"
       export DATABASE_URL="postgresql://postgres:postgres@localhost/beatroute2"
         
 
    ```
    (env)$ python manage.py db init

    (env)$ python manage.py db migrate
    ```

    And finally, migrate your migrations to persist on the DB
    ```
    (env)$ python manage.py db upgrade
    ```


### Populate DB

- `psql -U postgres -d tracker -a -f api/sql/tracker_public_country.sql -h localhost`


### edit database

psql -U postgres -d tracker -h localhost

SELECT * from cards 
````start.sh````

### tmux help

To use tmux, start it using start.sh

 - control b and then arrow keys to swap panes
 - control b and press d to get out of tmux panes (it is all still running)
 - tmux kill-server will stop all processes in all panes
 






