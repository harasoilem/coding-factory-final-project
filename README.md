# Coding factory final project

## Github link 

https://github.com/harasoilem/coding-factory-final-project

## how to run the app

```
cd frontend
npm install
npm run start

cd backend
pipenv install
pipenv shell

python manage.py migrate
python manage.py init_test_data
python manage.py runserver 0.0.0.0:8000

```

the user credentials are 

username: demo
password: 123456

## to run backend unit tests

```

python manage.py test

```


## to run integration tests (make sure backend and frontend is running)

```

cd frontend
npm run setup:django:dev:env
npx cypress run

```

## to open cypress UI use open instead of run

```

cd frontend
npm run setup:django:dev:env
npx cypress open

```

## to create a new user

```

cd backend
pipenv shell
python manage.py add_admin_user.py -u username -e test@test.com -p password

```