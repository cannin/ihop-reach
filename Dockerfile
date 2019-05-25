FROM python:3.6

COPY ./Pipfile /project/Pipfile
COPY ./Pipfile.lock /project/Pipfile.lock
COPY  ./api /project/

WORKDIR /project

RUN pip install pipenv

RUN pipenv install --system --deploy

CMD [ "python", "app.py" ]