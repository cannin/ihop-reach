FROM python:3.6

# Copy files to the container
COPY ./Pipfile /project/Pipfile 
COPY ./Pipfile.lock /project/Pipfile.lock
COPY  ./api /project/
# Change workdirectory  to project
WORKDIR /project
# Install pipenv
RUN pip install pipenv
# Install dependencies from pipfiles
RUN pipenv install --system --deploy
# Start the application
CMD [ "python", "app.py" ]
