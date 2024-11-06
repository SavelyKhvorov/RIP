import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Column, Integer, String, Text
import json

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///books.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

# Initialize database
db = SQLAlchemy(app)


# Define the model for the books table
class Book(db.Model):
    __tablename__ = "books"

    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex)
    userId = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    body = Column(Text, nullable=True)
    sections = Column(Text, nullable=True)  # JSON-encoded list of sections

    def as_dict(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "title": self.title,
            "body": self.body,
            "sections": json.loads(self.sections) if self.sections else []
        }


# Create tables
with app.app_context():
    db.create_all()


# Helper function to convert SQLAlchemy models to dictionaries
def book_to_dict(book):
    return {
        "id": book.id,
        "userId": book.userId,
        "title": book.title,
        "body": book.body,
        "sections": json.loads(book.sections) if book.sections else []
    }


@app.route('/ping', methods=['GET'])
def ping_pong():
    with app.app_context():
        db.create_all()

        db.session.add(Book(userId=2, title='1984', body='Na russkom'))
        db.session.commit()
        #users = db.session.scalars(db.select(meme_page))

    return jsonify('pong!')


@app.route('/books', methods=['GET', 'POST'])
def all_books():
    if request.method == 'POST':
        post_data = request.get_json()
        new_book = Book(
            userId=post_data.get("userId"),
            title=post_data.get("title"),
            body=post_data.get("body"),
            sections=json.dumps(post_data.get("sections", []))
        )
        db.session.add(new_book)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Book added!', 'book': new_book.as_dict()}), 201
    else:
        books = Book.query.all()
        return jsonify([book_to_dict(book) for book in books])


@app.route('/books/<book_id>', methods=['GET', 'PUT', 'DELETE'])
def single_book(book_id):
    book = Book.query.get(book_id)

    if not book:
        return jsonify({'message': 'Book not found'}), 404

    if request.method == 'GET':
        return jsonify(book.as_dict()), 200

    elif request.method == 'PUT':
        post_data = request.get_json()
        book.title = post_data.get('title', book.title)
        book.body = post_data.get('body', book.body)
        book.userId = post_data.get('userId', book.userId)
        book.sections = json.dumps(post_data.get('sections', json.loads(book.sections) if book.sections else []))
        db.session.commit()
        return jsonify({'message': 'Book updated!', 'book': book.as_dict()}), 200

    elif request.method == 'DELETE':
        db.session.delete(book)
        db.session.commit()
        return jsonify({'message': 'Book removed!'}), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')