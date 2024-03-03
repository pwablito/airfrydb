FROM python:3.9 as base

RUN mkdir /app
WORKDIR /app
COPY * .

RUN python3 -m pip install -r requirements.txt

ENTRYPOINT [ "python3", "app.py" ]