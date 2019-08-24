FROM openjdk:8

WORKDIR /src
RUN mkdir -p reach/papers
COPY ./src ./
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python get-pip.py
RUN pip install pymongo

CMD ["bash" , "setup.sh"]
