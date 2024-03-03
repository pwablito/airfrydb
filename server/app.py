from flask import Flask, request
import json
import os
import threading
import uuid


app = Flask("Air Fry DB")
DB_FILE_PATH=os.getenv("DB_FILE", "./data.json")
db_lock = threading.Lock()


def read_db():
    with open(DB_FILE_PATH, "r") as f:
        return json.load(f)


def dump_db(data):
    with open(DB_FILE_PATH, "w") as f:
        return json.dump(data, f)


if not os.path.exists(DB_FILE_PATH):
    dump_db({})


@app.route("/api/recipes", methods=["GET"])
def get_recipes():
    with db_lock:
        entries = read_db()
    return json.dumps(entries)


@app.route("/api/recipes/<string:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    with db_lock:
        entries = read_db()
    if recipe_id not in entries:
        return "Not found", 404
    return json.dumps(entries[recipe_id])


@app.route("/api/recipes", methods=["POST"])
def new_recipe():
    new_id = uuid.uuid4()
    with db_lock:
        entries = read_db()
        entries[new_id] = request.json()
        dump_db(entries)
    return json.dumps({
        "success": True,
    })


@app.route("/api/recipes/<string:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    with db_lock:
        entries = read_db()
        if recipe_id not in entries:
            return {"message": "Not Found"}, 404
        del entries[recipe_id]
        dump_db(entries)
    return json.dumps({
        "success": True,
    })


def main():
    app.run("0.0.0.0", 80)


if __name__ == "__main__":
    main()
