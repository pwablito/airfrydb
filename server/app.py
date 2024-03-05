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
    for entry in entries:
        if entry["id"] == recipe_id:
            return json.dumps(entry)
    return "Not found", 404


@app.route("/api/recipes", methods=["POST"])
def new_recipe():
    new_id = str(uuid.uuid4())
    new_entry = request.json
    new_entry["id"] = new_id
    with db_lock:
        entries = read_db()
        print(entries)
        print(type(entries))
        entries.append(new_entry)
        dump_db(entries)
    return json.dumps({
        "success": True,
    })


@app.route("/api/recipes/<string:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    with db_lock:
        entries = read_db()
        if recipe_id not in map(lambda entry: entry["id"], entries):
            return {"message": "Not Found"}, 404
        dump_db(list(filter(lambda entry: entry["id"] != recipe_id, entries)))
    return json.dumps({
        "success": True,
    })


def main():
    app.run("0.0.0.0", 80)


if __name__ == "__main__":
    main()
